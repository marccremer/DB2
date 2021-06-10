const viewNames = {
  sampleview: 'someview',
  kundenAnwesenheit: 'kundenAnwesenheit',
  aktuelleKunden: 'aktuelleKunden',

};
const tableNames = require('../../src/tableNames');

/**
 * @param {import('knex')} knex
 */
exports.up = async (knex) => {
  const term = 'M';
  const selectstatement = await knex(tableNames.kunde)
    .where('Vorname', 'like', 'M%').toSQL();
  console.log(selectstatement);
  await knex.raw('DROP VIEW IF EXISTS aktuelleKunden');
  await knex.raw('DROP VIEW IF EXISTS kundenAnwesenheit');
  await knex.raw(`
  CREATE VIEW aktuelleKunden AS SELECT B.Kunde_id, k2.Vorname AS Begleitervorname, k2.Nachname AS Begleiternachname, Datumszeit,Reservierung_id, Kunde.Vorname AS Reservierervorname, Kunde.Nachname AS Reservierernachname
    FROM Reservierung JOIN Kunde ON Reservierung.reservierer_id = Kunde.id
    JOIN Begleiter B on Reservierung.id = B.Reservierung_id
    JOIN Kunde k2 ON k2.id = B.Kunde_id
    WHERE Reservierung.Datumszeit = CURDATE()`);

  await knex.raw(`
  CREATE VIEW kundenAnwesenheit AS SELECT B.Kunde_id, k2.Vorname AS Begleitervorname, k2.Nachname AS Begleiternachname, Datumszeit,Reservierung_id, Kunde.Vorname AS Reservierervorname, Kunde.Nachname AS Reservierernachname
    FROM Reservierung JOIN Kunde ON Reservierung.reservierer_id = Kunde.id
    JOIN Begleiter B on Reservierung.id = B.Reservierung_id
    JOIN Kunde k2 ON k2.id = B.Kunde_id`);
  await knex.raw(`create view ${viewNames.sampleview} as ${selectstatement.sql}`, selectstatement.bindings);
  return;
};

exports.down = async (knex) => {
  await Promise.all(
    Object.values(viewNames)
      .map((viewName) => knex.raw(`drop view if exists ${viewName}`)),
  );
};
