import { Client } from "discord.js";
import { token } from "./src/config.js";
import { MessageHandler } from "./src/handlers.js";

const client = new Client();
let mh;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (msg) => {
  const channel = msg.channel;
  if (!mh) mh = new MessageHandler(channel);

  const msgArr = msg.content.split(" ");
  const isValidCommand = msg.content[0] == "$";
  const command = msgArr[0];

  msgArr.shift();
  if (isValidCommand) {
    mh.handleMessage(command, msgArr);
  }
});

client.login(token);
