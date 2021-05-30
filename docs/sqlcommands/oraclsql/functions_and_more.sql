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