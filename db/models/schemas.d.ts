type Raum = {
  Name: string;
  Ausenbereich: number;
  Flaeche_in_m2: number;
}

type Tischgruppe = {
  Anzahl_Tische:number;
  Raum_id: number;
}
type Tisch = {
  Tischgruppe_id:number;
}
type Reservierung = {
  Datum: string;
  Kunde_id: number;
}

type GebuchterTisch = {
  Tisch_id:number;
  reservierung_id:number;
}

type Kunde = {
  name: string;
  Kontaktdaten_id: number;
  Kundentyp_id : number;
}
type Kundentyp = {
  hatReserviert: Boolean | number,
}
 
type Kontaktdaten = {
  Adresse_id: number;
}

type Adresse = {
  strasse: string;
  Hausnummer: string;
  stadt: string;
  zipcode: string;
}

type coronaInfo = {
  momentane_Inzidenz: number;
  maxAnzahlPersonnen_pro_qm: number;
  Datum: string;
}
 