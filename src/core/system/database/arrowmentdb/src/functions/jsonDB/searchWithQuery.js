const fs = require("fs");
const { findClosestString } = require("../findClosestString.js");

/**
 * Searches for JSON files in a directory based on a search query.
 *
 * @param {object} search_query - The search query object.
 * @param {object} json_class - The JSON class object.
 * @param {string} name - The name of the directory to search.
 * @param {boolean} approximateSearch - Flag to enable approximate search.
 * @param {object} schema - The schema used for creating the data
 */
async function searchWithQuery(
  search_query,
  json_class,
  name,
  approximateSearch
) {
  if (typeof search_query !== "object") {
    throw new TypeError(
      `Search Query must be an object, and not an ${typeof search_query}`
    );
  }

  let emptyArray = [];
  let pathArray = [];
  const searchDirectory = `${json_class.save_folder}/${name}`;

  if (fs.existsSync(searchDirectory)) {
    const files = await fs.promises.readdir(searchDirectory);

    await Promise.all(
      files.map(async (file) => {
        if (file.endsWith(".json")) {
          const filePath = `${searchDirectory}/${file}`;
          const fileData = await fs.promises.readFile(filePath);
          try {
            let jsonData = JSON.parse(fileData);

            for (const key in search_query) {
              if (search_query.hasOwnProperty(key)) {
                if (!(key in jsonData)) {
                  throw new TypeError(
                    `Search Query '${search_query[key]}' does not exist in ${filePath}`
                  );
                } else {
                  let matches;

                  if (approximateSearch) {
                    const closest = findClosestString(
                      search_query[key],
                      jsonData[key]
                    );
                    matches = closest.score > 0.45;
                  } else {
                    matches =
                      JSON.stringify(jsonData[key]) ===
                      JSON.stringify(search_query[key]);
                  }

                  if (!matches) {
                    return null;
                  }
                }
              }
            }

            const isDuplicate = emptyArray.some(
              (existingData) =>
                JSON.stringify(existingData) === JSON.stringify(jsonData)
            );

            if (!isDuplicate) {
              emptyArray.push(jsonData);
              pathArray.push(filePath);
            }
          } catch (err) {
            throw new Error(err);
          }
        }
      })
    );

    return { jsonFilesArray: emptyArray, pathArray: pathArray };
  } else {
    return { jsonFilesArray: emptyArray, pathArray: pathArray };
  }
}

module.exports = { searchWithQuery };
