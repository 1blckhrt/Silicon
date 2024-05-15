const { model, Schema } = require("mongoose");

let ticketSetupSchema = new Schema({
  guildID: {
    type: String,
  },
  ticketChannelID: {
    type: String,
  },
  parentID: {
    type: String,
  },
  ticketStaffRoleID: {
    type: String,
  },
});

module.exports = model("ticketSetup", ticketSetupSchema);
