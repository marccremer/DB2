
/**
 * @param {import('knex')} knex
 */
exports.up = async (knex) => {
  await knex.raw(`create
  function Hello() returns char(36)
    BEGIN
      RETURN 'Hello';
    END;
`)

};

exports.down = async (knex) => {
  await knex.raw('DROP FUNCTION IF EXISTS Hello')
};