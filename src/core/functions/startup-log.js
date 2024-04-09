import { Listener } from "@sapphire/framework";
import {
  green,
  blue,
  magenta,
  cyan,
  red,
  yellow,
  magentaBright,
  white,
} from "colorette";
import os from "os";
import mongoose from "mongoose";

const dev = true;

class UserEvent extends Listener {
  style = yellow;

  constructor(context, options = {}) {
    super(context, {
      ...options,
      once: true,
    });

    // Initialize container object if not already provided
    if (!this.container) {
      this.container = {};
    }

    // Set the client object in the container
    this.container.client = context.client;
  }

  async run() {
    // Ensure client object is available in the container
    if (!this.container || !this.container.client) {
      console.log("No client was found.");
      return;
    }
    const dbConnected = await this._connectDb();
    this._printBanner(dbConnected);
    this._displayAdvancedConsole();
  }

  /**
   *
   * @returns {Promise<boolean>}
   */
  async _connectDb() {
    const mongoUrl = process.env.MONGO_DB;

    if (!mongoUrl) return false;

    try {
      await mongoose.connect(mongoUrl, {});
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   *
   * @param {boolean} dbConnected Whether or nor the db was connected
   */
  _printBanner(dbConnected) {
    const success = green("+");
    const fail = red("-");

    const llc = dev ? magentaBright : white;
    const blc = dev ? magenta : blue;
    const db = dbConnected
      ? `[${success}] Mongo Connected`
      : `[${fail}] Mongo Not Connected`;

    const line01 = llc(
      String.raw`░██████╗██╗██╗░░░░░██╗░█████╗░░█████╗░███╗░░██╗`
    );
    const line02 = llc(
      String.raw`██╔════╝██║██║░░░░░██║██╔══██╗██╔══██╗████╗░██║`
    );
    const line03 = llc(
      String.raw`╚█████╗░██║██║░░░░░██║██║░░╚═╝██║░░██║██╔██╗██║`
    );
    const line04 = llc(
      String.raw`░╚═══██╗██║██║░░░░░██║██║░░██╗██║░░██║██║╚████║`
    );
    const line05 = llc(
      String.raw`██████╔╝██║███████╗██║╚█████╔╝╚█████╔╝██║░╚███║`
    );
    const line06 = llc(
      String.raw`╚═════╝░╚═╝╚══════╝╚═╝░╚════╝░░╚════╝░╚═╝░░╚══╝`
    );

    // Offset Pad
    const pad = " ".repeat(7);

    console.clear();
    console.log(
      String.raw`
${line01}
${line02}
${line03} ${pad}${blc("1.0.0")}
${line04} ${pad}[${success}] Gateway
${line05} ${pad}${db}
${line06}${
        dev
          ? ` ${pad}${blc("<")}${llc("/")}${blc(">")} ${llc(
              "DEVELOPMENT MODE"
            )}`
          : ""
      }
		`.trim()
    );
  }

  _displayAdvancedConsole() {
    const client = this.container.client;

    const commandCount = client.commands.size;
    const totalMembers = client.guilds.cache.reduce(
      (acc, guild) => acc + guild.memberCount,
      0
    );
    const totalGuilds = client.guilds.cache.size;
    const botVersion = "Discord.js v14.14.1";
    const botOwner = "blckhrt";

    console.log(blue("=================================="));
    console.log(magenta(`Command Count: ${commandCount}`));
    console.log(cyan(`Total Members: ${totalMembers}`));
    console.log(green(`Total Guilds: ${totalGuilds}`));
    console.log(red(`Bot's Launch Time: ${new Date().toLocaleString()}`));
    console.log(blue(`Bot's Version: ${botVersion}`));
    console.log(
      magenta(
        `Storage Used: ${Math.round(
          (os.totalmem() - os.freemem()) / 1024 / 1024
        )} MB`
      )
    );
    console.log(
      cyan(`Total RAM: ${Math.round(os.totalmem() / 1024 / 1024)} MB`)
    );
    console.log(green(`CPU: ${os.cpus()[0].model}`));
    console.log(red(`Bot's Founders: ${botOwner}`));
    console.log(blue("=================================="));
  }
}

export default UserEvent;
