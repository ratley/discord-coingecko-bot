import { MessageEmbed } from "discord.js";
import CoinGecko from "coingecko-api";

import { PriceChecker } from "./handlers.js";

export const formatPrice = (price) => {
  const str = price.toString();
  const fixed = price.toFixed(20).replace(/\.?0+$/, "");
  return str.includes("e") ? fixed : price;
};

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
  pricePercent1h,
  pricePercent24h,
  pricePercent7d,
  pricePercent14d,
  pricePercent30d,
}) => {
  const embed = new MessageEmbed()
    .setColor(color)
    .setURL(url)
    .setAuthor(name, thumbnail)
    .setThumbnail(thumbnail)
    .addFields(
      {
        name: `**Price**`,
        value: price,
      },
      {
        name: "**1H**",
        value: `${Number(pricePercent1h).toFixed(2)}%`,
        inline: true,
      },
      {
        name: "**1D**",
        value: `${Number(pricePercent24h).toFixed(2)}%`,
        inline: true,
      },
      {
        name: "**7D**",
        value: `${Number(pricePercent7d).toFixed(2)}%`,
        inline: true,
      },
      { name: "**Market Cap**", value: `Rank ${rank}` }
    )
    .setTimestamp()
    .setFooter(
      "Powered by Coingecko",
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fquiin.s3.us-east-1.amazonaws.com%2Forganizations%2Fpictures%2F000%2F004%2F638%2Foriginal%2FCoinGecko_Logo.png%3F1585529895&f=1&nofb=1"
    );

  return embed;
};
