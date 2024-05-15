const { createJson } = require("./createJson.js");
const fs = require("fs");

/**
 * Creates a new data file in the given directory with the given name.
 * If the directory does not exist, it will be created.
 *
 * @param {Object} data - The data to be saved
 * @param {JsonClass} json_class - The JsonClass instance used for generating the file name
 * @param {string} name - The name of the file to be created
 * @throws {TypeError} If the data directory specified by `json_class.save_folder` does not exist
 */
function createData(data, json_class, name) {
  /**
   * @typedef {Object} JsonClass
   * @property {string} save_folder - The directory where the data will be saved
   * @property {Function} getRandomString - A function to generate a random string
   */

  const mainPath = json_class.save_folder;
  const schemaPath = `${json_class.save_folder}/${name}`;

  if (fs.existsSync(mainPath)) {
    if (fs.existsSync(schemaPath)) {
      createJson(data, schemaPath, json_class.getRandomString);
    } else {
      fs.mkdir(schemaPath, { recursive: true }, (err) => {
        if (err) throw err;
        createJson(data, schemaPath, json_class.getRandomString);
      });
    }
  } else {
    throw new TypeError(`Data Directory ${mainPath} does not exist`);
  }
}

module.exports = { createData };
