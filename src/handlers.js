import CoinGecko from "coingecko-api";
import { createEmbed } from "./util.js";

const cg = new CoinGecko();

export class PriceChecker {
  constructor() {}

  async getCoins() {
    const list = await cg.coins.list();

    const coins = {};

    list.data.map(({ symbol, id, name }) => {
      coins[symbol] = {
        id: id,
        name: name,
      };
    });

    return coins;
  }

  async isSymbol() {
    const fetch = await cd.coins.fetch(arg);
    return fetch.success === false;
  }

  async fetchCoin(symbol) {
    const list = await cg.coins.list();
    const coin = list.data.find((coin) => coin.symbol == symbol);

    const coinData = await cg.coins.fetch(coin.id, {
      localization: false,
      sparkline: true,
    });
    return coinData;
  }

  async getPrice(coin) {
    if (this.isSymbol) {
      return this.handleSymbol(coin);
    } else {
    }
  }

  async handleSymbol(symbol) {
    const { data } = await this.fetchCoin(symbol);

    // console.log(data.description.en.split("\r\n")[0]);
    console.log(data.market_data.current_price.usd);

    const embedInfo = {
      name: data.name,
      description: data.description.en.split("\r\n")[0],
      rank: data.market_cap_rank,
      thumbnail: data.image.thumb,
      image: data.image.small,
      price: `$${data.market_data.current_price.usd}`,
    };
    const embed = createEmbed(embedInfo);

    return embed;
  }
}

export class MessageHandler {
  constructor(channel) {
    this.channel = channel;
    this.pc = new PriceChecker();
  }

  async handleCommand(command, args) {
    switch (command) {
      case "$price":
        const price = await this.pc.getPrice(args[0]);
        console.log("price", price);
        this.channel.send(price);
        return price;
      default:
        return null;
    }
  }

  handleMessage(command, args) {
    return this.handleCommand(command, args);
  }
}
