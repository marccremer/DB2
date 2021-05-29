const { references } = require('../../src/tableUtils');
const tableNames = require('../../src/tableNames');

/**
 * @param {import('knex')} knex
 */
exports.up = async (knex) => {

  await knex.schema.createTable(tableNames.reservierung, (table) => {
    table.increments().notNullable();
    table.datetime('Datumszeit').notNullable();
    table.boolean('deleted').defaultTo(false);
    table.boolean('storniert').defaultTo(false);
    references(table,tableNames.kunde,true,"reservierer");
  });

  await knex.schema.createTable(tableNames.begleiter, (table) => {
    references(table, tableNames.kunde);
    references(table,tableNames.reservierung);
  });

  await knex.schema.createTable(tableNames.gebuchterTisch, (table) => {
    references(table, tableNames.tisch);
    references(table, tableNames.reservierung, true, 'reservierung');
  });

};

exports.down = async (knex) => {
  await Promise.all(
    [
      tableNames.reservierung,
      tableNames.begleiter,
      tableNames.gebuchterTisch,
    ]
      .reverse()
      .map((tableName) => knex.schema.dropTableIfExists(tableName)),
  );
};
