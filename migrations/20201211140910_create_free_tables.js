const tableNames = require('../src/tableNames');
const { idprime } = require('../src/tableUtils');

/**
 * @param {import('knex')} knex
 */

exports.up = async (knex) => {
  await knex.schema.createTable(tableNames.table, (table) => {
    table.increments().notNullable();
  });
  
    await knex.schema.createTable(tableNames.tischgruppe, (table) => {
      table.increments().notNullable();
    });
  
  await knex.schema.createTable(tableNames.raum, (table) => {
    table.increments().notNullable();
    table.string('RaumName', 20).notNullable();
    table.float('Fläche in m2')
  });

  await knex.schema.createTable(tableNames.kontakt, (table) => {
    table.increments().notNullable();
  });

  await knex.schema.createTable(tableNames.adresse, (table) => {
    table.increments().notNullable();
  });
  
  await knex.schema.createTable(tableNames.kunde, (table) => {
    table.increments().notNullable();
  });
  
  await knex.schema.createTable(tableNames.reservierung, (table) => {
    table.increments().notNullable();
  });
};

exports.down = async (knex) => {
  await Promise.all(
    [
      tableNames.table,
      tableNames.tischgruppe,
      tableNames.raum,
      tableNames.adresse,
      tableNames.kontakt,
      tableNames.kunde,
      tableNames.reservierung,
    ].map((tableName) => knex.schema.dropTableIfExists(tableName))
  );
};
