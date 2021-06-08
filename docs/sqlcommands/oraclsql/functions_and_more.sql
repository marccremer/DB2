CREATE OR REPLACE PROCEDURE rebooking(newDate date, bookingID int)
IS
BEGIN
    IF CURRENT_DATE <= newDate THEN
        UPDATE Reservierung
        SET Datumszeit = newDate
        WHERE id = bookingID;
    ELSE
        RAISE_APPLICATION_ERROR('-20001','Umbuchung nur für den Folgetag möglich!');
    END IF;
END ;


CREATE OR REPLACE FUNCTION gesamtanzahl_Plaetze(raumId INT)
RETURN INT
IS
    v_maxAnzahlPlaetze INT;
BEGIN
    Select SUM(anzahl_plaetze)
    INTO v_maxAnzahlPlaetze
    from Raum
             join Tischgruppe T
                  on Raum.id = T.Raum_id
             join Tisch T2 on T.id = T2.Tischgruppe_id
    WHERE Raum.id = raumId;
    RETURN v_maxAnzahlPlaetze;
END ;


create trigger REDUZIERUNG_PLAETZE
    after update
    on RAUM
    for each row
DECLARE
    v_currAnzahlPlaetze NUMBER(10);
    v_raumId NUMBER(10);
    c_plaetze NUMBER(10);
    v_tischId NUMBER(10);
    tmp_pltz NUMBER(10);
    done NUMBER(10) DEFAULT 0;
        CURSOR mycursor IS SELECT T2.id, T2.anzahl_plaetze
                                from Raum
                                         join Tischgruppe T on Raum.id = T.Raum_id
                                         join Tisch T2 on T.id = T2.Tischgruppe_id;
BEGIN
    v_raumId := :NEW.id;
    v_currAnzahlPlaetze := gesamtanzahl_Plaetze(v_raumId);
    open mycursor;
    LOOP
        fetch mycursor into v_tischId,c_plaetze;
        if mycursor%notfound then done := 1;
        end if;
            Exit WHEN done = 1 OR v_currAnzahlPlaetze <= :NEW.max_Anzahl_Personen ;

        Begin
        Select anzahl_plaetze into tmp_pltz from Tisch where Tisch.id = v_tischId;
        Exception when No_data_found then  done := 1;
        End;
        UPDATE Tisch set anzahl_plaetze = 0 where id = v_tischId;

        IF tmp_pltz >= v_currAnzahlPlaetze THEN
            UPDATE Tisch
            SET anzahl_plaetze = :NEW.max_Anzahl_Personen
            WHERE id = v_tischId;
        v_currAnzahlPlaetze := :NEW.max_Anzahl_Personen;
        ELSE
            UPDATE Tisch set anzahl_plaetze = 0 where id = v_tischId;

        END IF;

        v_currAnzahlPlaetze := v_currAnzahlPlaetze - tmp_pltz;
    END loop;
    CLOSE mycursor;
END;
/

CREATE OR REPLACE TRIGGER maxAnzahlPersonen
    AFTER INSERT ON CoronaInfo FOR EACH ROW
    DECLARE
        runs NUMBER(10) DEFAULT 1;
        RAUMID NUMBER(10);
        FLAECHE BINARY_DOUBLE;
        CURSOR CURSOR1 IS SELECT ID , FLAECHE_IN_M2 FROM RAUM ;
    BEGIN

        OPEN CURSOR1;

        WHILE runs = 1 LOOP
            FETCH CURSOR1 INTO RAUMID , FLAECHE;
            IF CURSOR1%NOTFOUND THEN runs := 0;
            END IF;
            UPDATE Raum
                SET MAX_ANZAHL_PERSONEN = FLOOR(FLAECHE * :new.MAXANZAHLPERSONNEN_PRO_QM)
                WHERE id = RAUMID;
            IF SQL%ROWCOUNT = 0 THEN  runs := 0;
            END IF;
        END LOOP ;

        CLOSE CURSOR1;

    END;



CREATE OR REPLACE PROCEDURE BegleiterHinzufuegen( ReservierungsId IN NUMBER , KundenId IN NUMBER)
    IS
    BEGIN

        IF KundenId NOT IN
        (SELECT ID FROM BEGLEITER
        WHERE ID = KundenId) THEN
            RAISE_APPLICATION_ERROR (-20001 := 'BEGLEITER DOES NOT EXISTENT');
        ELSIF ReservierungsId NOT IN
        (SELECT ID FROM Reservierung
        WHERE ID = ReservierungsId) THEN
            RAISE_APPLICATION_ERROR (-20002 , 'RESERVIERUNG DOES NOT EXISTENT');
        ELSE
            UPDATE BEGLEITER
            SET  RESERVIERUNGS_ID = ReservierungsId
            WHERE ID = KundenId;

        END IF;

    END;

    CREATE OR REPLACE PROCEDURE reservierungAufTischeVerteilen(Datum timestamp(0), AnzahlPersonen number, Reservierungs_ID number)
IS
    finished NUMBER(10) DEFAULT 0;
    AktuelleTischid number(10);
    AnzahlAnPlätzen number(10) DEFAULT 0;
    frei number(10);
    wieVielePlätzeHabenWirSchon number(10) DEFAULT 0;
    CURSOR curTisch
	 IS
			SELECT id,anzahl_plaetze FROM Tisch;
BEGIN
   
    SET @habenGenugPlätze:=verfügbarkeitAnPlätzenFürDatum(Datum,AnzahlPersonen);

    if @habenGenugPlätze = 0 THEN
        RAISE_APPLICATION_ERROR Message_Text :='Es sind für das gewählte Datum leider nicht genügend Plätze vorhanden.';
        end if;

    OPEN curTisch;

     <<getFreienTisch>> LOOP
		FETCH curTisch INTO AktuelleTischid,AnzahlAnPlätzen;
		IF curTisch%NOTFOUND THEN
        finished := 1;
		END IF;
		IF wieVielePlätzeHabenWirSchon>=AnzahlPersonen THEN
            exit getFreienTisch;
        end if;
		IF finished = 1 THEN
			EXIT getFreienTisch;
		END IF;
		SELECT COUNT(Tisch_id) INTO frei FROM
		                                      (SELECT * FROM
		                                                     (SELECT * FROM Tischreservierung TR JOIN Reservierung R on TR.reservierung_id = R.id) S
		                                      WHERE Datumszeit=Datum) B WHERE Tisch_id=AktuelleTischid;
		if frei = 0 THEN
            insert Tischreservierung(Tisch_id, reservierung_id) SELECT  AktuelleTischid,Reservierungs_ID  FROM dual;
            wieVielePlätzeHabenWirSchon := wieVielePlätzeHabenWirSchon + AnzahlAnPlätzen;
        end if;
	END LOOP getFreienTisch;
    close curTisch;

end;

CREATE OR REPLACE FUNCTION verfügbarkeitAnPlätzenFürDatum(Datum timestamp(0), GewünschteAnzahlPlätze number)
RETURN number
    IS
        Result Number(10) DEFAULT 0;
        finished NUMBER(10) DEFAULT 0;
    AktuelleTischid number(10);
    AnzahlAnPlätzen number(10) DEFAULT 0;
    frei number(10);
    wieVielePlätzeHabenWirSchon number(10) DEFAULT 0;
    CURSOR curTisch
	 IS
			SELECT id,anzahl_plaetze FROM Tisch;
    BEGIN
   OPEN curTisch;
     <<getFreienTisch>> LOOP
		FETCH curTisch INTO AktuelleTischid,AnzahlAnPlätzen;
		IF curTisch%NOTFOUND THEN
        finished := 1;
		END IF;
		IF wieVielePlätzeHabenWirSchon>=GewünschteAnzahlPlätze THEN
            exit getFreienTisch;
        end if;
		IF finished = 1 THEN
			EXIT getFreienTisch;
		END IF;

		SELECT COUNT(Tisch_id) INTO frei FROM
		                                      (SELECT * FROM
		                                                     (SELECT * FROM Tischreservierung TR JOIN Reservierung R on TR.reservierung_id = R.id) S
		                                      WHERE Datumszeit=Datum) B WHERE Tisch_id=AktuelleTischid;
		if frei = 0 THEN
            wieVielePlätzeHabenWirSchon := wieVielePlätzeHabenWirSchon + AnzahlAnPlätzen;
        end if;
	END LOOP getFreienTisch;
        if wieVielePlätzeHabenWirSchon>=GewünschteAnzahlPlätze THEN
            Result:=1;
        end if;
    close curTisch;
    Return Result;
    end ;

    CREATE OR REPLACE TRIGGER checkInsertTeilnehmerInvalidKunde BEFORE INSERT ON Reservierung FOR EACH ROW
    BEGIN
        kundenid NUMBER(10) DEFAULT 0;
    SELECT COUNT(id) INTO kundenid FROM Reservierung WHERE id = NEW.id AND Datumszeit = NEW.Datumszeit;
        IF kundenid = 0 THEN
          RAISE_APPLICATION_ERROR MESSAGE_TEXT := 'Der gewünschte Kunde ist nicht zu finden';
        END IF;
    END;


create function maxAnzahlPersonen(idRaum number) RETURN NUMBER
      IS
      maxAnzahlpQ NUMBER(10);
      flaeche BINARY_DOUBLE;
      maxAnzahl NUMBER(10);
      BEGIN
      --SELECT maxAnzahlPersonnen_pro_qm INTO maxAnzahlpQ FROM CoronaInfo WHERE Datum = datum1;
      --SELECT Flaeche_in_m2 INTO flaeche FROM Raum WHERE id = idRaum;
      --maxAnzahl := maxAnzahlpQ * flaeche;
      --UPDATE Raum SET max_Anzahl_Personen = maxAnzahl WHERE id = idRaum;
      SELECT MAX_ANZAHL_PERSONEN INTO maxAnzahl FROM Raum WHERE ID = idRaum;
      RETURN maxAnzahl;
      END;
/


create trigger CHECKINSERTBEGLEITER
    before insert
    on BEGLEITER
    for each row
DECLARE
    idReservierung NUMBER(10);
    idKunde NUMBER(10);
    zaehler NUMBER(10);
    CURSOR cur1 IS SELECT RESERVIERUNGS_ID, KONTAKTDATEN_ID FROM Begleiter WHERE RESERVIERUNGS_ID = :NEW.RESERVIERUNGS_ID;
    exceptionBegleiter EXCEPTION;
BEGIN
    SELECT COUNT(*) INTO zaehler FROM Begleiter WHERE RESERVIERUNGS_ID = :NEW.RESERVIERUNGS_ID AND KONTAKTDATEN_ID = :NEW.KONTAKTDATEN_ID;
    --Ein Begleiter kann nicht zweimal an der gleichen Reservierung teilnehmen -- KundenID auch noch hinzufügen
    OPEN cur1;
    IF zaehler > 0 THEN
        --<<read_loop>> LOOP
             FETCH cur1 INTO idReservierung, idKunde; --hier noch KundenID checken
             --Durchlaufen von allen Reservierungen, an die der Begleiter teilnimmt
             IF :NEW.RESERVIERUNGS_ID = idReservierung AND :NEW.KONTAKTDATEN_ID = idKunde THEN
                  RAISE_APPLICATION_ERROR(-20000, 'Begleiter darf nicht zweimal der gleichen Reservierung hinzugefügt werden');
             END IF;
        --END LOOP;
    END IF;
    CLOSE cur1;
END;
/


create trigger CHECKINSERTRESERVIERER
    before insert
    on RESERVIERUNG
    for each row
DECLARE
    zaehler NUMBER;
    reserviererID VARCHAR(45);
BEGIN
    SELECT COUNT(*) INTO zaehler FROM RESERVIERUNG WHERE DATUMSZEIT = :NEW.DATUMSZEIT;
    IF zaehler > 0 THEN
        SELECT RESERVIERER_ID INTO reserviererID FROM Reservierung WHERE Datumszeit = :NEW.Datumszeit;
        IF reserviererID = :NEW.RESERVIERER_ID THEN
        RAISE_APPLICATION_ERROR(-20000, 'Reservierer hat bereits eine Reservierung an diesem Datum');
    END IF;
    end if;
END;
/


CREATE VIEW RESERVIERUNGMITBEGLEITER AS
    SELECT r.ID AS RESERVIERUNGSID, r.DATUMSZEIT, b.ID AS BEGLEITERID FROM RESERVIERUNG r JOIN BEGLEITER b ON r.ID = b.RESERVIERUNGS_ID
    WHERE r.DATUMSZEIT BETWEEN TRUNC(CURRENT_DATE) AND ADD_MONTHS(TRUNC(CURRENT_DATE), 1);


create trigger BEGLEITERENTFERNEN
    instead of delete
    on RESERVIERUNGMITBEGLEITERN
    for each row
BEGIN
        DELETE FROM BEGLEITER WHERE RESERVIERUNGS_ID = :OLD.RESERVIERUNGID;
    END;