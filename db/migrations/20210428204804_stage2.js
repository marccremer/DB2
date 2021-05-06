const {references} = require('../../src/tableUtils')
const tableNames = require('../../src/tableNames');

/**
 * @param {import('knex')} knex
 */
exports.up = async (knex) => {
  await knex.schema.createTable(tableNames.tischgruppe, (table) => {
    table.increments().notNullable();
    table.integer('Anzahl Tische')
    references(table,tableNames.raum)
  });

  await knex.schema.createTable(tableNames.kontaktdaten, (table) => {
    table.increments().notNullable();
    references(table,tableNames.adresse)
  });
 
  await knex.schema.createTable(tableNames.kunde, (table) => {
    table.increments().notNullable();
    references(table,tableNames.kontaktdaten)
    references(table,tableNames.kundentyp)
  });

};

exports.down = async (knex) => {
  await Promise.all(
    [
      tableNames.tischgruppe,
      tableNames.kontaktdaten,
      tableNames.kunde
    ]
    .reverse()
    .map((tableName) => knex.schema.dropTableIfExists(tableName))
  );
};