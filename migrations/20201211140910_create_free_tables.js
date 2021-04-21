const tableNames = require('../src/tableNames');
const { idprime } = require('../src/tableUtils');

/**
 * @param {import('knex')} knex
 */

exports.up = async (knex) => {
  await knex.schema.createTable(tableNames.raum, (table) => {
    table.increments().notNullable();
    table.string('RaumName', 20).notNullable();
    table.float('Fläche in m2')
  });
  await knex.schema.createTable(tableNames.adresse, (table) => {
    table.increments().notNullable();
    table.string('Stadtname', 105).notNullable();
    table.string('Flughafen', 100).notNullable();
    table.string('Land', 60).notNullable();
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable(tableNames.kunde);
  await knex.schema.dropTable(tableNames.stadt);
};
