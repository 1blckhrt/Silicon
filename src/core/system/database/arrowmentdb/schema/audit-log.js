const { jsonDB } = require("../jsonDB.js");
const { JsonSchema } = require("../src/classes/JsonSchema");

const data = {
  auditLogChannel: String,
};

const auditLogSchema = new JsonSchema({
  schema: data,
  json_class: jsonDB,
  name: "AuditLogChannel",
});

module.exports = { auditLogSchema };
