create table `Raum`
(
    `id`                  int unsigned not null auto_increment primary key,
    `Name`                varchar(40)  not null,
    `Ausenbereich`        boolean,
    `max_Anzahl_Personen` int,
    `Flaeche_in_m2`       float(8, 2)  not null
);
create table `Adresse`
(
    `id`         int unsigned not null auto_increment primary key,
    `strasse`    varchar(50)  not null,
    `Hausnummer` varchar(12),
    `stadt`      varchar(50)  not null,
    `zipcode`    varchar(15)  not null
);
create table `Kontaktdaten`
(
    `id`            int unsigned not null auto_increment primary key,
    `Adresse_id`    int unsigned not null,
    `E-Mail`        varchar(254),
    `Telefonnummer` int
);
alter table `Kontaktdaten`
    add constraint `kontaktdaten_adresse_id_foreign` foreign key (`Adresse_id`) references `Adresse` (`id`) on delete cascade;
create table `CoronaInfo`
(
    `id`                        int unsigned not null auto_increment primary key,
    `momentane_Inzidenz`        int          not null,
    `maxAnzahlPersonnen_pro_qm` int,
    `Datum`                     datetime
);
create table `Tischgruppe`
(
    `id`      int unsigned not null auto_increment primary key,
    `Name`    text,
    `Raum_id` int unsigned not null
);
alter table `Tischgruppe`
    add constraint `tischgruppe_raum_id_foreign` foreign key (`Raum_id`) references `Raum` (`id`) on delete cascade;
create table `Tisch`
(
    `id`             int unsigned not null auto_increment primary key,
    `anzahl_plaetze` int          not null,
    `Tischgruppe_id` int unsigned not null
);
alter table `Tisch`
    add constraint `tisch_tischgruppe_id_foreign` foreign key (`Tischgruppe_id`) references `Tischgruppe` (`id`) on delete cascade;
create table `Kunde`
(
    `id`              int unsigned not null auto_increment primary key,
    `Vorname`         text         not null,
    `Nachname`        text         not null,
    `Alter`           int          not null,
    `Kontaktdaten_id` int unsigned not null
);
alter table `Kunde`
    add constraint `kunde_kontaktdaten_id_foreign` foreign key (`Kontaktdaten_id`) references `Kontaktdaten` (`id`) on delete cascade;

create table `Reservierung`
(
    `id`                int unsigned not null auto_increment primary key,
    `Datumszeit`        datetime     not null,
    `deleted`           boolean default '0',
    `storniert`         boolean default '0',
    `reservierer_id_id` int unsigned not null
);
alter table `Reservierung`
    add constraint `reservierung_reservierer_id_id_foreign` foreign key (`reservierer_id_id`) references `Kunde` (`id`) on delete cascade;
create table `Begleiter`
(
    `Kunde_id`        int unsigned not null,
    `Reservierung_id` int unsigned not null
);
alter table `Begleiter`
    add constraint `begleiter_kunde_id_foreign` foreign key (`Kunde_id`) references `Kunde` (`id`) on delete cascade;
alter table `Begleiter`
    add constraint `begleiter_reservierung_id_foreign` foreign key (`Reservierung_id`) references `Reservierung` (`id`) on delete cascade;
create table `Tischreservierung`
(
    `Tisch_id`        int unsigned not null,
    `reservierung_id` int unsigned not null
);
alter table `Tischreservierung`
    add constraint `tischreservierung_tisch_id_foreign` foreign key (`Tisch_id`) references `Tisch` (`id`) on delete cascade;
alter table `Tischreservierung`
    add constraint `tischreservierung_reservierung_id_foreign` foreign key (`reservierung_id`) references `Reservierung` (`id`) on delete cascade;
alter table `Tischreservierung`
    add primary key `Tischreservierung_pkey` (`reservierung_id`);