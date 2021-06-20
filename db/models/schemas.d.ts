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

interface ReservierungHilfe{
  Datumszeit: string;
  deleted?: boolean;
  storniert?: boolean;
  reservierer_id:number;
  Kundennummern:Array<number>;
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
  Kunde_id:number;
  Reservierung_id:number;
}

interface Reservierer  {
  Kunden_id:number;
  Kreditkartennummer:number;
}

interface Kunde {
  id?:number
  Nachname: string;
  Vorname:string;
  Alter: number;
  Kontaktdaten_id: number;
}

interface joinedKunde extends Kunde {
  Kontaktdaten_id: number,
  Adresse_id:number;
  EMail:String;
  Telefonnummer:number;
  strasse: string;
  Hausnummer: string;
  stadt: string;
  zipcode: string;
}

interface Kontaktdaten  {
  id?: Number;
  Adresse_id:number;
  EMail:String;
  Telefonnummer:number;
}

interface Adresse  {
  id?: Number;
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
  joinedKunde,
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
  ReservierungHilfe,
}