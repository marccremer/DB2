const {references} = require('../../src/tableUtils')
const tableNames = require('../../src/tableNames');

/**
 * @param {import('knex')} knex
 */
exports.up = async (knex) => {
  await knex.schema.createTable(tableNames.reservierung, (table) => {
    table.increments().notNullable();
    table.date('Datum').notNullable
    references(table,tableNames.kunde)
  });

  await knex.schema.createTable(tableNames.tisch, (table) => {
    table.increments().notNullable();
    references(table,tableNames.tischgruppe)
  });

  await knex.schema.createTable(tableNames.gebuchterTisch, (table) => {
    references(table,tableNames.tisch)
    references(table,tableNames.reservierung,true,'reservierung')
    table.primary('reservierung_id')
  });

};

exports.down = async (knex) => {
  await Promise.all(
    [
      tableNames.reservierung,
      tableNames.tisch,
      tableNames.gebuchterTisch
    ]
    .reverse()
    .map((tableName) => knex.schema.dropTableIfExists(tableName))
  );
};