create table "Raum"
(
    "id"           integer      not null primary key,
    "Name"         varchar2(40) not null,
    "Ausenbereich" number(1, 0) check ("Ausenbereich" in ('0', '1')),
    "Fläche in m2" float        not null
);
CREATE SEQUENCE raum_seq;
CREATE OR REPLACE TRIGGER raum_on_insert
  BEFORE INSERT ON Raum
  FOR EACH ROW
BEGIN
  SELECT raum_seq.nextval
  INTO :new.id
  FROM dual;
END;

create table "Adresse"
(
    "id"         integer      not null primary key,
    "strasse"    varchar2(50) not null,
    "Hausnummer" varchar2(12),
    "stadt"      varchar2(50) not null,
    "zipcode"    varchar2(15) not null
);
CREATE SEQUENCE adresse_seq;
CREATE OR REPLACE TRIGGER adresse_on_insert
  BEFORE INSERT ON Adresse
  FOR EACH ROW
BEGIN
  SELECT adresse_seq.nextval
  INTO :new.id
  FROM dual;
END;

create table "Kundentyp"
(
    "id"            integer                                            not null primary key,
    "hatReserviert" number(1, 0) check ("hatReserviert" in ('0', '1')) not null
);
CREATE SEQUENCE kundentyp_seq;
CREATE OR REPLACE TRIGGER kundentyp_on_insert
  BEFORE INSERT ON Kundentyp
  FOR EACH ROW
BEGIN
  SELECT kundentyp_seq.nextval
  INTO :new.id
  FROM dual;
END;


create table "Coronainfo"
(
    "id"                        integer not null primary key,
    "momentane Inzidenz"        integer not null,
    "maxAnzahlPersonnen pro qm" integer,
    "Datum"                     timestamp with local time zone
);
CREATE SEQUENCE coronainfo_seq;
CREATE OR REPLACE TRIGGER coronainfo_on_insert
  BEFORE INSERT ON Coronainfo
  FOR EACH ROW
BEGIN
  SELECT coronainfo_seq.nextval
  INTO :new.id
  FROM dual;
END;


create table "Tischgruppe"
(
    "id"            integer not null primary key,
    "Anzahl Tische" integer,
    "Raum_id"       integer not null
);
CREATE SEQUENCE tischgruppe_seq;
CREATE OR REPLACE TRIGGER tischgruppe_on_insert
  BEFORE INSERT ON Tischgruppe
  FOR EACH ROW
BEGIN
  SELECT tischgruppe_seq.nextval
  INTO :new.id
  FROM dual;
END;
alter table "Tischgruppe"
    add constraint "tischgruppe_raum_id_foreign" foreign key ("Raum_id") references "Raum" ("id") on delete cascade;


create table "Kontaktdaten"
(
    "id"         integer not null primary key,
    "Adresse_id" integer not null
);
CREATE SEQUENCE kontaktdaten_seq;
CREATE OR REPLACE TRIGGER kontaktdaten_on_insert
  BEFORE INSERT ON Kontaktdaten
  FOR EACH ROW
BEGIN
  SELECT kontaktdaten_seq.nextval
  INTO :new.id
  FROM dual;
END;
alter table "Kontaktdaten"
    add constraint "adressetokd_const" foreign key ("Adresse_id") references "Adresse" ("id") on delete cascade;


create table "Kunde"
(
    "id"              integer not null primary key,
    "Kontaktdaten_id" integer not null,
    "Kundentyp_id"    integer not null
);
CREATE SEQUENCE kunde_seq;
CREATE OR REPLACE TRIGGER kunde_on_insert
  BEFORE INSERT ON Kunde
  FOR EACH ROW
BEGIN
  SELECT kunde_seq.nextval
  INTO :new.id
  FROM dual;
END;
alter table "Kunde"
    add constraint "kunde_kontaktdaten_id_foreign" foreign key ("Kontaktdaten_id") references "Kontaktdaten" ("id") on delete cascade;
alter table "Kunde"
    add constraint "kunde_kundentyp_id_foreign" foreign key ("Kundentyp_id") references "Kundentyp" ("id") on delete cascade;


create table "Reservierung"
(
    "id"       integer not null primary key,
    "Datum"    date,
    "Kunde_id" integer not null
);
CREATE SEQUENCE reservierung_seq;
CREATE OR REPLACE TRIGGER reservierung_on_insert
  BEFORE INSERT ON Reservierung
  FOR EACH ROW
BEGIN
  SELECT reservierung_seq.nextval
  INTO :new.id
  FROM dual;
END;
alter table "Reservierung"
    add constraint "reservierung_kunde_id_foreign" foreign key ("Kunde_id") references "Kunde" ("id") on delete cascade;


create table "Tisch"
(
    "id"             integer not null primary key,
    "Tischgruppe_id" integer not null
);
CREATE SEQUENCE tisch_seq;
CREATE OR REPLACE TRIGGER tisch_on_insert
  BEFORE INSERT ON Tisch
  FOR EACH ROW
BEGIN
  SELECT tisch_seq.nextval
  INTO :new.id
  FROM dual;
END;
alter table "Tisch"
    add constraint "tisch_tischgruppe_id_foreign" foreign key ("Tischgruppe_id") references "Tischgruppe" ("id") on delete cascade;


create table "gebuchterTisch"
(
    "Tisch_id"        integer not null,
    "reservierung_id" integer not null
);
alter table "gebuchterTisch"
    add constraint "tischtogb_const" foreign key ("Tisch_id") references "Tisch" ("id") on delete cascade;
alter table "gebuchterTisch"
    add constraint "reservierungtogt_const" foreign key ("reservierung_id") references "Reservierung" ("id") on delete cascade;
alter table "gebuchterTisch"
    add constraint "gebuchterTisch_pkey" primary key ("reservierung_id");