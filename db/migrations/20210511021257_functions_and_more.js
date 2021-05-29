/**
 * @param {import('knex')} knex
 */
 exports.up = async (knex) => { 
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
 

        
        await knew.raw(`

        CREATE TRIGGER maxAnzahlPersonen
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
        `)


};

exports.down = async (knex) => {
  knex.raw('DROP FUNCTION IF EXISTS Hello')
  knex.raw('DROP FUNCTION IF EXISTS isEligible')
  knex.raw('DROP PROCEDURE IF EXISTS maxAnzahlPersonen')
};