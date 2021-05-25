const { references } = require('../../src/tableUtils');
const tableNames = require('../../src/tableNames');

/**
 * @param {import('knex')} knex
 */
exports.up = async (knex) => {
  await knex.schema.createTable(tableNames.begleiter, (table) => {
    references(table, tableNames.kunde);
  });

  await knex.schema.alterTable(tableNames.begleiter, (table) => {
    table.primary(`${tableNames.kunde}_id`);
  });

  await knex.schema.createTable(tableNames.reservierer, (table) => {
    references(table, tableNames.kunde);
    table.integer('Kreditkartennummer');
  });

  await knex.schema.alterTable(tableNames.reservierer, (table) => {
    table.primary(`${tableNames.kunde}_id`);
  });

  await knex.schema.createTable(tableNames.reservierung, (table) => {
    table.increments().notNullable();
    table.datetime('Datumszeit').notNullable();
    table.boolean('deleted').defaultTo(false);
  });

  await knex.schema.createTable(tableNames.gebuchterTisch, (table) => {
    references(table, tableNames.tisch);
    references(table, tableNames.reservierung, true, 'reservierung');
    table.primary('reservierung_id');
  });

  await knex.schema.createTable(tableNames.teilnehmer, (table) => {
    references(table, tableNames.reservierung);
    table.integer(`${tableNames.begleiter}_id`).unsigned()
      .references(`${tableNames.kunde}_id`)
      .inTable(tableNames.begleiter)
      .onDelete('cascade');
    table.integer(`${tableNames.reservierer}_id`).unsigned()
      .references(`${tableNames.kunde}_id`)
      .inTable(tableNames.reservierer)
      .onDelete('cascade');
    table.primary([`${tableNames.reservierer}_id`, `${tableNames.reservierung}_id`]);
  });
};

exports.down = async (knex) => {
  await Promise.all(
    [
      tableNames.begleiter,
      tableNames.reservierer,
      tableNames.reservierung,
      tableNames.gebuchterTisch,
      tableNames.teilnehmer,
    ]
      .reverse()
      .map((tableName) => knex.schema.dropTableIfExists(tableName)),
  );
};
