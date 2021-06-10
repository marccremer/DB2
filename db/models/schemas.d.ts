/* eslint-disable */
//outdated as of 24.05.2021

interface Raum  {
  Name: string;
  Ausenbereich: boolean;
  max_Anzahl_Personen:number;
  Flaeche_in_m2: number;
}

interface Tischgruppe  {
  Name: string;
  Raum_id: number;
}
interface Tisch  {
  anzahl_plaetze:number;
  Tischgruppe_id:number;
}
interface Reservierung  {
  Datumszeit: string;
  deleted?: boolean;
  storniert?: boolean;
  reservierer_id:number;
}

interface Tischreservierung  {
  Tisch_id:number;
  reservierung_id:number;
}

interface Teilnehmer {
  Reservierungs_id:number;
  Reservierer_id:number;
  Begleiter_id:number;
}

interface Begleiter  {
  Kunden_id:number;
}

interface Reservierer  {
  Kunden_id:number;
  Kreditkartennummer:number;
}

interface Kunde {
  id?: number
  nachname: string;
  vorname:string;
  alter: number;
  Kontaktdaten_id: number;
}

interface Kontaktdaten  {
  Adresse_id:number;
  'E-mail':String;
  Telefonnummer:number;
}

interface Adresse  {
  strasse: string;
  Hausnummer: string;
  stadt: string;
  zipcode: string;
}

interface coronaInfo  {
  momentane_Inzidenz: number;
  maxAnzahlPersonnen_pro_qm: number;
  Datum: string;
}

export {
  Raum,
  Tischgruppe,
  Tisch,
  Reservierung,
  Tischreservierung,
  Teilnehmer,
  Begleiter,
  Reservierer,
  Kunde,
  Kontaktdaten,
  Adresse,
  coronaInfo,
}