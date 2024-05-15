/**
 * Searches an array of strings or objects for the item that is closest to a given target string,
 * based on the Levenshtein distance.
 *
 * @param {string|object} target - The target string or object containing a string property.
 * @param {Array<string|object>} array - The array of strings or objects to search.
 * @returns {{score: number, closestItem: string|object}} An object containing the score
 *   (between 0 and 1) and the closest string or object to the target string.
 */
function findClosestString(target, array) {
  try {
    let minDistance = Infinity;
    let closestItem = "";

    if (!Array.isArray(array)) array = Array(array);

    const targetString = getStringFromTarget(target);

    array.forEach((item) => {
      const itemString = getStringFromTarget(item);
      const distance = computeLevenshteinDistance(targetString, itemString);
      if (distance < minDistance) {
        minDistance = distance;
        closestItem = item;
      }
    });

    // Normalize the distance to a score between 0 and 1
    const maxLen = Math.max(
      targetString.length,
      array.reduce((max, item) => {
        const itemString = getStringFromTarget(item);
        return Math.max(max, itemString.length);
      }, 0)
    );
    const score = 1 - minDistance / maxLen;

    return { score, closestItem };
  } catch (e) {
    console.error(e);
    throw new Error(
      "An error occurred while computing the distance. Are you trying to give an unsupported type?"
    );
  }
}

/**
 * Helper function to extract a string from either a string, an object, or a nested object containing an array of strings.
 *
 * @param {string|object} target - The target string or object containing a string property.
 * @returns {string} The string extracted from the target.
 */
function getStringFromTarget(target) {
  if (typeof target === "object") {
    // Check if the target is an array of strings
    if (Array.isArray(target)) {
      for (let i = 0; i < target.length; i++) {
        if (typeof target[i] === "string") {
          return target[i];
        }
      }
      throw new Error("No string found in the array.");
    }

    // Check if the target is an object with a string property
    const properties = Object.keys(target);
    for (let i = 0; i < properties.length; i++) {
      const propertyValue = target[properties[i]];
      if (typeof propertyValue === "string") {
        return propertyValue;
      } else if (Array.isArray(propertyValue)) {
        for (let j = 0; j < propertyValue.length; j++) {
          if (typeof propertyValue[j] === "string") {
            return propertyValue[j];
          }
        }
      } else if (typeof propertyValue === "object") {
        const nestedString = getStringFromTarget(propertyValue);
        if (nestedString) {
          return nestedString;
        }
      }
    }
    throw new Error("No string property found in the object.");
  } else if (typeof target === "string") {
    return target;
  } else {
    throw new Error("Invalid target type.");
  }
}

/**
 * Calculates the Levenshtein distance between two strings.
 *
 * @param {string} a - The first string.
 * @param {string} b - The second string.
 * @returns {number} The Levenshtein distance between the two strings.
 */
function computeLevenshteinDistance(a, b) {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];

  let i;
  for (i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  let j;
  for (j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (i = 1; i <= b.length; i++) {
    for (j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // Substitution
          matrix[i][j - 1] + 1, // Insertion
          matrix[i - 1][j] + 1 // Deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

module.exports = { findClosestString };
