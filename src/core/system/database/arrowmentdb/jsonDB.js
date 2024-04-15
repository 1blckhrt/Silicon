const { ArrowmentJsonDB } = require("./src/classes/ArrowmentJsonDB");

const options = {
  data_dir: `${process.env.JSON_PATH}`,
};

const jsonDB = new ArrowmentJsonDB(options);

module.exports = { jsonDB };
