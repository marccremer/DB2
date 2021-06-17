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
#INSERT INTO TISCH(ID, ANZAHL_PLAETZE, TISCHGRUPPE_ID) VALUES (2,50,1);
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




