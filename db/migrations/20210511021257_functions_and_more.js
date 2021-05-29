/**
 * @param {import('knex')} knex
 */
exports.up = async (knex) => {  

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
  return
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