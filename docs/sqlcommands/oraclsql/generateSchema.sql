-- work in Progress
create table "Raum" ("id" integer not null primary key, "Name" varchar2(40) not null, "Ausenbereich" number(1, 0) check ("Ausenbereich" in ('0', '1')), "Fläche in m2" float not null) 
DECLARE PK_NAME VARCHAR(200); 
BEGIN  
EXECUTE IMMEDIATE ('CREATE SEQUENCE "raum_seq"');
  SELECT cols.column_name INTO PK_NAME  FROM all_constraints cons, all_cons_columns cols  
  WHERE cons.constraint_type = 'P'  AND cons.constraint_name = cols.constraint_name  AND cons.owner = cols.owner  AND cols.table_name = 'Raum';  
  execute immediate ('create or replace trigger "raum_autoinc_trg"  BEFORE INSERT on "Raum"  for each row  declare  checking number := 1;  begin    if (:new."' || PK_NAME || '" is null) then      while checking >= 1 loop        select "raum_seq".nextval into :new."' || PK_NAME || '" from dual;   
       select count("' || PK_NAME || '") into checking from "Raum"        where "' || PK_NAME || '" = :new."' || PK_NAME || '";      end loop;    end if;  end;'); 
       END; 
create table "Adresse" ("id" integer not null primary key, "strasse" varchar2(50) not null, "Hausnummer" varchar2(12), "stadt" varchar2(50) not null, "zipcode" varchar2(15) not null) trx2
DECLARE PK_NAME VARCHAR(200); BEGIN  EXECUTE IMMEDIATE ('CREATE SEQUENCE "adresse_seq"');  SELECT cols.column_name INTO PK_NAME  FROM all_constraints cons, all_cons_columns cols  WHERE cons.constraint_type = 'P'  AND cons.constraint_name = cols.constraint_name  AND cons.owner = cols.owner  AND cols.table_name = 'Adresse';  execute immediate ('create or replace trigger "adresse_autoinc_trg"  BEFORE INSERT on "Adresse"  for each row  declare  checking number := 1;  begin    if (:new."' || PK_NAME || '" is null) then      while checking >= 1 loop        select "adresse_seq".nextval into :new."' || PK_NAME || '" from dual;        select count("' || PK_NAME || '") into checking from "Adresse"        where "' || PK_NAME || '" = :new."' || PK_NAME || '";      end loop;    end if;  end;'); END; trx2
create table "Kundentyp" ("id" integer not null primary key, "hatReserviert" number(1, 0) check ("hatReserviert" in ('0', '1')) not null) trx2
DECLARE PK_NAME VARCHAR(200); BEGIN  EXECUTE IMMEDIATE ('CREATE SEQUENCE "kundentyp_seq"');  SELECT cols.column_name INTO PK_NAME  FROM all_constraints cons, all_cons_columns cols  WHERE cons.constraint_type = 'P'  AND cons.constraint_name = cols.constraint_name  AND cons.owner = cols.owner  AND cols.table_name = 'Kundentyp';  execute immediate ('create or replace trigger "kundentyp_autoinc_trg"  BEFORE INSERT on "Kundentyp"  for each row  declare  checking number := 1;  begin    if (:new."' || PK_NAME || '" is null) then      while checking >= 1 loop        select "kundentyp_seq".nextval into :new."' || PK_NAME || '" from dual;        select count("' || PK_NAME || '") into checking from "Kundentyp"        where "' || PK_NAME || '" = :new."' || PK_NAME || '";      end loop;    end if;  end;'); END; trx2
create table "Izendez und mehr:D" ("id" integer not null primary key, "momentane Inzidenz" integer not null, "maxAnzahlPersonnen pro qm" integer, "Datum" timestamp with local time zone) trx2
DECLARE PK_NAME VARCHAR(200); BEGIN  EXECUTE IMMEDIATE ('CREATE SEQUENCE "izendez und mehr:d_seq"');  SELECT cols.column_name INTO PK_NAME  FROM all_constraints cons, all_cons_columns cols  WHERE cons.constraint_type = 'P'  AND cons.constraint_name = cols.constraint_name  AND cons.owner = cols.owner  AND cols.table_name = 'Izendez und mehr:D';  execute immediate ('create or replace trigger "izendez und mehr:d_autoinc_trg"  BEFORE INSERT on "Izendez und mehr:D"  for each row  declare  checking number := 1;  begin    if (:new."' || PK_NAME || '" is null) then      while checking >= 1 loop        select "izendez und mehr:d_seq".nextval into :new."' || PK_NAME || '" from dual;        select count("' || PK_NAME || '") into checking from "Izendez und mehr:D"        where "' || PK_NAME || '" = :new."' || PK_NAME || '";      end loop;    end if;  end;'); END; trx2
insert into "migrations" ("batch", "migration_time", "name") values (?, ?, ?) trx2
create table "Tischgruppe" ("id" integer not null primary key, "Anzahl Tische" integer, "Raum_id" integer not null) trx2
DECLARE PK_NAME VARCHAR(200); BEGIN  EXECUTE IMMEDIATE ('CREATE SEQUENCE "tischgruppe_seq"');  SELECT cols.column_name INTO PK_NAME  FROM all_constraints cons, all_cons_columns cols  WHERE cons.constraint_type = 'P'  AND cons.constraint_name = cols.constraint_name  AND cons.owner = cols.owner  AND cols.table_name = 'Tischgruppe';  execute immediate ('create or replace trigger "tischgruppe_autoinc_trg"  BEFORE INSERT on "Tischgruppe"  for each row  declare  checking number := 1;  begin    if (:new."' || PK_NAME || '" is null) then      while checking >= 1 loop        select "tischgruppe_seq".nextval into :new."' || PK_NAME || '" from dual;        select count("' || PK_NAME || '") into checking from "Tischgruppe"        where "' || PK_NAME || '" = :new."' || PK_NAME || '";      end loop;    end if;  end;'); END; trx2
alter table "Tischgruppe" add constraint "tischgruppe_raum_id_foreign" foreign key ("Raum_id") references "Raum" ("id") on delete cascade trx2
create table "Kontaktdaten" ("id" integer not null primary key, "Adresse_id" integer not null) trx2
DECLARE PK_NAME VARCHAR(200); BEGIN  EXECUTE IMMEDIATE ('CREATE SEQUENCE "kontaktdaten_seq"');  SELECT cols.column_name INTO PK_NAME  FROM all_constraints cons, all_cons_columns cols  WHERE cons.constraint_type = 'P'  AND cons.constraint_name = cols.constraint_name  AND cons.owner = cols.owner  AND cols.table_name = 'Kontaktdaten';  execute immediate ('create or replace trigger "kontaktdaten_autoinc_trg"  BEFORE INSERT on "Kontaktdaten"  for each row  declare  checking number := 1;  begin    if (:new."' || PK_NAME || '" is null) then      while checking >= 1 loop        select "kontaktdaten_seq".nextval into :new."' || PK_NAME || '" from dual;        select count("' || PK_NAME || '") into checking from "Kontaktdaten"        where "' || PK_NAME || '" = :new."' || PK_NAME || '";      end loop;    end if;  end;'); END; trx2
alter table "Kontaktdaten" add constraint "pOY6K3acnd6pBWAiYGYoYLnv1lY" foreign key ("Adresse_id") references "Adresse" ("id") on delete cascade trx2
create table "Kunde" ("id" integer not null primary key, "Kontaktdaten_id" integer not null, "Kundentyp_id" integer not null) trx2
DECLARE PK_NAME VARCHAR(200); BEGIN  EXECUTE IMMEDIATE ('CREATE SEQUENCE "kunde_seq"');  SELECT cols.column_name INTO PK_NAME  FROM all_constraints cons, all_cons_columns cols  WHERE cons.constraint_type = 'P'  AND cons.constraint_name = cols.constraint_name  AND cons.owner = cols.owner  AND cols.table_name = 'Kunde';  execute immediate ('create or replace trigger "kunde_autoinc_trg"  BEFORE INSERT on "Kunde"  for each row  declare  checking number := 1;  begin    if (:new."' || PK_NAME || '" is null) then      while checking >= 1 loop        select "kunde_seq".nextval into :new."' || PK_NAME || '" from dual;        select count("' || PK_NAME || '") into checking from "Kunde"        where "' || PK_NAME || '" = :new."' || PK_NAME || '";      end loop;    end if;  end;'); END; trx2
alter table "Kunde" add constraint "kunde_kontaktdaten_id_foreign" foreign key ("Kontaktdaten_id") references "Kontaktdaten" ("id") on delete cascade trx2
alter table "Kunde" add constraint "kunde_kundentyp_id_foreign" foreign key ("Kundentyp_id") references "Kundentyp" ("id") on delete cascade trx2
insert into "migrations" ("batch", "migration_time", "name") values (?, ?, ?) trx2
create table "Reservierung" ("id" integer not null primary key, "Datum" date, "Kunde_id" integer not null) trx2
DECLARE PK_NAME VARCHAR(200); BEGIN  EXECUTE IMMEDIATE ('CREATE SEQUENCE "reservierung_seq"');  SELECT cols.column_name INTO PK_NAME  FROM all_constraints cons, all_cons_columns cols  WHERE cons.constraint_type = 'P'  AND cons.constraint_name = cols.constraint_name  AND cons.owner = cols.owner  AND cols.table_name = 'Reservierung';  execute immediate ('create or replace trigger "reservierung_autoinc_trg"  BEFORE INSERT on "Reservierung"  for each row  declare  checking number := 1;  begin    if (:new."' || PK_NAME || '" is null) then      while checking >= 1 loop        select "reservierung_seq".nextval into :new."' || PK_NAME || '" from dual;        select count("' || PK_NAME || '") into checking from "Reservierung"        where "' || PK_NAME || '" = :new."' || PK_NAME || '";      end loop;    end if;  end;'); END; trx2
alter table "Reservierung" add constraint "reservierung_kunde_id_foreign" foreign key ("Kunde_id") references "Kunde" ("id") on delete cascade trx2
create table "Tisch" ("id" integer not null primary key, "Tischgruppe_id" integer not null) trx2
DECLARE PK_NAME VARCHAR(200); BEGIN  EXECUTE IMMEDIATE ('CREATE SEQUENCE "tisch_seq"');  SELECT cols.column_name INTO PK_NAME  FROM all_constraints cons, all_cons_columns cols  WHERE cons.constraint_type = 'P'  AND cons.constraint_name = cols.constraint_name  AND cons.owner = cols.owner  AND cols.table_name = 'Tisch';  execute immediate ('create or replace trigger "tisch_autoinc_trg"  BEFORE INSERT on "Tisch"  for each row  declare  checking number := 1;  begin    if (:new."' || PK_NAME || '" is null) then      while checking >= 1 loop        select "tisch_seq".nextval into :new."' || PK_NAME || '" from dual;        select count("' || PK_NAME || '") into checking from "Tisch"        where "' || PK_NAME || '" = :new."' || PK_NAME || '";      end loop;    end if;  end;'); END; trx2
alter table "Tisch" add constraint "tisch_tischgruppe_id_foreign" foreign key ("Tischgruppe_id") references "Tischgruppe" ("id") on delete cascade trx2
create table "gebuchterTisch" ("Tisch_id" integer not null, "reservierung_id" integer not null) trx2
alter table "gebuchterTisch" add constraint "zQpfO4CoYJFXi1Qk9PeidB5AgxE" foreign key ("Tisch_id") references "Tisch" ("id") on delete cascade trx2
alter table "gebuchterTisch" add constraint "SpO7P/GVrDQgQKetoijia6sNIds" foreign key ("reservierung_id") references "Reservierung" ("id") on delete cascade trx2
alter table "gebuchterTisch" add constraint "gebuchterTisch_pkey" primary key ("reservierung_id") trx2
insert into "migrations" ("batch", "migration_time", "name") values (?, ?, ?) trx2
update "migrations_lock" set "is_locked" = ? trx2