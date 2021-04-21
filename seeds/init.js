const tableNames = require('../src/tableNames');
/**
 * @param {import('knex')} knex
 */
exports.seed = async (knex) => {
  // Deletes ALL existing entries
  await Promise.all(Object.values(tableNames).map((name) => knex(name).del()));
  const kunde1 = {
    Vorname: 'Marc',
    Nachnahme: 'Cremer',
    Adresse: 'Auf dem Teich 10',
  };
  const [createdKunde] = await knex(tableNames.kunde)
    .insert(kunde1)
    .returning('*');

  const stadt1 = {
    Stadtname: 'Gummersbach',
    Flughafen: 'Gummersbach Flughafen',
    Land: 'Deutschland',
  };
  const [createdStadt] = await knex(tableNames.stadt)
    .insert(stadt1)
    .returning('*');
  await knex(tableNames.stadt).insert({
    Stadtname: 'Madrid',
    Flughafen: 'Adolfo Suárez Madrid–Barajas Flughafen',
    Land: 'Spanien',
  });
};
