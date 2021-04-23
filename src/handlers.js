import CoinGecko from "coingecko-api";
import { createEmbed, formatPrice } from "./util.js";

const cg = new CoinGecko();

export class PriceChecker {
  constructor() {
    this.cache = {};
    this.list = [];
  }

  async init() {
    await this.getCoinList();
    console.log("Initialized 😈");
  }

  async getCoinList() {
    this.list = await cg.coins.list();

    return this.list;
  }

  async isSymbol(symbol) {
    const list = await cg.coins.list();
    const coin = list.data.find((coin) => coin.symbol == symbol);

    const fetch = await cg.coins.fetch(coin.id);

    if (fetch.success === true) {
      if (!(symbol in this.cache)) {
        this.cache[symbol] = {};
        this.cache[symbol].fetched = false;
      }
    }

    return fetch.success;
  }

  async handleSymbol(symbol) {
    const data = await this.checkCache(symbol);

    const {
      name,
      description,
      market_cap_rank,
      image,
      market_data: {
        current_price,
        price_change_percentage_1h_in_currency,
        price_change_percentage_24h,
        price_change_percentage_7d,
        price_change_percentage_14d,
        price_change_percentage_30d,
      },
    } = data;

    const embedInfo = {
      name: name,
      description: description.en.split("\r\n")[0],
      rank: market_cap_rank,
      thumbnail: image.thumb,
      image: image.small,
      price: `$${formatPrice(current_price.usd)}`,
      pricePercent1h: price_change_percentage_1h_in_currency.usd,
      pricePercent24h: price_change_percentage_24h,
      pricePercent7d: price_change_percentage_7d,
      pricePercent14d: price_change_percentage_14d,
      pricePercent30d: price_change_percentage_30d,
    };
    const embed = createEmbed(embedInfo);

    return embed;
  }

  async getPrice(coin) {
    const isSymbol = await this.isSymbol(coin);
    let embed = new MessageEmbed().addFields({
      name: `Hmm...`,
      value: `Unable to find **$${coin
        .toString()
        .toUpperCase()}** on Coingecko`,
    });
    if (isSymbol) {
      return this.handleSymbol(coin);
    }

    return embed;
  }

  async checkCache(symbol) {
    const time = new Date().getTime();
    let data;

    let cache = this.cache[symbol];

    if (cache.fetched) {
      if (time - cache.time < 10000) {
        data = cache.data;
      } else {
        const coin = await this.fetchCoin(symbol);
        data = coin.data;

        this.cache[symbol].data = coin.data;
        this.cache[symbol].time = time;
        this.cache[symbol].fetched = true;
      }
    } else {
      const coin = await this.fetchCoin(symbol);
      data = coin.data;

      this.cache[symbol].fetched = true;
      this.cache[symbol].data = coin.data;
      this.cache[symbol].time = time;
    }

    return data;
  }

  async fetchCoin(symbol) {
    let list;
    let coin;
    let coinData = this.cache[symbol];

    if (this.cache[symbol].fetched === false) {
      list = await cg.coins.list();
      coin = list.data.find((coin) => coin.symbol == symbol);
      coinData = await cg.coins.fetch(coin.id, {
        localization: false,
      });
    }

    return coinData;
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
