/**
 * @param {import('knex')} knex
 */
 exports.up = async (knex) => { 
  await knex.raw('DROP PROCEDURE IF EXISTS rebooking');
  await knex.raw('DROP FUNCTION IF EXISTS verfügbarkeit');
  await knex.raw('DROP TRIGGER IF EXISTS reduzierung_plaetze');
  await knex.raw('DROP TRIGGER IF EXISTS storniere');
  await knex.raw('DROP FUNCTION IF EXISTS maxAnzahlPersonen');
  await knex.raw('DROP FUNCTION IF EXISTS gesamtanzahl_Plaetze');
  await knex.raw('DROP TRIGGER IF EXISTS maxAnzahlPersonen_t');
  await knex.raw( 'DROP TRIGGER IF EXISTS checkInsertBegleiter');

  
  await knex.raw(`

  CREATE TRIGGER maxAnzahlPersonen_t
  AFTER INSERT ON CoronaInfo FOR EACH ROW BEGIN


      DECLARE running INT DEFAULT TRUE;
      DECLARE RAUMID INT;
      DECLARE FLAECHE FLOAT;

      DECLARE CURSOR1 CURSOR FOR SELECT id , Flaeche_in_m2 FROM Raum ;
      DECLARE CONTINUE HANDLER FOR NOT FOUND SET running = FALSE;

      OPEN CURSOR1;

      WHILE running DO
          FETCH CURSOR1 INTO RAUMID , FLAECHE;
          UPDATE Raum
              SET max_Anzahl_Personen = FLOOR(FLAECHE * NEW.maxAnzahlPersonnen_pro_qm)
              WHERE id = RAUMID;
      END WHILE ;

      CLOSE CURSOR1;

  END;
  `);

  await knex.raw(
    `
   
    CREATE PROCEDURE rebooking(IN newDate date, IN bookingID int)
BEGIN
    IF CURDATE() <= newDate THEN
        UPDATE Reservierung
        SET Datumszeit = newDate
        WHERE id = bookingID;
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Umbuchung nur für den Folgetag möglich!';

    END IF;

END ;
    `
  );

  
  // setze storniert auf 1 in alles reservierungen die tisch plätze reduziert bekommen
  await knex.raw(`
  create trigger storniere
      before update
      on Tisch
      for each row
  
  main:begin
      declare finished integer default 0;
      declare r_id integer;
      declare reservierungen_c cursor for select id
                                          from Tischreservierung t
                                                  join Reservierung R on t.reservierung_id = R.id
                                          where t.Tisch_id = OLD.id;
  
      DECLARE CONTINUE HANDLER FOR NOT FOUND SET finished = 1;
      if old.anzahl_plaetze <= new.anzahl_plaetze then
          Leave main;
      end if ;
      open reservierungen_c;
      readloop:
      LOOP
          if finished = 1 then
              Leave readloop;
          end if;
          fetch reservierungen_c into r_id;
          update Reservierung set storniert = 1 where id = r_id;
      end loop readloop;
  
      close reservierungen_c;
  end ;
    `)
  await knex.raw(`
  CREATE FUNCTION verfügbarkeit(DATUM datetime) returns integer
  BEGIN
      declare result integer default 0;
      declare finished integer default 0;
      declare sum integer default 0;
      declare r_date datetime;
      declare reservierung_c cursor for select sum(anzahl_plaetze), R.Datumszeit
                                        from Reservierung R
                                                 join Tischreservierung T on R.id = T.reservierung_id
                                                 join Tisch T2 on T2.id = T.Tisch_id
                                        group by R.id;
      DECLARE CONTINUE HANDLER
          FOR NOT FOUND SET finished = 1;
      open reservierung_c;
      main:
      loop
          if finished = 1 then
              Leave main;
          end if;
          fetch reservierung_c into sum,r_date;
          insert into logs (log) values(CONCAT('Sum is:',sum,' date is:',r_date,' args is:',DATUM));
          if r_date = DATUM then
              set result = result + sum;
          end if;
      end loop main;
      close reservierung_c;
      return result;
  END ;
  `)    

    await knex.raw(`
    create
    function maxAnzahlPersonen(idRaum int, datum1 int) RETURNS INTEGER
      BEGIN
      DECLARE maxAnzahlpQ INTEGER;
      DECLARE flaeche FLOAT;
      DECLARE maxAnzahl INTEGER;
      SELECT maxAnzahlPersonnen_pro_qm INTO maxAnzahlpQ FROM CoronaInfo WHERE Datum = datum1;
      SELECT Flaeche_in_m2 INTO flaeche FROM Raum WHERE id = idRaum;
      SET maxAnzahl = maxAnzahlpQ * flaeche;
      UPDATE Raum SET max_Anzahl_Personen = maxAnzahl WHERE id = idRaum;
      RETURN maxAnzahl;
      END;
    `  
    )

    await knex.raw(`
    
CREATE FUNCTION gesamtanzahl_Plaetze(raumId INT)
    RETURNS INT
BEGIN
    DECLARE v_maxAnzahlPlaetze INT;

    Select SUM(anzahl_plaetze)
    INTO v_maxAnzahlPlaetze
    from Raum
             join Tischgruppe T
                  on Raum.id = T.Raum_id
             join Tisch T2 on T.id = T2.Tischgruppe_id
    WHERE Raum.id = raumId;
    RETURN v_maxAnzahlPlaetze;

END ; 
    
    `)

    await knex.raw(`
    CREATE TRIGGER reduzierung_plaetze
    BEFORE UPDATE
    ON Raum
    FOR EACH ROW
BEGIN
    DECLARE v_currAnzahlPlaetze INT;
    DECLARE v_raumId INT;
    DECLARE c_plaetze INT;
    DECLARE v_tischId INT;
    DECLARE tmp_pltz INT;
    DECLARE done INT DEFAULT FALSE;
    DECLARE mycursor CURSOR FOR SELECT T2.id, T2.anzahl_plaetze
                                from Raum
                                         join Tischgruppe T on Raum.id = T.Raum_id
                                         join Tisch T2 on T.id = T2.Tischgruppe_id;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
    SET v_raumId = NEW.id;
    SET v_currAnzahlPlaetze = gesamtanzahl_Plaetze(v_raumId);
    open mycursor;
    readloop:
    LOOP
        fetch mycursor into v_tischId,c_plaetze;
        IF done or v_currAnzahlPlaetze <= NEW.max_Anzahl_Personen then
            Leave readloop;
        END IF;

        Select anzahl_plaetze into tmp_pltz from Tisch where Tisch.id = v_tischId;
        UPDATE Tisch set anzahl_plaetze = 0 where id = v_tischId;
        IF tmp_pltz >= v_currAnzahlPlaetze THEN
            UPDATE Tisch
            SET anzahl_plaetze = NEW.max_Anzahl_Personen
            WHERE id = v_tischId;

        SET v_currAnzahlPlaetze = NEW.max_Anzahl_Personen;
        ELSE
            UPDATE Tisch set anzahl_plaetze = 0 where id = v_tischId;
        END IF;

        Set v_currAnzahlPlaetze = v_currAnzahlPlaetze - tmp_pltz; -- gesamtanzahl aller Tische im Raum - anzahl plaetze
    END loop;
END ;
    
    `)






    await knex.raw(`
    create trigger checkInsertBegleiter
        before insert
        on Begleiter
        for each row
    BEGIN
        DECLARE idReservierung INTEGER;
        DECLARE idKunde INTEGER;
        DECLARE datumReservierung DATE;

        DECLARE cur1 CURSOR FOR SELECT Reservierung_id, Kunde_id FROM Begleiter WHERE Reservierung_id = NEW.Reservierung_id;

        OPEN cur1;
        read_loop: LOOP
            FETCH cur1 INTO idReservierung, idKunde; #hier noch KundenID checken
            #Durchlaufen von allen Reservierungen, an die der Begleiter teilnimmt
            IF idReservierung = NEW.Reservierung_id AND idKunde = NEW.Kunde_id THEN
                  SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Begleiter darf nicht zweimal der gleichen Reservierung hinzugefügt werden';
            END IF;
        END LOOP;
        CLOSE cur1;
    END;
    `)

    await knex.raw(`
    CREATE PROCEDURE BegleiterHinzufuegen(IN ReservierungsId INT , IN BegleiterId INT  )
      BEGIN

      IF BegleiterId NOT IN
        (SELECT id FROM Kunde
        WHERE id = BegleiterId) THEN
          SIGNAL SQLSTATE '20001' SET MESSAGE_TEXT = 'BEGLEITER DOES NOT EXISTENT';
      ELSEIF ReservierungsId NOT IN
      (SELECT id FROM Reservierung
      WHERE id = ReservierungsId) THEN
          SIGNAL SQLSTATE '20002' SET MESSAGE_TEXT = 'RESERVIERUNG DOES NOT EXISTENT';
      ELSE
          INSERT Begleiter(kunde_id, reservierung_id) VALUES (
                                                              BegleiterId,
                                                              Reservierungsid
                                                            );
      END IF;

    END;
    `);

    return
  await knex.raw(`
  create trigger checkInsertReservierer
    before insert
    on Reservierung
    for each row
    BEGIN
    #Variablen für Reservierer und Begleiter
    DECLARE reserviererID VARCHAR(45);

    #check für den Reservierer
    SELECT reservierer_id_id INTO reserviererID FROM Reservierung WHERE Datumszeit = NEW.Datumszeit;
    IF reserviererID = NEW.reservierer_id_id THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Reservierer hat bereits eine Reservierung an diesem Datum';
    END IF;
    END;  
  `)





  return 
  await knex.raw('DROP FUNCTION IF EXISTS Hello');
  await knex.raw('DROP FUNCTION IF EXISTS isEligible');
  await knex.raw(
    `create
      function Hello() returns char(36)
        BEGIN
          RETURN 'Hello';
        END;
    `);

  await knex.raw(
      `
      CREATE OR REPLACE PROCEDURE maxAnzahlPersonen
      BEGIN
      DECLARE maxAnzahlpQ INTEGER;
      DECLARE flaeche FLOAT;
      DECLARE maxAnzahl INTEGER;
      SELECT maxAnzahlPersonnen_pro_qm INTO maxAnzahlpQ FROM CoronaInfo WHERE Datum = CURDATE();
      SELECT Flaeche_in_m2 INTO flaeche FROM Raum WHERE id = idRaum;
      SET maxAnzahl = maxAnzahlpQ * flaeche;
      UPDATE Raum SET maxAnzahlRaum = maxAnzahl WHERE id = idRaum;
      END
      `);
return
  await knex.raw(
      `
      BEGIN
      DECLARE kundenid INT;
      SET kundenid = 0;
      SELECT id INTO kundenid FROM Kunde WHERE Kunde_id = id;
      IF kundenid = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Bitte zuerst den Kunden hinzufügen';
      ELSEIF
        INSERT INTO Reservierung VALUES (id, Datum, Kunde_id);
      END IF;
      END;
      `);

  await knex.raw(
      `
      DELIMITER $
      CREATE TRIGGER checkInsertKunde BEFORE INSERT ON Reservierung FOR EACH ROW
        BEGIN 
            DECLARE kundenid INT;
            SET kundenid = 0;
            SELECT COUNT(Kunde_id) INTO kundenid FROM Reservierung WHERE Kunde_id = NEW.Kunde_id AND Datum = NEW.Datum
            IF kundenid > 0 THEN
              SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Kunde hat bereits eine Reservierung um diese Uhrzeit';
            ELSEIF
              INSERT INTO Reservierung VALUES (NEW.id, NEW.Datum, NEW.Kunde_id);
            END IF;
        END;
      DELIMITER ;
      `);

      await knex.raw(
        `
        DELIMITER $
        CREATE TRIGGER checkInsertTeilnehmerInvalidKunde BEFORE INSERT ON Reservierung FOR EACH ROW
          BEGIN 
              DECLARE kundenid INT;
              SET kundenid = 0;
              SELECT COUNT(Kunde_id) INTO kundenid FROM Reservierung WHERE Kunde_id = NEW.Kunde_id AND Datum = NEW.Datum
              IF kundenid = 0 THEN
                SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Der gewünschte Kunde ist nicht zu finden';
              END IF;
          END;
        DELIMITER ;
        `);

  await knew.raw(
    `
    DELIMITER $
    CREATE TRIGGER stornierungReservierung 
    BEFORE DELETE ON Reservierung FOR EACH ROW
        BEGIN 
            UPDATE Reservierung SET ist_geloescht = TRUE;
        END;
    DELIMITER ;
    `
  );

  await knex.raw(
    `CREATE FUNCTION isEligible(
      age INTEGER
      )
      RETURNS VARCHAR(20)
      DETERMINISTIC
      BEGIN
      IF age > 18 THEN
      RETURN ("yes");
      ELSE
      RETURN ("No");
      END IF;
      END;`)


      await knex.raw(

        `CREATE FUNCTION gesamtanzahl_Plaetze (raumId INT) 
        RETURNS INT;
        BEGIN 
        DECLARE v_maxAnzahlPlaetze INT;
        
        Select SUM(anzahl_plaetze) INTO v_maxAnzahlPlaetze  from Raum join Tischgruppe T 
        on Raum.id = T.Raum_id join Tisch T2 on T.id = T2.Tischgruppe_id;
        RETURN v_maxAnzahlPlaetze;
        
        
        ` );


        await knex.raw(

          `
          DELIMITER //
          CREATE TRIGGER reduzierung_plaetze
          BEFORE UPDATE ON Raum
          FOR EACH ROW
          myblock:BEGIN
          DECLARE v_currAnzahlPlaetze INT;
          DECLARE v_raumId INT;
          DECLARE c_plaetze INT;
          DECLARE c_id INT;
          DECLARE done INT DEFAULT FALSE;
          DECLARE mycursor CURSOR FOR SELECT T2.id,T2.anzahl_plaetze from Raum join Tischgruppe T on Raum.id = T.Raum_id join Tisch T2 on T.id = T2.Tischgruppe_id;
          DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;
          SET v_raumId = NEW.id;
          set v_currAnzahlPlaetze = gesamtAnzahlTisch(v_raumId);
          open mycursor;
          readloop: LOOP
          fetch mycursor into c_id,c_plaetze;
          If done or v_currAnzahlPlaetze <= NEW.max_Anzahl_Personen then
              Leave readloop;
          end if;
          Select anzahl_plaetze into tmp_pltz from Tisch where Tisch.id =c_id;
          UPDATE Tisch set anzahl_plaetze = 0 where id = c_id;
          Set v_currAnzahlPlaetze = v_currAnzahlPlaetze - tmp_pltz;
      end loop ;


          `);

          await knex.raw(

    
            `
            
            DELIMITER // 
            CREATE PROCEDURE rebooking(newDate DATE, bookingID INT)
            BEGIN 
            DECLARE v_date DATE;
            SELECT Datum INTO v_date FROM Reservierung WHERE id = bookingID;
            IF v_date = CURDATE() AND v_date < newDate THEN
                UPDATE Reservierung
                SET Datum  = newDate
                WHERE id = bookingID;
            ELSE 
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Umbuchung nur für den Folgetag möglich!';
            
            END IF;    
        
            END // 
            DELIMITER ;
            `
          );
 

        
        
        



};

exports.down = async (knex) => {
  knex.raw('DROP FUNCTION IF EXISTS Hello')
  knex.raw('DROP FUNCTION IF EXISTS isEligible')
  knex.raw('DROP PROCEDURE IF EXISTS maxAnzahlPersonen')
};