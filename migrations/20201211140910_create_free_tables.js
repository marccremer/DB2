const tableNames = require('../src/tableNames');
const { idprime } = require('../src/tableUtils');

/**
 * @param {import('knex')} knex
 */

exports.up = async (knex) => {
  
  await knex.schema.createTable(tableNames.raum, (table) => {
    table.increments().notNullable();
    table.string('Name', 40).notNullable();
    table.boolean('Ausenbereich')
    table.float('Fläche in m2').notNullable()
  });

  await knex.schema.createTable(tableNames.adresse, (table) => {
    table.increments().notNullable();
  });

  await knex.schema.createTable(tableNames.kundentyp, (table) => {
    table.increments().notNullable();
    table.boolean('hatReserviert').notNullable()
  });

  await knex.schema.createTable(tableNames.coronaInfo, (table) => {
    table.increments().notNullable();
    table.integer('momentane Inzidenz')
    table.integer('maxAnzahlPersonnen pro qm')
    table.dateTime('Datum')
  }); 
  
};

exports.down = async (knex) => {
  await Promise.all(
    [
      tableNames.raum,
      tableNames.adresse,
      tableNames.kundentyp,
    ].map((tableName) => knex.schema.dropTableIfExists(tableName))
  );
};
