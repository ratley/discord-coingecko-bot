import { MessageEmbed } from "discord.js";
import CoinGecko from "coingecko-api";

import { PriceChecker } from "./handlers.js";

export const createEmbed = ({
  name,
  description,
  color = "#f44336",
  url = null,
  thumbnail,
  image,
  author,
  rank,
  price,
}) => {
  const embed = new MessageEmbed()
    .setTitle(`**${price}**`)
    .setColor(color)
    .setURL(url)
    .setAuthor(name, thumbnail)
    // .setImage(image)
    .setThumbnail(thumbnail)
    .addFields({ name: "Market Cap", value: `**Rank ${rank}**` })
    .setTimestamp();

  // .setFooter('Some footer text here', 'https://i.imgur.com/wSTFkRM.png');

  return embed;
};
