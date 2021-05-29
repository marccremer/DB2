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

    foreign key(KONTAKTDATEN_ID) references "Kontaktdaten"("id");
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

create type begleiter_t under kunden_t (
    stammkunde number
                                       )final ;
create table begleiter of begleiter_t;

alter table begleiter add constraint pk_begleiter primary key (ID);
alter table begleiter add constraint fk_bge_kontakt
    foreign key(KONTAKTDATEN_ID) references "Kontaktdaten"("id");
alter table begleiter add constraint fk_begleiter
    foreign key(RESERVERINGS_ID) references "Reservierung"("id");
create sequence begleiter_seq;
CREATE OR REPLACE TRIGGER BEGLEITER_autoinc
BEFORE INSERT ON BEGLEITER
FOR EACH ROW
BEGIN
  SELECT begleiter_seq.NEXTVAL
  INTO   :new.ID
  FROM   dual;
END;