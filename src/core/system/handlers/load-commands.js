const { loadFiles } = require("../../functions/file-loader.js");

async function loadCommands(client) {
  await client.commands.clear();

  const files = await loadFiles("src/commands");

  const commandsArray = [];

  //Promising all the files and looping through them and pushing them to commandsArray.
  await Promise.all(
    files.map(async (file) => {
      const command = require(file);
      try {
        //Setting the command to the commandArray and setting it to client.commands
        commandsArray.push(command.data.toJSON());
        client.commands.set(command.data.name, command);
      } catch (err) {
        console.log(err);
      }
    })
  );

  return commandsArray;
}

module.exports = loadCommands;
