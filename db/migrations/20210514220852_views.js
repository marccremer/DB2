const viewNames = {
  sampleview: "someview"
}
const tableNames = require('../../src/tableNames');

/**
 * @param {import('knex')} knex
 */
exports.up = async (knex) => {
  let term = 'M'
  const selectstatement = await knex(tableNames.kunde)
    .where('name', 'like', `M%`).toSQL()
  console.log(selectstatement);
  await knex.raw(`create view ${viewNames.sampleview} as ${selectstatement.sql}`, selectstatement.bindings)
};

exports.down = async (knex) => {
  await Promise.all(
   Object.values(viewNames)
    .map((viewName) => knex.raw(`drop view ${viewName}`))
  );
};