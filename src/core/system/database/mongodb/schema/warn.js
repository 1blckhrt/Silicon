const mongoose = require("mongoose");

const { Schema } = mongoose;

const warnSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  moderatorId: {
    type: String,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("warns", warnSchema);
