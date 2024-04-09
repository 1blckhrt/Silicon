import { ArrowmentJsonDB } from "arrowment-db";

const jsonDB = new ArrowmentJsonDB({
  data_dir: `${process.env.JSON_PATH}`
});

export { jsonDB };
