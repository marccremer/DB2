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
  return;
  const term = 'M';
  const selectstatement = await knex(tableNames.kunde)
    .where('name', 'like', 'M%').toSQL();
  console.log(selectstatement);
  await knex.raw(`
  CREATE VIEW aktuelleKunden AS 
  SELECT Reservierung.Datum, Reservierung.Kunde_id, Kunde.name, Kunde.id
  FROM Kunde INNER JOIN Reservierung ON Reservierung.Kunde_id = Kunde.id
  WHERE Reservierung.Datum = CURDATE();`);

  await knex.raw(`
  CREATE VIEW kundenAnwesenheit AS 
  SELECT Reservierung.Datum, Reservierung.Kunde_id, Kunde.name, Kunde.id
  FROM Kunde INNER JOIN Reservierung ON Reservierung.Kunde_id = Kunde.id;`);
  await knex.raw(`create view ${viewNames.sampleview} as ${selectstatement.sql}`, selectstatement.bindings);
};

exports.down = async (knex) => {
  await Promise.all(
    Object.values(viewNames)
      .map((viewName) => knex.raw(`drop view if exists ${viewName}`)),
  );
};
