BEGIN; trx2
create table `Raum` (`id` int unsigned not null auto_increment primary key, `Name` varchar(40) not null, `Ausenbereich` boolean, `Fläche in m2` float(8, 2) not null) trx2
create table `Adresse` (`id` int unsigned not null auto_increment primary key, `strasse` varchar(50) not null, `Hausnummer` varchar(12), `stadt` varchar(50) not null, `zipcode` varchar(15) not null) trx2
create table `Kundentyp` (`id` int unsigned not null auto_increment primary key, `hatReserviert` boolean not null) trx2
create table `Izendez und mehr:D` (`id` int unsigned not null auto_increment primary key, `momentane Inzidenz` int not null, `maxAnzahlPersonnen pro qm` int, `Datum` datetime) trx2
create table `Tischgruppe` (`id` int unsigned not null auto_increment primary key, `Anzahl Tische` int, `Raum_id` int unsigned not null) trx2
alter table `Tischgruppe` add constraint `tischgruppe_raum_id_foreign` foreign key (`Raum_id`) references `Raum` (`id`) on delete cascade trx2
create table `Kontaktdaten` (`id` int unsigned not null auto_increment primary key, `Adresse_id` int unsigned not null) trx2
alter table `Kontaktdaten` add constraint `kontaktdaten_adresse_id_foreign` foreign key (`Adresse_id`) references `Adresse` (`id`) on delete cascade trx2
create table `Kunde` (`id` int unsigned not null auto_increment primary key, `Kontaktdaten_id` int unsigned not null, `Kundentyp_id` int unsigned not null) trx2
alter table `Kunde` add constraint `kunde_kontaktdaten_id_foreign` foreign key (`Kontaktdaten_id`) references `Kontaktdaten` (`id`) on delete cascade trx2
alter table `Kunde` add constraint `kunde_kundentyp_id_foreign` foreign key (`Kundentyp_id`) references `Kundentyp` (`id`) on delete cascade trx2
create table `Reservierung` (`id` int unsigned not null auto_increment primary key, `Datum` date, `Kunde_id` int unsigned not null) trx2
alter table `Reservierung` add constraint `reservierung_kunde_id_foreign` foreign key (`Kunde_id`) references `Kunde` (`id`) on delete cascade trx2
create table `Tisch` (`id` int unsigned not null auto_increment primary key, `Tischgruppe_id` int unsigned not null) trx2
alter table `Tisch` add constraint `tisch_tischgruppe_id_foreign` foreign key (`Tischgruppe_id`) references `Tischgruppe` (`id`) on delete cascade trx2
create table `gebuchterTisch` (`Tisch_id` int unsigned not null, `reservierung_id` int unsigned not null) trx2
alter table `gebuchterTisch` add constraint `gebuchtertisch_tisch_id_foreign` foreign key (`Tisch_id`) references `Tisch` (`id`) on delete cascade trx2
alter table `gebuchterTisch` add constraint `gebuchtertisch_reservierung_id_foreign` foreign key (`reservierung_id`) references `Reservierung` (`id`) on delete cascade trx2
alter table `gebuchterTisch` add primary key `gebuchterTisch_pkey`(`reservierung_id`) trx2
COMMIT; trx2
