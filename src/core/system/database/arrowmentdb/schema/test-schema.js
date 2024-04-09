import { jsonDB } from "../jsonDB.js";
import { JsonSchema } from "arrowment-db";

const data = {
  Name: String,
  Age: Number,
};

const info = new JsonSchema({ schema: data, json_class: jsonDB, name: "Info" });

export { info };
