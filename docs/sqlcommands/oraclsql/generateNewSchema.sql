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