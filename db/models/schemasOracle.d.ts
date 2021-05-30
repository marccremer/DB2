/* eslint-disable */
//outdated as of 24.05.2021

interface Raum  {
  NAME: string;
  AUSENBEREICH: boolean;
  MAX_ANZAHL_PERSONEN:number;
  FLAECHE_IN_M2: number;
}

interface Tischgruppe  {
  NAME: string;
  RAUM_ID: number;
}
interface Tisch  {
  ANZAHL_PLAETZE:number;
  TISCHGRUPPE_ID:number;
}
interface Reservierung  {
  DATUMSZEIT: string;
  DELETED?: boolean;
  STORNIERT?: boolean;
  RESERVIERER_ID:number;
}

interface Tischreservierung  {
  TISCH_ID:number;
  RESERVIERUNG_ID:number;
}

interface Teilnehmer {
  RESERVIERUNGS_ID:number;
  RESERVIERER_ID:number;
  BEGLEITER_ID:number;
}


interface Kunde {
  NACHNAME: string;
  VORNAME:string;
  ALTERKUNDE: number;
  KONTAKTDATEN_ID: number;
}

interface Begleiter extends Kunde{
  RESERVIERUNGS_ID: number;
}

interface Reservierer extends Kunde{
  KREDITKARTENNUMMER: string;
}

interface Kontaktdaten  {
  ADRESSE_ID:number;
  EMAIL:String;
  TELEFONNUMMER:number;
}

interface Adresse  {
  STRASSE: string;
  HAUSNUMMER: string;
  STADT: string;
  ZIPCODE: string;
}

interface coronaInfo  {
  MOMENTANE_INZIDENZ: number;
  MAXANZAHLPERSONNEN_PRO_QM: number;
  DATUM: string;
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