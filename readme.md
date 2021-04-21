# DB2 Praktikum - Reservierung
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