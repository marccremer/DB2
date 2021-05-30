import Knex from 'knex';
import * as date from "date-and-time";
import { Adresse, Begleiter, coronaInfo, Kontaktdaten, Kunde, Raum, Reservierer, Reservierung, Tisch, Tischgruppe, Tischreservierung} from '../models/schemasOracle'
/**
 * @param {import('knex')} knex
 */
const tableNames = {
  raum:"RAUM",
  Adresse:"ADRESSE",
  Kontaktdaten:"KONTAKTDATEN",
  CoronaInfo:"CORONAINFO",
  Tischgruppe:"TISCHGRUPPE",
  Tisch:"TISCH",
  reservier:"RESERVIER",
  Reservierung:"RESERVIERUNG",
  begleiter:"BEGLEITER",
  Tischreservierung:"TISCHRESERVIERUNG",
}

exports.seed = async (knex : Knex) => {
  // Deletes ALL existing entries
  //await Promise.all(Object.values(tableNames).map((name) => knex(name).del()));
  
  const raum1 : Raum = {
    MAX_ANZAHL_PERSONEN:20,
    NAME: 'Hauptraum',
    AUSENBEREICH: true,
    FLAECHE_IN_M2: 21,
  };
  const raum2 : Raum = {
    MAX_ANZAHL_PERSONEN:0,
    NAME: 'Nebenraum',
    AUSENBEREICH: true,
    FLAECHE_IN_M2: 21,

  };
  const [date] = await knex.raw(`SELECT
  CURRENT_TIMESTAMP
FROM
  dual`);
  const now = date.CURRENT_TIMESTAMP
  
  const coronaInfo1 : coronaInfo = {
    DATUM: now,
    MOMENTANE_INZIDENZ: 20,
    MAXANZAHLPERSONNEN_PRO_QM: 100,
  };
  

  
  await knex(tableNames.CoronaInfo).insert(coronaInfo1);


  const [raumId1,raumId2] = await knex(tableNames.raum)
  .insert([raum1,raum2])
  .returning('ID');

  
  
  const tischgruppe1 : Tischgruppe = {
    NAME:'TischgruppeAlpha',
    RAUM_ID: raumId1,
  };
  const tischgruppe2 : Tischgruppe = {
    NAME:'Tischgruppeomega',
    RAUM_ID: raumId2,
  };

  console.log(tischgruppe2);
  
  const [tischgruppeId1,tischgruppeId2] = await knex(tableNames.Tischgruppe)
  .insert([tischgruppe1,tischgruppe2])
  .returning('ID');

  const tisch1 :Tisch = {
    ANZAHL_PLAETZE:2,
    TISCHGRUPPE_ID:tischgruppeId1
  }
  const tisch2 : Tisch = {
    ANZAHL_PLAETZE:23,
    TISCHGRUPPE_ID: tischgruppeId2
  }
  const [tischId1] = await knex(tableNames.Tisch)
  .insert([tisch1])
  .returning('ID');

  const [tischId2] = await knex(tableNames.Tisch)
  .insert([tisch2])
  .returning('ID');


  const adresse1 : Adresse = {
    STRASSE: 'Hauptstrasse',
    HAUSNUMMER: '2',
    ZIPCODE: '1234',
    STADT: 'Gummersbach',
  };
  const adresse2 : Adresse = {
    STRASSE: 'Hauptstrasse',
    HAUSNUMMER: '2',
    ZIPCODE: '1234',
    STADT: 'Gummersbach',
  };
  const [adresseId1,adresseId2] = await knex(tableNames.Adresse)
  .insert([adresse1,adresse2])
  .returning('ID');

  const kontaktdaten1 : Kontaktdaten = {
    EMAIL:'sample@test.de',
    TELEFONNUMMER:23123213,
    ADRESSE_ID: adresseId1,
  };
  
  const kontaktdaten2 : Kontaktdaten = {
    EMAIL:'sample@test.de',
    TELEFONNUMMER:23123213,
    ADRESSE_ID: adresseId1,
  };

  const kontaktdaten3 : Kontaktdaten = {
    EMAIL:'sample@test.de',
    TELEFONNUMMER:23123213,
    ADRESSE_ID: adresseId2,
  };

  const [kontaktdatenId1,kontaktdatenId2,kontaktdatenId3] = await knex<Kontaktdaten>(tableNames.Kontaktdaten)
  .insert([kontaktdaten1,kontaktdaten2,kontaktdaten3])
  .returning('ID');
  
  const reservierer1 : Reservierer = {
    VORNAME: 'Maik',
    NACHNAME: 'Mustermann',
    ALTERKUNDE: 21,    
    KONTAKTDATEN_ID: kontaktdatenId3,
    KREDITKARTENNUMMER:'1111-222-333'
  };

  const [reservierer_id1] = await knex(tableNames.reservier)
  .insert([reservierer1])
  .returning('ID');

  const reservierung1 : Reservierung = {
    DATUMSZEIT: now,
    RESERVIERER_ID:reservierer_id1
  }


  const [reservierungs_id1] = await knex(tableNames.Reservierung)
  .insert(reservierung1)
  .returning('ID');

  const gebuchterTisch1 : Tischreservierung = {
    TISCH_ID:tischId1,
    RESERVIERUNG_ID:reservierungs_id1,
  }
  const gebuchterTisch2 : Tischreservierung = {
    TISCH_ID:tischId2,
    RESERVIERUNG_ID:reservierungs_id1,
  }
 await knex(tableNames.Tischreservierung)
  .insert([gebuchterTisch1,gebuchterTisch2])



  const begleiter1 : Begleiter = {
    VORNAME: 'Marc',
    NACHNAME: 'Mustermann',
    ALTERKUNDE: 21,
    KONTAKTDATEN_ID: kontaktdatenId1,
    RESERVIERUNGS_ID:reservierungs_id1,
  };
  const begleiter2 : Begleiter = {
    VORNAME: 'Edgar',
    NACHNAME: 'Mustermann',
    ALTERKUNDE: 21,    
    KONTAKTDATEN_ID: kontaktdatenId2,
    RESERVIERUNGS_ID:reservierungs_id1,
  };
  
  const [kunde_id1,kunde_id2,kunde_id3] = await knex(tableNames.begleiter)
  .insert([begleiter1,begleiter2])
  .returning('ID');

};
