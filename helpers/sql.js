// that defines a helper function named sqlForPartialUpdate. 
// This function uses to be designed to help create SQL queries for partial updates in a database, 
// it expect two parameters: dataToUpdate(an object with the data to be updated) and jsToSql.
// it checks if there is any data to update, if not it throws an error.
// otherwise, it maps over the keys of the dataToUpdate object and returns an object with the setCols and values properties.


const { BadRequestError } = require("../expressError");

// THIS NEEDS SOME GREAT DOCUMENTATION.

/** Helper for making selective update queries.
 * 
 * 
 * 
 *  
 * 
 * 
 *  
 */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
