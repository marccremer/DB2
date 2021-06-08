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

