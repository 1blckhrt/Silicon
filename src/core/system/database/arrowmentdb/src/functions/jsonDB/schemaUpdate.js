const { searchWithQuery } = require("./searchWithQuery.js");
const fs = require("fs");

/**
 * Saves new data to existing JSON files based on a search query.
 * @param {Object} data - The new data to be saved.
 * @param {Object} query - The search query to find the JSON files to update.
 * @param {Object} json_class - The JSON class.
 * @param {string} name - The name of the folder that contains the files
 * @param {boolean} all - Indicates whether to update all matching files or just the first one found.
 * @param {approximateSearch} approximateSearch - Indicates whether to use levenshtein search to find all matching files
 * @throws {TypeError} If the data is not an object.
 * @throws {Error} If no data is found with the given query or an error occurs during file update.
 */
async function schemaSave(
  data,
  query,
  json_class,
  name,
  all,
  approximateSearch
) {
  try {
    if (typeof data !== "object") {
      throw new TypeError(`Data must be an object, and not an ${typeof data}`);
    }

    const result = await searchWithQuery(
      query,
      json_class,
      name,
      approximateSearch
    );

    let pathResult = result.pathArray;

    if (!pathResult.length) return null;

    if (!all) {
      pathResult = pathResult[0];

      await update(pathResult, data);
    } else {
      for (const path of pathResult) {
        await update(path, data);
      }
    }
  } catch (err) {
    throw new Error(err);
  }

  return data;
}

/**
 * Updates the JSON file at the specified path with new data.
 * @param {string} pathResult - The path to the JSON file to be updated.
 * @param {Object} newData - The new data to be merged with existing data.
 * @throws {Error} If an error occurs during file reading, parsing, or writing.
 */
function update(pathResult, newData) {
  return new Promise((resolve, reject) => {
    fs.readFile(pathResult, "utf8", (err, data) => {
      if (err) {
        return reject(err);
      }

      try {
        const jsonData = JSON.parse(data);
        const keysToRemove = Object.keys(jsonData).filter(
          (key) => key !== "id"
        );
        const filteredData = {};
        keysToRemove.forEach((key) => {
          filteredData[key] = jsonData[key];
        });

        const lastKey = Object.keys(jsonData).find((key) => key === "id");
        const lastValue = jsonData[lastKey];
        const updatedData = { [lastKey]: lastValue, ...newData };

        fs.writeFile(
          pathResult,
          JSON.stringify({ ...filteredData, ...updatedData }, null, 4),
          (err) => {
            if (err) return reject(err);
            resolve();
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  });
}

module.exports = { schemaSave };
