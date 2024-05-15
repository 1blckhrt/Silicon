const { searchWithQuery } = require("./searchWithQuery.js");

/**
 * This function searches for data using a query and returns results based on specified parameters.
 * @param {string} query - The search query.
 * @param {string} json_class - The JSON class to search in.
 * @param {string} name - The name to search for.
 * @param {boolean} all - Flag indicating whether to return all results or just the first one.
 * @param {boolean} path - Flag indicating whether whether to return path or just the data
 * @param {boolean} approximateSearch - Flag indicating whether to use levenshtein algorithm to find data.
 * @returns {string || array} - An string or array containing the search results.
 */
async function schemaFind(
  query,
  json_class,
  name,
  all,
  path,
  approximateSearch
) {
  // Call the searchWithQuery function to get the search results
  const result = await searchWithQuery(
    query,
    json_class,
    name,
    approximateSearch
  );

  // Extract the JSON files array and path array from the search result
  const dataResult = result.jsonFilesArray;
  const pathResult = result.pathArray;

  if (path) {
    if (!pathResult.length) return null;

    if (!all) return pathResult[0];
    else return pathResult;
  } else {
    if (!dataResult.length) return null;

    if (!all) return dataResult[0];
    else return dataResult;
  }
}

module.exports = { schemaFind };
