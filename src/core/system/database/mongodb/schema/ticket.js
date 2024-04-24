const { model, Schema } = require("mongoose");

let ticketSchema = new Schema({
  guildID: {
    type: String,
  },
  channelID: {
    type: String,
  },
  parentID: {
    type: String,
  },
  ticketCreator: {
    type: String,
  },
  ticketClosed: {
    type: Boolean,
  },
});

module.exports = model("ticket", ticketSchema);
