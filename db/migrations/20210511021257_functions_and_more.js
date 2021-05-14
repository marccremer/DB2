/**
 * @param {import('knex')} knex
 */
exports.up = async (knex) => {
  await knex.raw('DROP FUNCTION IF EXISTS Hello');
  await knex.raw('DROP FUNCTION IF EXISTS isEligible');
  await knex.raw(
    `create
      function Hello() returns char(36)
        BEGIN
          RETURN 'Hello';
        END;
    `);

  await knex.raw(
    `CREATE FUNCTION isEligible(
      age INTEGER
      )
      RETURNS VARCHAR(20)
      DETERMINISTIC
      BEGIN
      IF age > 18 THEN
      RETURN ("yes");
      ELSE
      RETURN ("No");
      END IF;
      END;`)

};

exports.down = async (knex) => {
  knex.raw('DROP FUNCTION IF EXISTS Hello')
  knex.raw('DROP FUNCTION IF EXISTS isEligible')
};