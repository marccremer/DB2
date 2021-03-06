# DB2 Praktikum - ReservierungsMaster 21

## Requirements

* node
* yarn
* docker
* docker-compose


## Setup
Create a File at the top level called  _.env_
The content of the File should be

```
NODE_ENV=development
DB_REMOTE_HOST=<HOST>
DB_REMOTE_USER=<USER>
DB_REMOTE_PW=<PW>
DB_REMOTE_NAME=<DATABASENAME>
DEBUG=knex:query
DB_LOCAL_HOST=localhost
DB_LOCAL_USER=mainUser
DB_LOCAL_PW=changeMe
DB_LOCAL_NAME=developDB
```

```
yarn install
```
Then
```
docker-compose up
```
```
set global..
yarn run migrate
yarn run seed
```


## DB Setup

Start the docker and go to localhost:8080.
Login with root and rootuserpasswd.
Run the SQL Command
```sql
SET GLOBAL log_bin_trust_function_creators = 1;
```

Then in a Terminal run 
```js
yarn run migrate
```
and
```js
yarn run seed
```

now you can login with the above mainUser.

## Proceduren , Funktionen Views

* max Anzahl Personen pro Raum _Funktion_
* 1 neue Reservierung _Prozedur_
* Teilnehmer einfügen _Prozedur_
* Kunden im Restaurant jetzt _View_
* Verfügbarkeit an Plätzen _Funktion_
* Erlaube keine Inserts von Kunden die zu der Zeit schon irgendwo sitzen _Trigger/Constraint_
* Umbuchung/Änderung der Buchung _Prozedur_
* Automatische Stornierung der Reservierung bei Überschreitung der Inzidenz _Trigger_
* Automatische Änderung des Datensatzes anzahlTische in Raum, wenn Insert bei Tisch _Trigger_
* Automatische Reduzierung der Plätze am Tisch, wenn die Inzidenz eine bestimmte Zielmarke erreicht hat _Trigger_

### Trigger:
* Fehlermeldung bei Hinzufügen von Kunden bei Reservierungen die schon zur Zeit woanders sitzen -> Insert 
* Fehlermeldung bei Invaliden Kunden Insert 
* Stornierung von Reservierungen
* Reduzierung an Plätzen an den Tischen 
* Erhöhen der maxAnzahlPersonen 

### Views:
* Kunden im Restaurant jetzt
* Reservierungen für einen bestimmten Tag

### Funktion:
* max Anzahl Personen pro Raum
* Verfügbarkeit an Plätzen

### Prozedur:
* eine neue Reservierung
* Teilnehmer einfügen
* Umbuchung/Änderung der Buchung


