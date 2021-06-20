--hier kommen alle Trigger hin
INSERT INTO ADRESSE VALUES (2, 'Derschlager Str.', '4', 'Reichshof', '51580');
INSERT INTO Kontaktdaten VALUES (2, 2, 'loewenmaik@gmail.com', '12345678');
INSERT INTO RESERVIER VALUES (1, 'Maik', 'Löwen', 2, 4444);
INSERT INTO RESERVIERUNG VALUES (1, (TO_DATE('2021-07-02', 'yyyy-mm-dd')), 0, 0, 21);
INSERT INTO RESERVIERUNG VALUES (1, (TO_DATE('2021-07-02', 'yyyy-mm-dd')), 0, 0, 21);
INSERT INTO BEGLEITER VALUES (1, 'Marc', 'Cremer', 1, 0, 1);
INSERT INTO BEGLEITER VALUES (1, 'Marc', 'Cremer', 1, 0, 1); -- hier kommt es zu einer Fehlermeldung bei checkInsertBegleiter

INSERT INTO RAUM VALUES (1, 'testraum', 0, 30, 120);
INSERT INTO CORONAINFO VALUES (1, 60, 0.4, (TO_DATE('2021-07-02', 'yyyy-mm-dd')));

--hier kommen alle functions hin
SELECT MAXANZAHLPERSONEN(1) FROM DUAL;

--instead-of-trigger
DELETE FROM RESERVIERUNGMITBEGLEITER WHERE BEGLEITERID = 46;
SELECT * FROM RESERVIERUNGMITBEGLEITER;
SELECT * FROM BEGLEITER WHERE ID = 46;
--hier sollte bei Reservierungmitbegleiter der Datensatz mit der Begleiterid 46 nicht zu sehen sein und der Begleiter mit der ID 46
--sollte nicht mehr in der Tabelle vorhanden sein

-- testfälle für die rebooking-prozedur

#mit aktuellen Datensätzen arbeiten 
DELETE FROM ADRESSE;
DELETE FROM KONTAKTDATEN;
DELETE FROM RESERVIER;
DELETE FROM Reservierung;

INSERT INTO ADRESSE(ID, STRASSE, HAUSNUMMER, STADT, ZIPCODE)
VALUES (1,'Berliner Strasse',32,'Köln','50607');

INSERT INTO KONTAKTDATEN (ID, ADRESSE_ID, "E-Mail", TELEFONNUMMER)
VALUES (1,1,'christop.mueller.de','022919199');

INSERT INTO RESERVIER(ID, "Vorname", "Nachname", KONTAKTDATEN_ID, "Kreditkartennummer")
VALUES (1,'Christoph','Müller',1,'07756664464');


INSERT INTO Reservierung(ID, DATUMSZEIT, STORNIERT, RESERVIERER_ID)
VALUES (1, TO_DATE('19.06.2021','DD.MM.YYYY'), 0, 1);
COMMIT;

-- Der Raum mit der ID 1 , den Namen TestRaum mit einer Max Anzahl Personen
-- von 0 und Größe von 15 erstellt
INSERT INTO Raum (ID, NAME, AUSENBEREICH, MAX_ANZAHL_PERSONEN, FLAECHE_IN_M2) VALUES (1,'TestRaum',0,0,15);
COMMIT ;
-- Ausgabe der Tabelle zur verifikation
SELECT * FROM Raum;

-- Die CoronaInfo mit der Id 1 wird erstellt , mit einer Angabe von 5 Personen pro qm
-- Der Trigger maxAnzahlPersonen sollte nun den Wert Max_Anzahl_Personen von 0 auf 75 anheben.
INSERT INTO CoronaInfo (id, momentane_Inzidenz, maxAnzahlPersonnen_pro_qm, Datum) VALUES (1,10,5,TO_DATE('2021-06-02', 'yyyy-mm-dd'));
COMMIT;
-- Ausgabe der Tabelle zur verifikation 
SELECT * FROM CoronaInfo;
SELECT * FROM Raum;


# hinweis: die prozedur ist aufgrund von CURRENT_DATE dynamisch und muss für die test-und fehlerfälle angepasst werden
# eine umbuchung auf einen bereits vergangenen Tag ist nicht mehr möglich
# angenommen heute ist der 19.juni, dann wäre eine umbuchung auf den 18.juni nicht mehr möglich 
CALL rebooking(TO_DATE('18.06.2021','DD.MM.YYYY'),1);

# wenn heute nicht der CURRENT_DATE ist, kann die reservierung auch vorgezogen oder auch verschoben werden 
CALL rebooking(TO_DATE('18.06.2021','DD.MM.YYYY'),1);
CALL rebooking(TO_DATE('22.06.2021','DD.MM.YYYY'),1);



# testfälle für den Trigger reduzierung_plaetze

# mit aktuellen Datensätzen arbeiten
DELETE FROM Tisch;
DELETE FROM Raum;

# reduzierung der max_anzahl_personen im raum führt dazu, dass die anzahl der plaetze an den tischen im raum auf 30 reduziert wird
UPDATE Raum
SET max_Anzahl_Personen = 30
WHERE id = 1;

# testfall, für zwei tische die sich im selben raum befinden
# insgesamt 80 plaetze an allen tischen
INSERT INTO TISCH(ID, ANZAHL_PLAETZE, TISCHGRUPPE_ID) VALUES (2,50,1); 

# die gesamtanzahl der plaetze an den tischen wird entsprechend auf 15 reduziert 
UPDATE Raum
SET max_Anzahl_Personen = 15
WHERE id = 1;


