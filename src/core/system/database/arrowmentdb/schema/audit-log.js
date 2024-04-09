import { jsonDB } from "../jsonDB.js";
import { JsonSchema } from "arrowment-db";

const data = {
  auditLogChannel: String,
};

const auditLogSchema = new JsonSchema({
  schema: data,
  json_class: jsonDB,
  name: "AuditLogChannel",
});

export { auditLogSchema };
