--Tabelle Raum
create table Raum
(
    id                  number(10) check (id > 0) not null primary key,
    Name                varchar2(40)  not null,
    Ausenbereich        char(1),
    max_Anzahl_Personen number(10),
    Flaeche_in_m2       binary_double  not null
);

create sequence Raum_seq start with 1 increment by 1;

create or replace trigger Raum_seq_tr
 before insert on Raum for each row
 when (new.id is null)
begin
 select Raum_seq.nextval into :new.id from dual;
end;
/


--Tabelle Adresse
create table Adresse
(
    id         number(10) check (id > 0) not null primary key,
    strasse    varchar2(50)  not null,
    Hausnummer varchar2(12),
    stadt      varchar2(50)  not null,
    zipcode    varchar2(15)  not null
);

-- Generate ID using sequence and trigger
create sequence Adresse_seq start with 1 increment by 1;

create or replace trigger Adresse_seq_tr
 before insert on Adresse for each row
 when (new.id is null)
begin
 select Adresse_seq.nextval into :new.id from dual;
end;
/


--Tabelle Kontaktdaten
-- SQLINES LICENSE FOR EVALUATION USE ONLY
create table Kontaktdaten
(
    id            number(10) check (id > 0) not null primary key,
    Adresse_id    number(10) check (Adresse_id > 0) not null,
    "E-Mail"       varchar(254),
    Telefonnummer number(10)
);

-- Generate ID using sequence and trigger
create sequence Kontaktdaten_seq start with 1 increment by 1;

create or replace trigger Kontaktdaten_seq_tr
 before insert on Kontaktdaten for each row
 when (new.id is null)
begin
 select Kontaktdaten_seq.nextval into :new.id from dual;
end;
/
alter table Kontaktdaten
    add constraint kontaktdaten_adresse_id_foreign foreign key (Adresse_id) references Adresse (id) on delete cascade;


--Tabelle Coronainfo
-- SQLINES LICENSE FOR EVALUATION USE ONLY
create table CoronaInfo
(
    id                        number(10) check (id > 0) not null primary key,
    momentane_Inzidenz        number(10)          not null,
    maxAnzahlPersonnen_pro_qm number(10),
    Datum                     timestamp(0)
);

-- Generate ID using sequence and trigger
create sequence CoronaInfo_seq start with 1 increment by 1;

create or replace trigger CoronaInfo_seq_tr
 before insert on CoronaInfo for each row
 when (new.id is null)
begin
 select CoronaInfo_seq.nextval into :new.id from dual;
end;
/

--Tabelle Tischgruppe
-- SQLINES LICENSE FOR EVALUATION USE ONLY
create table Tischgruppe
(
    id      number(10) check (id > 0) not null primary key,
    Name    clob,
    Raum_id number(10) check (Raum_id > 0) not null
);

-- Generate ID using sequence and trigger
create sequence Tischgruppe_seq start with 1 increment by 1;

create or replace trigger Tischgruppe_seq_tr
 before insert on Tischgruppe for each row
 when (new.id is null)
begin
 select Tischgruppe_seq.nextval into :new.id from dual;
end;
/
alter table Tischgruppe
    add constraint tischgruppe_raum_id_foreign foreign key (Raum_id) references Raum (id) on delete cascade;


--Tabelle Tisch
-- SQLINES LICENSE FOR EVALUATION USE ONLY
create table Tisch
(
    id             number(10) check (id > 0) not null primary key,
    anzahl_plaetze number(10)          not null,
    Tischgruppe_id number(10) check (Tischgruppe_id > 0) not null
);

-- Generate ID using sequence and trigger
create sequence Tisch_seq start with 1 increment by 1;

create or replace trigger Tisch_seq_tr
 before insert on Tisch for each row
 when (new.id is null)
begin
 select Tisch_seq.nextval into :new.id from dual;
end;
/
alter table Tisch
    add constraint tisch_tischgruppe_id_foreign foreign key (Tischgruppe_id) references Tischgruppe (id) on delete cascade;



create type kunden_t as Object
(
    ID           NUMBER,
    "Vorname"       varchar(200),
    "Nachname"      varchar(200),
    Kontaktdaten_id number
) not  final;
create type reservier_t under kunden_t
( "Kreditkartennummer" varchar(200)) final;


create table reservier of reservier_t;
alter table reservier add constraint fk_kontakt

    foreign key(KONTAKTDATEN_ID) references "KONTAKTDATEN"("ID");
alter table RESERVIER add constraint pk_prices
    primary key(ID);
create sequence reservier_seq;
CREATE OR REPLACE TRIGGER reservier_autoinc
BEFORE INSERT ON RESERVIER
FOR EACH ROW
BEGIN
  SELECT reservier_seq.NEXTVAL
  INTO   :new.ID
  FROM   dual;
END;



-- SQLINES LICENSE FOR EVALUATION USE ONLY
create table Reservierung
(
    id                number(10) check (id > 0) not null primary key,
    Datumszeit        timestamp(0)     not null,
    deleted           char(1) default '0',
    storniert         char(1) default '0',
    reservierer_id number(10) check (reservierer_id > 0) not null
);

-- Generate ID using sequence and trigger
create sequence Reservierung_seq start with 1 increment by 1;

create or replace trigger Reservierung_seq_tr
 before insert on Reservierung for each row
 when (new.id is null)
begin
 select Reservierung_seq.nextval into :new.id from dual;
end;
/
alter table Reservierung
    add constraint reservierung_reservierer_id_id_foreign foreign key (reservierer_id) references RESERVIER(id) on delete cascade;




create type begleiter_t under kunden_t (
    stammkunde number,
    reservierungs_id number
                                       )final ;
create table begleiter of begleiter_t;

alter table begleiter add constraint pk_begleiter primary key (ID);
alter table begleiter add constraint fk_bge_kontakt
    foreign key(KONTAKTDATEN_ID) references "KONTAKTDATEN"("ID");
alter table begleiter add constraint fk_reservierungen
    foreign key(reservierungs_id) references "RESERVIERUNG"("ID");
create sequence begleiter_seq;
CREATE OR REPLACE TRIGGER BEGLEITER_autoinc
BEFORE INSERT ON BEGLEITER
FOR EACH ROW
BEGIN
  SELECT begleiter_seq.NEXTVAL
  INTO   :new.ID
  FROM   dual;
END;



-- SQLINES LICENSE FOR EVALUATION USE ONLY
create table Tischreservierung
(
    Tisch_id        number(10) check (Tisch_id > 0) not null,
    reservierung_id number(10) check (reservierung_id > 0) not null
);

alter table Tischreservierung
    add constraint tischreservierung_tisch_id_foreign foreign key (Tisch_id) references Tisch (id) on delete cascade;
alter table Tischreservierung
    add constraint tischreservierung_reservierung_id_foreign foreign key (reservierung_id) references Reservierung (id) on delete cascade;
alter table Tischreservierung
    add constraint Tischreservierung_pkey primary key (reservierung_id, Tisch_id);















