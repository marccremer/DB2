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

    await knex.raw('DROP FUNCTION IF EXISTS Hello')
    await knex.raw('DROP FUNCTION IF EXISTS isEligible')
    await knex.raw('DROP PROCEDURE IF EXISTS rebooking')
    await knex.raw('DROP TRIGGER IF EXISTS reduzierung_plaetze')
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

    

        await knex.raw(

    
          `
          
          DELIMITER // 
          CREATE PROCEDURE rebooking(newDate DATE, bookingID INT)
          BEGIN 
          DECLARE v_date DATE;
          SELECT Datum INTO v_date FROM Reservierung WHERE id = bookingID;
          IF v_date = CURDATE() AND v_date < newDate THEN
              UPDATE Reservierung
              SET Datum  = newDate
              WHERE id = bookingID;
          ELSE 
          SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Umbuchung nur für den Folgetag möglich!';

          
          END IF;    
      
          END // 
          DELIMITER ;
          `
        );

};

exports.down = async (knex) => {
  knex.raw('DROP FUNCTION IF EXISTS Hello')
  knex.raw('DROP FUNCTION IF EXISTS isEligible')
  knex.raw('DROP PROCEDURE IF EXISTS rebooking')
};