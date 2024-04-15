const fs = require("fs");

/**
 * Creates a JSON file with the given schema and saves it to the given schema path.
 * @param {Object} schema - The JSON schema to be saved as a JSON file.
 * @param {String} schemaPath - The path where the JSON file should be saved.
 * @param {Function} getRandomString - A function that returns a random string.
 * @throws {Error} Throws an error if there is a error while writing data to the JSON file.
 */
function createJson(schema, schemaPath, getRandomString) {
  /**
   * @typedef {Function} getRandomString
   * @param {Number} length - The length of the random string to be generated.
   * @returns {String} A randomly generated string of the specified length.
   */

  const randomId = getRandomString(10);

  schema.id = randomId;

  const json_data = JSON.stringify(schema, null, 4);
  const creationPath = schemaPath + "/" + randomId + ".json";

  // Write the JSON string to the file
  fs.writeFile(creationPath, json_data, (err) => {
    if (err) throw err;
    else return;
  });
}

module.exports = { createJson };
