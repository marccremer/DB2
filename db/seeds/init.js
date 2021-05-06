const tableNames = require('../../src/tableNames')
/**
 * @param {import('knex')} knex
 */
exports.seed = async (knex) => {
  // Deletes ALL existing entries
  await Promise.all(Object.values(tableNames).map((name) => knex(name).del()));

};
