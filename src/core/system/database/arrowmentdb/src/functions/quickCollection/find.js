const { fuzzy } = require("./fuzzy.js");

/**
 *
 * @param {any} key The name of the data
 * @param {object} mainDataObject The main data object in which the data will be stored
 * @param {boolean} fuzzySearch Where to Fuzzy search the data or not
 * @returns
 */
function find(key, mainDataObject, fuzzySearch) {
  if (fuzzySearch) {
    const result = fuzzy(mainDataObject, key);
    if (result === null) return result;
    else key = result;
  }

  const data = mainDataObject?.availableData[key]; //Get the data

  if (!data) return null;
  else return data;
}

module.exports = { find };
