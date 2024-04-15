const {
  generateRandomString,
} = require("../functions/generateRandomString.js");
const { primary } = require("../functions/quickCollection/primary.js");

class QuickCollection {
  /**
   *
   * @param {boolean} include_default_parameters
   */
  constructor(include_default_parameters = true) {
    this.data = { availableData: {} };

    if (include_default_parameters) {
      this.data.created = Date.now();
      this.data.lastUpdated = "Not Updated Yet";
      this.data.id = generateRandomString(12);
    }
  }

  /**
   primary()
   * 1 = Add
   * 2 = Delete
   * 3 = Update
   * 4 = Find
   * 5 = Duplicate
   * 6 = FuzzyDelete
   * 7 = FuzzyUpdate
   * 8 = FuzzyFind
   * 9 = FuzzyDuplicate
   */

  /**
   * Adds an parameter and its data to the data collection
   * @param {any} data The data to add
   * @param {any} key The name of the data
   * @returns
   */
  add(key, data) {
    return primary(1, this.data, key, data);
  }

  /**
   * Deletes an parameter and its data from the data collection
   * @param {any} key The name of the data to delete
   * @returns
   */
  delete(key) {
    return primary(2, this.data, key, undefined);
  }

  /**
   * Updates an parameter and its data from the data collection
   * @param {any} key The name of the data to update
   * @param {any} data The data that will be used to update the data
   */
  update(key, data) {
    return primary(3, this.data, key, data);
  }

  /**
   * Finds the data with the given key/name
   * @param {any} key The name of the data to find
   */
  find(key) {
    return primary(4, this.data, key, undefined);
  }

  /**
   * Duplicate an specific data with the given key/name
   * @param {any} key The name of the data
   * @param {number} count Amount of times the data should be duplicated
   */
  duplicate(key, count) {
    return primary(5, this.data, key, undefined, count);
  }

  /**
   * Delete a specific data with appropriate key/name
   * @param {any} key The approximate name of the data to delete
   * @returns
   */
  fuzzyDelete(key) {
    return primary(6, this.data, key, undefined);
  }

  /**
   * Update a specific data with appropriate key/name
   * @param {any} key The approximate name of the data to update
   * @param {any} data The data that will be used to update the data
   * @returns
   */
  fuzzyUpdate(key, data) {
    return primary(7, this.data, key, data);
  }

  /**
   * Find a specific data with appropriate key/name
   * @param {any} key The approximate name of the data to find
   * @returns
   */
  fuzzyFind(key) {
    return primary(8, this.data, key, undefined);
  }

  /**
   * Duplicate a specific data with appropriate key/name
   * @param {any} key The approximate name of the data to duplicate
   * @returns
   */
  fuzzyDuplicate(key, count) {
    return primary(9, this.data, key, undefined, count);
  }
}

module.exports = { QuickCollection };
