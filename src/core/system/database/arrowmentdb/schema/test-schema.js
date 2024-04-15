const { jsonDB } = require("../jsonDB.js");
const { JsonSchema } = require("../src/classes/JsonSchema");

const data = {
  Name: String,
  Age: Number,
};

const info = new JsonSchema({ schema: data, json_class: jsonDB, name: "Info" });

module.exports = { info };
