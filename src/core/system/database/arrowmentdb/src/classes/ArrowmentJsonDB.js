const {
  generateRandomString,
} = require("../functions/generateRandomString.js");

/**
 * A database class for PersonaDB.
 *
 * @param {Object} options - The options used to create the PersonaDB instance.
 * @param {String} options.data_dir - The directory where the data will be saved.
 * @param {Function} [options.string_generator] - A function used to generate random strings.
 * @throws {TypeError} If the `string_generator` option is provided but is not a function.
 */
class ArrowmentJsonDB {
  /**
   * Creates a new PersonaDB instance.
   * @param {Object} options - The options used to create the PersonaDB instance.
   * @param {String} options.data_dir - The directory where the data will be saved.
   * @param {Function} [options.string_generator] - A function used to generate random strings.
   */
  constructor({ data_dir, string_generator }) {
    /**
     * The directory where the data will be saved.
     * @type {String}
     */
    this.save_folder = data_dir;

    /**
     * A function used to generate random strings.
     * @type {Function}
     */
    this.string_generator = string_generator || this.getRandomString.bind(this);

    if (typeof this.string_generator !== "function") {
      throw new TypeError("String Generator must be a function");
    }
  }

  /**
   * Generates a random string.
   * @param {Number} [length=10] - The length of the string.
   * @returns {String} The random string.
   */
  getRandomString(length = 10) {
    return generateRandomString(length);
  }
}

module.exports = { ArrowmentJsonDB };
