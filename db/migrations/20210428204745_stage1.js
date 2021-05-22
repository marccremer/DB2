const tableNames = require('../../src/tableNames');
const { references, email } = require('../../src/tableUtils');

/**
 * @param {import('knex')} knex
 */

exports.up = async (knex) => {
  await knex.schema.createTable(tableNames.raum, (table) => {
    table.increments().notNullable();
    table.string('Name', 40).notNullable();
    table.boolean('Ausenbereich');
    table.float('Flaeche_in_m2').notNullable();
  });

  await knex.schema.createTable(tableNames.adresse, (table) => {
    table.increments().notNullable();
    table.string('strasse', 50).notNullable();
    table.string('Hausnummer', 12);
    table.string('stadt', 50).notNullable();
    table.string('zipcode', 15).notNullable();
  });

  await knex.schema.createTable(tableNames.kontaktdaten, (table) => {
    table.increments().notNullable();
    references(table, tableNames.adresse);
    email(table, 'E-Mail');
    table.integer('Telefonnummer');
  });

  await knex.schema.createTable(tableNames.coronaInfo, (table) => {
    table.increments().notNullable();
    table.integer('momentane_Inzidenz').notNullable();
    table.integer('maxAnzahlPersonnen_pro_qm');
    table.dateTime('Datum');
  });
};

exports.down = async (knex) => {
  await Promise.all(
    [
      tableNames.raum,
      tableNames.adresse,
      tableNames.kontaktdaten,
      tableNames.coronaInfo,
    ].reverse()
      .map((tableName) => knex.schema.dropTableIfExists(tableName)),
  );
};
