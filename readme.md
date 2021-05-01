# DB2 Praktikum - ReservierungsMaster 21
Gruppe 47

Betreuer: L. Radigk

https://th-koeln.zoom.us/j/88067891570
Meeting-ID: 880 6789 1570
Kenncode: dbs2

**nächster Termin:**

DI.04.Mai 16:00

## Requirements

* node
* docker
* docker-compose


## Setup
Create a File at the top level called  _.env_
The content of the File should be

```
NODE_ENV=development
DB_REMOTE_HOST=studidb.gm.th-koeln.de
DB_REMOTE_USER=<GMID>
DB_REMOTE_PW=<PW>
DB_REMOTE_NAME=VLESUNG.GM.FH-KOELN.DE
DEBUG=knex:query
DB_LOCAL_HOST=localhost
DB_LOCAL_USER=mainUser
DB_LOCAL_PW=changeMe
DB_LOCAL_NAME=developDB
```

```
npm install
```
Then
```
docker-compose up
```

## Proceduren , Funktionen Views

* max Anzahl Personen pro Raum _Funktion_
* 1 neue Reservierung _Prozedur_
* Teilnehmer einfügen _Prozedur_
* Kunden im Restaurant jetzt _View_
* Verfügbarkeit an Plätzen _Funktion_
* Erlaube keine Inserts von Kunden die zu der Zeit schon irgendwo sitzen _Trigger/Constraint_
* Umbuchung/Änderung der Buchung _Prozedur_
