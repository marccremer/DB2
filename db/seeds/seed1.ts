import Knex from 'knex';
import tableNames from '../../src/tableNames';
import * as date from "date-and-time";
import { Adresse, coronaInfo, Kontaktdaten, Kunde, Raum, Tisch, Tischgruppe} from '../models/schemas'
/**
 * @param {import('knex')} knex
 */
exports.seed = async (knex : Knex) => {
  // Deletes ALL existing entries
  await Promise.all(Object.values(tableNames).map((name) => knex(name).del()));
  const raum1 : Raum = {
    max_Anzahl_Personen:0,
    Name: 'Hauptraum',
    Ausenbereich: true,
    Flaeche_in_m2: 21,
  };
  const raum2 : Raum = {
    max_Anzahl_Personen:0,
    Name: 'Nebenraum',
    Ausenbereich: true,
    Flaeche_in_m2: 21,
  };
  const now = new Date()

  const coronaInfo1 : coronaInfo = {
    // we need YYYY-MM-DD HH:MM:SS
    Datum: date.format(now,'YYYY/MM/DD HH:mm:ss'),
    momentane_Inzidenz: 20,
    maxAnzahlPersonnen_pro_qm: 100,
  };
  

  

  const [raumId1,_] = await knex(tableNames.raum)
  .insert([raum1,raum2])
  .returning('id');


  await knex(tableNames.coronaInfo).insert(coronaInfo1);
  
  const tischgruppe1 : Tischgruppe = {
    Name:'TischgruppeAlpha',
    Raum_id: raumId1,
  };
  const tischgruppe2 : Tischgruppe = {
    Name:'Tischgruppeomega',
    Raum_id: raumId1+1,
  };

  
  const [tischgruppeId1,tischgruppeId2] = await knex(tableNames.tischgruppe)
  .insert([tischgruppe1,tischgruppe2])
  .returning('id');

  const tisch1 :Tisch = {
    anzahl_plaetze:2,
    Tischgruppe_id:tischgruppeId1
  }
  const tisch2 : Tisch = {
    anzahl_plaetze:23,
    Tischgruppe_id: tischgruppeId1+1
  }
  const [tischId1,tischId2] = await knex(tableNames.tisch)
  .insert([tisch1,tisch2])
  .returning('id');

  const adresse1 : Adresse = {
    strasse: 'Hauptstrasse',
    Hausnummer: '2',
    zipcode: '1234',
    stadt: 'Gummersbach',
  };
  const adresse2 : Adresse = {
    strasse: 'Hauptstrasse',
    Hausnummer: '2',
    zipcode: '1234',
    stadt: 'Gummersbach',
  };
  const [adresseId1,adresseId2] = await knex(tableNames.adresse)
  .insert([adresse1,adresse2])
  .returning('id');

  const kontaktdaten1 : Kontaktdaten = {
    "E-mail":'sample@test.de',
    Telefonnummer:23123213,
    Adresse_id: adresseId1,
  };
  
  const kontaktdaten2 : Kontaktdaten = {
    "E-mail":'sample@test.de',
    Telefonnummer:23123213,
    Adresse_id: adresseId1,
  };

  const kontaktdaten3 : Kontaktdaten = {
    "E-mail":'sample@test.de',
    Telefonnummer:23123213,
    Adresse_id: adresseId1+1,
  };

  const [kontaktdatenId1,kontaktdatenId2,kontaktdatenId3] = await knex<Kontaktdaten>(tableNames.kontaktdaten)
  .insert([kontaktdaten1,kontaktdaten2,kontaktdaten3])
  .returning('id');
  
  const kunde1 : Kunde = {
    vorname: 'Marc',
    nachname: 'Mustermann',
    alter: 21,
    Kontaktdaten_id: kontaktdatenId1,
  };
  const kunde2 : Kunde = {
    vorname: 'Edgar',
    nachname: 'Mustermann',
    alter: 21,    
    Kontaktdaten_id: kontaktdatenId1+1,
  };
  const kunde3 : Kunde = {
    vorname: 'Maik',
    nachname: 'Mustermann',
    alter: 21,    
    Kontaktdaten_id: kontaktdatenId1+2,
  };
  
  const [kunde_id1,kunde_id2,kunde_id3] = await knex(tableNames.kunde)
  .insert([kunde1,kunde2,kunde3])
  .returning('id');
};
