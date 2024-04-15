const fs = require("fs");
const { searchWithQuery } = require("./searchWithQuery.js");

/**
 * Deletes files based on a search query.
 * @param {string} search_query - The search query to find the files to delete.
 * @param {string} json_class - The JSON class to search within.
 * @param {string} name - The name to search for.
 * @param {boolean} all - Indicates whether to delete all matching files or just the first one found.
 * @param {boolean} approximateSearch - Indicates whether to use levenshtein algorithm to search for files.
 * @throws {Error} If an error occurs during file deletion.
 */
async function schemaDelete(
  search_query,
  json_class,
  name,
  all,
  approximateSearch
) {
  /**
   * @typedef {Object} json_class
   * @property {string} save_folder - The directory where the JSON files are stored.
   * @property {Function} getRandomString - A function to generate a random string.
   */

  try {
    // Search for files based on the provided query, class, and name.
    const data = await searchWithQuery(
      search_query,
      json_class,
      name,
      approximateSearch
    );
    const path = data.pathArray;

    if (!path.length) return null;

    // Delete files based on the specified criteria.
    if (all) {
      // Delete all matching files.
      path.forEach((path) => {
        fs.unlink(path, (err) => {
          if (err) throw err; // Throw an error if deletion fails.
        });
      });
    } else {
      // Delete only the first matching file.
      const firstPath = path[0];
      fs.unlink(firstPath, (err) => {
        if (err) throw err; // Throw an error if deletion fails.
      });
    }
  } catch (error) {
    // Rethrow any caught errors.
    throw new Error(error);
  }
}

module.exports = { schemaDelete };
