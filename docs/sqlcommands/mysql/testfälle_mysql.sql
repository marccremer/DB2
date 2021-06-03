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