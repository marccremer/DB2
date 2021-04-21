function idprime(table_name, table) {
  table.increments(`${table_name}_id`).notNullable().unique().primary();
}

function references(table, tableName, notNullable = true, columnName = '') {
  const definition = table
    .integer(`${columnName || tableName}_id`)
    .unsigned()
    .references('id')
    .inTable(tableName)
    .onDelete('cascade');

  if (notNullable) {
    definition.notNullable();
  }
  return definition;
}

module.exports = {
  idprime,
  references,
};
