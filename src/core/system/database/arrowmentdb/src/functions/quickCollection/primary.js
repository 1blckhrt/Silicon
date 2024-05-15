const { addAndUpdate } = require("./addAndUpdate.js");
const { deleteProperty } = require("./delete.js");
const { duplicate } = require("./duplicate.js");
const { find } = require("./find.js");

/**
 * A primary function for all the actions for QuickCollection.
 * @param {number} action - Action to perform (1 = add, 2 = delete, 3 = update, 4 = find, etc.).
 * @param {object} data - The data object which will contain all the data and properties.
 * @param {any} key - The name of the property to run actions on.
 * @param {any} providedData - If the action requires data from the user, provide a data object.
 * @param {number} count - The number of times to perform the action (used for duplication).
 */
function primary(action, data, key, providedData, count) {
  if (typeof action !== "number")
    throw new TypeError("Action must be a number");
  if (typeof data !== "object")
    throw new TypeError("QuickCollection.data must be an object");
  if (typeof key === "object")
    throw new TypeError("Key should not be an object/array");
  if (count && typeof count !== "number")
    throw new TypeError("Count must be a number");
  if (!key) throw new TypeError("Key should not be empty");

  switch (action) {
    case 1:
      return addAndUpdate(providedData, data, key, false, false);
    case 2:
      return deleteProperty(key, data, false);
    case 3:
      return addAndUpdate(providedData, data, key, true, false);
    case 4:
      return find(key, data, false);
    case 5:
      for (let i = 0; i < count; i++) {
        duplicate(key, data, false);
      }
      break;
    case 6:
      return deleteProperty(key, data, true);
    case 7:
      return addAndUpdate(providedData, data, key, true, true);
    case 8:
      return find(key, data, true);
    case 9:
      for (let i = 0; i < count; i++) {
        duplicate(key, data, true);
      }
      break;
    default:
      throw new TypeError("Action must be 1, 2, 3, 4, 5, 6, 7, 8, or 9");
  }
}

module.exports = { primary };
