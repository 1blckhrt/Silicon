/**
 * Validates the provided data against the given schema.
 * @param {object} schema - The schema object specifying the expected properties and their types.
 * @param {object} data - The data object to be validated.
 * @throws {Error} If any property specified in the schema is missing in the data.
 * @throws {TypeError} If the type of any property in the data does not match the expected type specified in the schema.
 */
function validateSchemaAndData(schema, data) {
  try {
    for (const key in schema) {
      if (schema.hasOwnProperty(key)) {
        // Check if the given data contains the current property
        if (!(key in data)) {
          throw new Error(`Property '${key}' is missing`);
        }
        if (typeof key === "string" && key.toLowerCase() === "id") {
          throw new TypeError(
            `Property '${key}' cannot be named 'id' as we use that property to save custom id's for the files`
          );
        }
        // Check if the type of the given data for the current property matches the expected type
        let type;
        if (schema[key].name.toLowerCase() === "array") type = "object";
        else type = schema[key].name.toLowerCase();
        if (typeof data[key] !== type) {
          throw new TypeError(
            `Type of '${key}' is ${typeof data[key]}, expected ${
              schema[key].name
            }`
          );
        }
      }
    }
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = { validateSchemaAndData };
