const { createData } = require("./createData.js");
const { validateSchemaAndData } = require("./validateSchemaAndData.js");

/**
 * Creates an instance of a JSON object based on the given data and schema.
 * @param {Object} data - The data used to create the JSON object.
 * @param {Object} schema - The schema used to validate the data and determine the properties of the JSON object.
 * @param {Class} json_class - The class of the JSON object to create.
 * @param {String} name - The name of the JSON object.
 * @throws {Error} If there's an error during schema validation or JSON object creation.
 */
function schemaCreate(data, schema, json_class, name) {
  /**
   * @typedef {Class} json_class
   * @property {string} save_folder - The directory where the data will be saved
   * @property {Function} getRandomString - A function to generate a random string
   */

  try {
    // Validate the schema and data
    validateSchemaAndData(schema, data);
    // Create the JSON object using the given data, schema, class, and name
    createData(data, json_class, name);
  } catch (err) {
    throw new Error(err);
  }

  return data;
}

module.exports = { schemaCreate };
