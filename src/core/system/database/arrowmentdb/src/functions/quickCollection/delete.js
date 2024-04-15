const { fuzzy } = require("./fuzzy.js");

/**
 *
 * @param {any} key The name of the data
 * @param {object} mainDataObject The main data object in which the data will be stored
 * @param {boolean} fuzzySearch Whether to fuzzy search or not
 */
function deleteProperty(key, mainDataObject, fuzzySearch) {
  if (fuzzySearch) {
    const result = fuzzy(mainDataObject, key);
    if (result === null) return false;
    else key = result;
  }

  mainDataObject.lastUpdated = Date.now(); //Update the lastUpdated property to current date

  if (!mainDataObject.availableData[key]) {
    return false; //If no data available then return false
  } else delete mainDataObject.availableData[key]; //Delete the data
}

module.exports = { deleteProperty };
