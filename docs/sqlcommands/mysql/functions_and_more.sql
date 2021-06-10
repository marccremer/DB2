DROP PROCEDURE IF EXISTS rebooking;
DROP FUNCTION IF EXISTS verfügbarkeit;
DROP TRIGGER IF EXISTS reduzierung_plaetze;
DROP TRIGGER IF EXISTS storniere;
DROP FUNCTION IF EXISTS maxAnzahlPersonen;
DROP FUNCTION IF EXISTS gesamtanzahl_Plaetze;
DROP TRIGGER IF EXISTS maxAnzahlPersonen_t;
DROP TRIGGER IF EXISTS checkInsertBegleiter;
DROP PROCEDURE IF EXISTS reservierungAufTischeVerteilen;
DROP FUNCTION IF EXISTS verfügbarkeitAnPlätzenFürDatum;
DROP FUNCTION IF EXISTS checkInsertTeilnehmerInvalidKunde;
DROP PROCEDURE IF EXISTS BegleiterHinzufuegen;
DROP TRIGGER IF EXISTS checkInsertReservierer;
DROP VIEW aktuelleKunden;
DROP VIEW kundenanwesenheit;



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


create
    function maxAnzahlPersonen(idRaum int) RETURNS INTEGER
      BEGIN
      DECLARE maxAnzahlpQ INTEGER;
      DECLARE flaeche FLOAT;
      DECLARE maxAnzahl INTEGER;
      SELECT maxAnzahlPersonnen_pro_qm INTO maxAnzahlpQ FROM CoronaInfo;
      SELECT Flaeche_in_m2 INTO flaeche FROM Raum WHERE id = idRaum;
      SET maxAnzahl = maxAnzahlpQ * flaeche;
      UPDATE Raum SET max_Anzahl_Personen = maxAnzahl WHERE id = idRaum;
      RETURN maxAnzahl;
      END;


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


create trigger checkInsertBegleiter
        before insert
        on Begleiter
        for each row
        BEGIN
        DECLARE idReservierung INTEGER;
        DECLARE idKunde INTEGER;
        DECLARE zaehler INTEGER;

        DECLARE cur1 CURSOR FOR SELECT Reservierung_id, Kunde_id FROM Begleiter WHERE Reservierung_id = NEW.Reservierung_id AND Kunde_id = NEW.Kunde_id;
        SELECT COUNT(*) INTO zaehler FROM Begleiter WHERE Reservierung_id = NEW.Reservierung_id AND Kunde_id = NEW.Kunde_id;

        #Ein Begleiter kann nicht zweimal an der gleichen Reservierung teilnehmen -- KundenID auch noch hinzufügen
        OPEN cur1;
        IF zaehler > 0 THEN
            read_loop: LOOP
             FETCH cur1 INTO idReservierung, idKunde; #hier noch KundenID checken
             #Durchlaufen von allen Reservierungen, an die der Begleiter teilnimmt
             IF idReservierung = NEW.Reservierung_id AND idKunde = NEW.Kunde_id THEN
                  SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Begleiter darf nicht zweimal der gleichen Reservierung hinzugefügt werden';
             END IF;
        END LOOP;
        end if;
        CLOSE cur1;
    END;


CREATE PROCEDURE reservierungAufTischeVerteilen(Datum datetime, AnzahlPersonen int, Reservierungs_ID int unsigned)
BEGIN
    DECLARE finished INTEGER DEFAULT 0;
    DECLARE AktuelleTischid int unsigned;
    DECLARE AnzahlAnPlätzen int DEFAULT 0;
    DECLARE frei int;
    DECLARE wieVielePlätzeHabenWirSchon int DEFAULT 0;
    DEClARE curTisch
		CURSOR FOR
			SELECT id,anzahl_plaetze FROM Tisch;
    DECLARE CONTINUE HANDLER
        FOR NOT FOUND SET finished = 1;

    SET @habenGenugPlätze:=verfügbarkeitAnPlätzenFürDatum(Datum,AnzahlPersonen);

    if @habenGenugPlätze = 0 THEN
        SIGNAL sqlstate '45000' SET Message_Text ='Es sind für das gewählte Datum leider nicht genügend Plätze vorhanden.';
        end if;

    OPEN curTisch;

     getFreienTisch: LOOP
		FETCH curTisch INTO AktuelleTischid,AnzahlAnPlätzen;
		IF wieVielePlätzeHabenWirSchon>=AnzahlPersonen THEN
            leave getFreienTisch;
        end if;
		IF finished = 1 THEN
			LEAVE getFreienTisch;
		END IF;
		SELECT COUNT(Tisch_id) INTO frei FROM
		                                      (SELECT * FROM
		                                                     (SELECT * FROM Tischreservierung TR JOIN Reservierung R on TR.reservierung_id = R.id) S
		                                      WHERE Datumszeit=Datum) B WHERE Tisch_id=AktuelleTischid;
		if frei = 0 THEN
            insert Tischreservierung(Tisch_id, reservierung_id) VALUES (AktuelleTischid,Reservierungs_ID);
            SET wieVielePlätzeHabenWirSchon = wieVielePlätzeHabenWirSchon + AnzahlAnPlätzen;
        end if;
	END LOOP getFreienTisch;
    close curTisch;

end ;


CREATE FUNCTION verfügbarkeitAnPlätzenFürDatum(Datum datetime, GewünschteAnzahlPlätze int)
RETURNS int
    BEGIN
        DECLARE Result Int DEFAULT 0;
        DECLARE finished INTEGER DEFAULT 0;
    DECLARE AktuelleTischid int unsigned;
    DECLARE AnzahlAnPlätzen int DEFAULT 0;
    DECLARE frei int;
    DECLARE wieVielePlätzeHabenWirSchon int DEFAULT 0;
    DEClARE curTisch
		CURSOR FOR
			SELECT id,anzahl_plaetze FROM Tisch;
    DECLARE CONTINUE HANDLER
        FOR NOT FOUND SET finished = 1;
OPEN curTisch;
     getFreienTisch: LOOP
		FETCH curTisch INTO AktuelleTischid,AnzahlAnPlätzen;
		IF wieVielePlätzeHabenWirSchon>=GewünschteAnzahlPlätze THEN
            leave getFreienTisch;
        end if;
		IF finished = 1 THEN
			LEAVE getFreienTisch;
		END IF;
		SELECT COUNT(Tisch_id) INTO frei FROM
		                                      (SELECT * FROM
		                                                     (SELECT * FROM Tischreservierung TR JOIN Reservierung R on TR.reservierung_id = R.id) S
		                                      WHERE Datumszeit=Datum) B WHERE Tisch_id=AktuelleTischid;
		if frei = 0 THEN
            SET wieVielePlätzeHabenWirSchon = wieVielePlätzeHabenWirSchon + AnzahlAnPlätzen;
        end if;
	END LOOP getFreienTisch;
        if wieVielePlätzeHabenWirSchon>=GewünschteAnzahlPlätze THEN
            SET Result=1;
        end if;
    close curTisch;
    Return Result;
    end ;


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


create trigger checkInsertReservierer
          before insert
          on Reservierung
          for each row
          BEGIN
          #Variablen für Reservierer und Begleiter
          DECLARE reserviererID INTEGER;

          #check für den Reservierer
          SELECT reservierer_id_id INTO reserviererID FROM Reservierung WHERE Datumszeit = NEW.Datumszeit;
          IF reserviererID = NEW.reservierer_id_id THEN
              SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Reservierer hat bereits eine Reservierung an diesem Datum';
          END IF;
          END;


CREATE VIEW aktuelleKunden AS SELECT B.Kunde_id, k2.Vorname AS Begleitervorname, k2.Nachname AS Begleiternachname, Datumszeit,Reservierung_id, Kunde.Vorname AS Reservierervorname, Kunde.Nachname AS Reservierernachname
    FROM Reservierung JOIN Kunde ON Reservierung.reservierer_id_id = Kunde.id
    JOIN Begleiter B on Reservierung.id = B.Reservierung_id
    JOIN Kunde k2 ON k2.id = B.Kunde_id
    WHERE Reservierung.Datumszeit = CURDATE();


CREATE VIEW kundenAnwesenheit AS SELECT B.Kunde_id, k2.Vorname AS Begleitervorname, k2.Nachname AS Begleiternachname, Datumszeit,Reservierung_id, Kunde.Vorname AS Reservierervorname, Kunde.Nachname AS Reservierernachname
    FROM Reservierung JOIN Kunde ON Reservierung.reservierer_id_id = Kunde.id
    JOIN Begleiter B on Reservierung.id = B.Reservierung_id
    JOIN Kunde k2 ON k2.id = B.Kunde_id;