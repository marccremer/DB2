#hier kommen alle Trigger hin
INSERT INTO Adresse VALUES (1, 'Derschlager Str.', '4', 'Reichshof', '51580');
INSERT INTO Kontaktdaten VALUES (1, 1, 'loewenmaik@gmail.com', '12345678');
INSERT INTO Kunde VALUES (1, 'Maik', 'Löwen', 20, 1);
INSERT INTO Reservierung VALUES (1, date('2021-06-02'), 0, 0, 1);
INSERT INTO Kunde VALUES (2, 'Marc', 'Cremer', 28, 1);
INSERT INTO Begleiter VALUES (2, 1);
INSERT INTO Begleiter VALUES (2, 1);
#trigger check insert begleiter
#hier kommt eine Fehlermeldung, dass ein Begleiter nicht zwei mal der gleichen Reservierung hinzugefügt
#werden kann
INSERT INTO Reservierung VALUES (2, date('2021-06-02'), 0, 0, 1);
#check insert reservierer, hier kommt eine Fehlermeldung, dass eine Reservierer nicht zur gleichen Uhrzeit
#eine Reservierung machen kann

#hier kommen alle Funktionen hin
INSERT INTO Raum VALUES (1, 'Hauptraum', 0, 2100, 100);
INSERT INTO CoronaInfo VALUES (1, 50, 2, date('2021-06-02'));
SELECT maxAnzahlPersonen(1);
#hier wird Funktion maxAnzahlPersonen für einen bestimmten Raum ausgegeben

#testfälle für die rebooking-prozedur 

#mit aktuellen Datensätzen arbeiten 
Delete FROM Reservierung;

INSERT INTO Reservierung(ID, DATUMSZEIT, RESERVIERER_ID)
VALUES (1, date('2021-06-05'),16);
INSERT INTO Reservierung(ID, DATUMSZEIT, RESERVIERER_ID)
VALUES (2, date('2021-06-20'), 17);
INSERT INTO Reservierung(ID, DATUMSZEIT, RESERVIERER_ID)
VALUES (3, date('2021-05-31'), 18);
INSERT INTO Reservierung(ID, DATUMSZEIT, RESERVIERER_ID)
VALUES (4, date('2021-05-27'), 19);
COMMIT;

# TEST für den Trigger MaxAnzahlPersonen
# Der Raum mit der ID 1 , den Namen TestRaum mit einer Max Anzahl Personen
# von 0 und Größe von 15 erstellt
INSERT INTO Raum (ID, NAME, AUSENBEREICH, MAX_ANZAHL_PERSONEN, FLAECHE_IN_M2) VALUES (1,'TestRaum',0,0,15);
COMMIT ;
# Ausgabe der Tabelle zur verifikation
SELECT * FROM Raum;

# Die CoronaInfo mit der Id 1 wird erstellt , mit einer Angabe von 5 Personen pro qm
# Der Trigger maxAnzahlPersonen sollte nun den Wert Max_Anzahl_Personen von 0 auf 75 anheben.
INSERT INTO CoronaInfo (id, momentane_Inzidenz, maxAnzahlPersonnen_pro_qm, Datum) VALUES (1,10,5,date ('2021-06-02'));
COMMIT;
# Ausgabe der Tabellen zur verifikation
SELECT * FROM CoronaInfo;
SELECT * FROM Raum;

# hinweis: die prozedur ist aufgrund von curdate dynamisch und muss für die test-und fehlerfälle angepasst werden 

# eine umbuchung auf einen bereits vergangenen Tag ist nicht mehr möglich
# angenommen heute ist der 5.juni, dann wäre eine umbuchung auf den 4.juni nicht mehr möglich
CALL rebooking(date('2021-06-04'), 1);

# wenn heute nicht der curdate ist, kann die reservierung auch vorgezogen oder auch verschoben werden 
CALL rebooking(date('2021-06-19'), 2);
CALL rebooking(date('2021-06-22'), 2);

# testfälle für den Trigger reduzierung_plaetze

# mit aktuellen Datensätzen arbeiten
DELETE FROM Tisch;
DELETE FROM Raum;


INSERT INTO RAUM(ID, NAME, AUSENBEREICH, MAX_ANZAHL_PERSONEN, FLAECHE_IN_M2) VALUES (1,'Hauptraum',1,50,100);
INSERT INTO Tischgruppe(ID, NAME, RAUM_ID) VALUES (1,'TischgruppeAlpha',1);
INSERT INTO TISCH(ID, ANZAHL_PLAETZE, TISCHGRUPPE_ID) VALUES (1,40,1);
COMMIT;

# reduzierung der max_anzahl_personen im raum führt dazu, dass die anzahl der plaetze an den tischen im raum auf 30 reduziert wird
UPDATE Raum
SET max_Anzahl_Personen = 30
WHERE id = 1;

# testfall, für zwei tische die sich im selben raum befinden
# insgesamt 80 plaetze an allen tischen
INSERT INTO TISCH(ID, ANZAHL_PLAETZE, TISCHGRUPPE_ID) VALUES (2,50,1); 

# die gesamtanzahl der plaetze an den tischen wird entsprechend auf 50 reduziert 
UPDATE Raum
SET max_Anzahl_Personen = 50
WHERE id = 1;

# TEST für die Prozedur Begleiterhinzufuegen
# Erstellung Beispieldaten für die Ausführung der Prozedur Begleiterhinzufügen

INSERT INTO Adresse(id, strasse, Hausnummer, stadt, zipcode) VALUES (1,'Musterstraße','42','Musterstadt',12345);
COMMIT ;
INSERT INTO Kontaktdaten(id, Adresse_id, EMail, Telefonnummer) VALUES (1,1,'Max@Mustermail.de',12345678);
INSERT INTO Kontaktdaten(id, Adresse_id, EMail, Telefonnummer) VALUES (2,1,'Ben@Mustermail.de',12345678);
COMMIT ;
INSERT INTO Kunde (id, Vorname, Nachname, `Alter`, Kontaktdaten_id)  VALUES (1,'Max','Mustermann',21,1);
INSERT INTO Kunde (id, Vorname, Nachname, `Alter`, Kontaktdaten_id)  VALUES (2,'Ben','Mustermann',21,2);
COMMIT ;
INSERT INTO Reservierung (id, Datumszeit, deleted, storniert, reservierer_id) VALUES (1,date ('2021-06-02'),0,0,1);
COMMIT ;

# Testfall dass der Begleiter nicht Existiert
# Soll Erwartungsgemäß den ERROR  BEGLEITER DOES NOT EXIST und den Fehlercode 20001 wiedergeben
CALL BegleiterHinzufuegen(1,32314);

# Testfall dass die Reservierung nicht Existiert
# Soll Erwartungsgemäß den ERROR: RESERVIERUNG DOES NOT EXIST und den Fehlercode 20002 wiedergeben
CALL BegleiterHinzufuegen(35421,1);

# Testfall für das Hinzufügen Korrekter Daten
# Es wird der Begleiter in die Begleiter Tabelle eingetragen
CALL BegleiterHinzufuegen(1,2);

# Verifkiation dass kein Eintag Stattgefunden hat
# Es sollte nun ein Eintrag Vorhanden sein Mit der KundenID 2 und der ReservierungsId 1
SELECT * FROM Begleiter


