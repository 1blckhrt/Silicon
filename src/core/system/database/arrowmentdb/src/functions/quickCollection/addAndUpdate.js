const { fuzzy } = require("./fuzzy.js");

/**
 Adds or Updates the specified property from the given object
 * @param {any} data The data required to update/add the property
 * @param {object} mainDataObject The main data object in which the data will be stored
 * @param {any} key The name of the data
 * @param {boolean} update Wheter to update or just add
 * @param {boolean} fuzzySearch Whether to fuzzy search or not
 */
async function addAndUpdate(data, mainDataObject, key, update, fuzzySearch) {
  if (!data) throw new Error("No data was provided");

  if (!update && mainDataObject.availableData[key]) {
    throw new TypeError(
      "Data with key '" +
        key +
        "' already exists, you can use `<Class>.delete()` to delete the data or update it using `<Class>.update()`"
    );
  }

  if (update && fuzzySearch) {
    const result = fuzzy(mainDataObject, key);
    if (result === null) return false;
    else key = result;
  }

  mainDataObject.lastUpdated = Date.now();
  return (mainDataObject.availableData[key] = data);
}

module.exports = { addAndUpdate };
