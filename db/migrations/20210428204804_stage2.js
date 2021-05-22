const { references } = require('../../src/tableUtils');
const tableNames = require('../../src/tableNames');

/**
 * @param {import('knex')} knex
 */
exports.up = async (knex) => {
  await knex.schema.createTable(tableNames.tischgruppe, (table) => {
    table.increments().notNullable();
    table.integer('Name');
    references(table, tableNames.raum);
  });

  await knex.schema.createTable(tableNames.tisch, (table) => {
    table.increments().notNullable();
    table.integer('anzahl_plaetze').notNullable();
    references(table, tableNames.tischgruppe);
  });

  await knex.schema.createTable(tableNames.kunde, (table) => {
    table.increments().notNullable();
    table.text('Vorname').notNullable();
    table.text('Nachname').notNullable();
    table.integer('Alter').notNullable();
    references(table, tableNames.kontaktdaten);
  });
};

exports.down = async (knex) => {
  await Promise.all(
    [
      tableNames.tischgruppe,
      tableNames.tisch,
      tableNames.kunde,
    ]
      .reverse()
      .map((tableName) => knex.schema.dropTableIfExists(tableName)),
  );
};
