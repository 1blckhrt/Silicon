const { findClosestString } = require("../findClosestString.js");

/**
 *
 * @param {object} mainDataObject The main data object in which the data will be stored
 * @param {any} key The name of the data
 * @returns
 */
function fuzzy(mainDataObject, key) {
  const keysInMainDataObject = Object.keys(mainDataObject.availableData); //Get the array of all the keys in availableData

  let results = findClosestString(key, keysInMainDataObject); //Find the closest key in keysInMainDataObject

  //If no results then return null else set key to results.closestString
  if (!results) return null;
  else {
    if (results.score > 0.45) return results.closestItem;
    else return null;
  }
}

module.exports = { fuzzy };
