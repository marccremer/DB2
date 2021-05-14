const tableNames = require('../../src/tableNames')

/**
 * @param {import('knex')} knex
 */
exports.seed = async (knex) => {
  // Deletes ALL existing entries
  await Promise.all(Object.values(tableNames).map((name) => knex(name).del()));
  const adresse1 = {
    strasse: "Hauptstrasse",
    Hausnummer: "2",
    zipcode: "1234",
    stadt: "Gummersbach",
  };
  const raum1 = {
    Name: "Hauptraum",
    Ausenbereich: 0,
    Flaeche_in_m2: 21,
  };
  const coronaInfo1 = {
    momentane_Inzidenz: 20,
    maxAnzahlPersonnen_pro_qm: 100,
  };

  const kundentype1 = {
    hatReserviert: 1,
  };

  const adresse_id1 = await knex(tableNames.adresse)
    .insert(adresse1)
    .returning("id");
  const raum_id1 = await knex(tableNames.raum).insert(raum1).returning("id");
  const _cid = await knex(tableNames.coronaInfo).insert(coronaInfo1);

  const kundentype_id1 = await knex(tableNames.kundentyp)
    .insert(kundentype1)
    .returning("id");

  const tischgruppe1 = {
    Anzahl_Tische: 2,
    Raum_id: raum_id1,
  };
  const kontaktdaten1 = {
    Adresse_id: adresse_id1,
  };

  const Kontaktdaten_id1 = await knex(tableNames.kontaktdaten)
    .insert(kontaktdaten1)
    .returning("id");

  const kunde1 = {
    name: "Marc",
    Kontaktdaten_id: Kontaktdaten_id1,
    Kundentyp_id: kundentype_id1,
  };
  const kunde2 = {
    name: "Edgar",
    Kontaktdaten_id: Kontaktdaten_id1,
    Kundentyp_id: kundentype_id1,
  };
  const kunde3 = {
    name: "Maik",
    Kontaktdaten_id: Kontaktdaten_id1,
    Kundentyp_id: kundentype_id1,
  };

  const kunde_id1 = await knex(tableNames.kunde).insert(kunde1).returning("id");
  const kunde_id2 = await knex(tableNames.kunde).insert(kunde2).returning("id");
  const kunde_id3 = await knex(tableNames.kunde).insert(kunde3).returning("id");
};
