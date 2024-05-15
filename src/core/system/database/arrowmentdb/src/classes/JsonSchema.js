const { schemaCreate } = require("../functions/jsonDB/schemaCreate.js");
const { schemaDelete } = require("../functions/jsonDB/schemaDelete.js");
const { schemaFind } = require("../functions/jsonDB/schemaFind.js");
const { schemaSave } = require("../functions/jsonDB/schemaUpdate.js");

/**
 * Represents a schema for validating and manipulating JSON objects.
 */
class JsonSchema {
  /**
   * Creates a new Schema instance.
   * @param {Object} options - The options used to create the Schema instance.
   * @param {Object} options.schema - The schema used to validate the data.
   * @param {String} options.name - The name of the Schema.
   * @param {Class} options.json_class - The class of the JSON object to create.
   */
  constructor({ schema, name, json_class }) {
    /**
     * The schema used to validate the data.
     * @type {Object}
     */
    this.schema = schema;

    /**
     * The name of the Schema.
     * @type {String}
     */
    this.name = name;

    /**
     * The class of the JSON object to create.
     * @type {Class}
     */
    this.json_class = json_class;
  }

  /**
   * Creates an instance of a JSON object based on the given data and schema.
   * @param {Object} data - The data to create the JSON object.
   * @returns {Object} The data used to update files is returned.
   * @throws {Error} If an error occurs during creation.
   */
  async create(data) {
    try {
      return await schemaCreate(data, this.schema, this.json_class, this.name);
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Deletes a JSON object based on the given search query.
   * @param {Object} search_query - The search query used to delete the JSON object.
   * @throws {Error} If an error occurs during deletion.
   */
  async delete(search_query) {
    try {
      return await schemaDelete(
        search_query,
        this.json_class,
        this.name,
        false,
        false
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Deletes all JSON objects matching the given search query.
   * @param {Object} search_query - The search query used to delete all the JSON objects.
   * @throws {Error} If an error occurs during deletion.
   */
  async deleteAll(search_query) {
    try {
      return await schemaDelete(
        search_query,
        this.json_class,
        this.name,
        true,
        false
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Finds JSON objects based on the given search query.
   * @param {Object} search_query - The search query used to find the JSON objects.
   * @returns {Object} data - A string containing the JSON files data, if null then no data was found.
   * @throws {Error} If an error occurs during search.
   */
  async findData(search_query) {
    try {
      return await schemaFind(
        search_query,
        this.json_class,
        this.name,
        false,
        false,
        false
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Finds all JSON objects based on the given search query.
   * @param {Object} search_query - The search query used to find the JSON objects.
   * @returns {Array} data - A array containing all JSON files data, if null then no data was found.
   * @throws {Error} If an error occurs during search.
   */
  async findAllData(search_query) {
    try {
      return await schemaFind(
        search_query,
        this.json_class,
        this.name,
        true,
        false,
        false
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Saves new data to existing JSON objects based on a search query.
   * @param {Object} data - The new data to be saved.
   * @param {Object} query - The search query used to identify the JSON objects to be updated.
   * @returns {Object} Returns the saved data.
   * @throws {Error} If an error occurs during saving.
   */
  async save(data, query) {
    try {
      return await schemaSave(data, query, this.json_class, this.name, false);
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Updates all existing JSON objects matching the given search query with new data.
   * @param {Object} data - The new data to be saved.
   * @param {Object} query - The search query used to identify the JSON objects to be updated.
   * @returns {Object} the data used to update files is returned.
   * @throws {Error} If an error occurs during updating.
   */
  async updateAll(data, query) {
    try {
      return await schemaSave(data, query, this.json_class, this.name, true);
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Finds the path of a data using a search query
   * @param {Object} search_query The search query used to identify the JSON objects to be returned as paths.
   * @returns {String} Returns the path of the first index matching the search query in an array
   * @throws {Error} If an error occurs during path finding.
   */
  async findPath(search_query) {
    try {
      return await schemaFind(
        search_query,
        this.json_class,
        this.name,
        false,
        true
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Finds the path of a data using a search query
   * @param {Object} search_query The search query used to identify the JSON objects to be returned as paths.
   * @returns {Array} Returns an array of path matching the search query in an array
   * @throws {Error} If an error occurs while finding the path.
   */
  async findAllPath(search_query) {
    try {
      return await schemaFind(
        search_query,
        this.json_class,
        this.name,
        true,
        true
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Takes a rough/approximate queries then uses levenshtein algorithm to find the data
   * @param {Object} search_query The search query used to make a rough estimate of the actual query.
   * @returns {Object} The results of the search, if nothing is found then null is returned.
   * @throws {Error} If an error occurs while fuzzy finding the file.
   */
  async fuzzySearchData(search_query) {
    try {
      return await schemaFind(
        search_query,
        this.json_class,
        this.name,
        false,
        false,
        true
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Takes a rough/approximate queries then uses levenshtein algorithm to find the data
   * @param {Object} search_query The search query used to make a rough estimate of the actual query.
   * @returns {Array} The results of the search, if nothing is found then null is returned.
   * @throws {Error} If an error occurs while fuzzy finding the file.
   */
  async fuzzySearchAllData(search_query) {
    try {
      return await schemaFind(
        search_query,
        this.json_class,
        this.name,
        true,
        false,
        true
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Takes a rough/approximate queries then uses levenshtein algorithm to find the path of data
   * @param {Object} search_query The search query used to make a rough estimate of the actual query.
   * @returns {Object} The results of the search, if nothing is found then null is returned.
   * @throws {Error} If an error occurs while fuzzy finding the path of file.
   */
  async fuzzySearchPath(search_query) {
    try {
      return await schemaFind(
        search_query,
        this.json_class,
        this.name,
        false,
        true,
        true
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Takes a rough/approximate queries then uses levenshtein algorithm to find the path of data
   * @param {Object} search_query The search query used to make a rough estimate of the actual query.
   * @returns {Array} The results of the search, if nothing is found then null is returned.
   * @throws {Error} If an error occurs while fuzzy finding the path of file.
   */
  async fuzzySearchAllPath(search_query) {
    try {
      return await schemaFind(
        search_query,
        this.json_class,
        this.name,
        true,
        true,
        true
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Takes a rough/approximate queries then uses levenshtein algorithm to find the path of data and delete it.
   * @param {Object} search_query The search query used to make a rough estimate of the actual query.
   * @throws {Error} If an error occurs while fuzzy finding the path of file and deleting it.
   */
  async fuzzyDelete(search_query) {
    try {
      return await schemaDelete(
        search_query,
        this.json_class,
        this.name,
        false,
        true
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Takes a rough/approximate queries then uses levenshtein algorithm to find the path of data and delete all the data.
   * @param {Object} search_query The search query used to make a rough estimate of the actual query.
   * @throws {Error} If an error occurs while fuzzy finding the path of file and deleting it.
   */
  async fuzzyDeleteAll(search_query) {
    try {
      return await schemaDelete(
        search_query,
        this.json_class,
        this.name,
        true,
        true
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Takes a rough/approximate queries then uses levenshtein algorithm to find the path of data and save the data.
   * @param {Object} data
   * @param {Object} search_query
   * @returns {Object} the data used to update files is returned.
   * @throws {Error} If an error occurs while fuzzy saving the data
   */
  async fuzzySave(data, search_query) {
    try {
      return await schemaSave(
        data,
        search_query,
        this.json_class,
        this.name,
        false,
        true
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Takes a rough/approximate queries then uses levenshtein algorithm to find the path of data and save all the data.
   * @param {Object} data
   * @param {Object} search_query
   * @returns {Object} the data used to update files is returned.
   * @throws {Error} If an error occurs while fuzzy saving the data
   */
  async fuzzyUpdateAll(data, search_query) {
    try {
      return await schemaSave(
        data,
        search_query,
        this.json_class,
        this.name,
        true,
        true
      );
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Takes a data and a count and creates the data {count} times.
   * @param {Object} data The data to be created
   * @param {number=1} count
   * @returns {Object} the data used to update files is returned.
   */
  async createMany(data, count) {
    if (!count) count = 1; //Set the default count to 1
    if (count > 2000) {
      throw new RangeError(
        "Count must be smaller than 2000, Higher than 2000 is not supported because of high cpu usage limit"
      );
    }

    //Loop around and create the data
    for (let i = 0; i < count; i++) {
      return await schemaCreate(data, this.schema, this.json_class, this.name);
    }
  }
}

// Why are you here? Found a bug? Report here https://github.com/Bhargav230m/ArrowmentDB/issues.
module.exports = { JsonSchema };
