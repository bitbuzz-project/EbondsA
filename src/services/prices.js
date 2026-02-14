import axios from 'axios';
// We import the constants from your existing consts folder
import { API_LINK, LAST_TRADE } from '../consts/api';

// This is the specific pool link from your original Ebmedia.js
const GEKKO_API_LINK = 'https://api.geckoterminal.com/api/v2/networks/arbitrum/pools/0xe7F46aD26d05A8ca94b873c572e870FE09f358b8';

// --- Logic from your original media.js ---
export async function fetchUSDTPrice() {
  try {
    const response = await axios.get(API_LINK);
    const data = response.data.data;

    if (!data || !data.attributes) {
        throw new Error('No data available');
    }

    // Access the 'base_token_price_usd' value
    const baseTokenPriceUsd = data.attributes.base_token_price_usd;
    const roundedPrice = Number(baseTokenPriceUsd).toFixed(4); // Limit decimals to four
    return roundedPrice;
} catch (error) {
    console.error('Error fetching USDT Price:', error);
    return 0; // Return 0 on error to prevent crash
}
}

export async function fetchLast5Prices() {
    try {
      const data = await axios.get(LAST_TRADE);
      const trades = data.data.data;
  
      // Filter out only "buy" orders
      const buyTrades = trades.filter(trade => trade.attributes.kind === 'buy');
  
      // Extract the last 5 "buy" orders
      const last5BuyTrades = buyTrades.slice(0, 5);
  
      // Extract the "price_from_in_usd" from each "buy" order
      const prices = last5BuyTrades.map(trade => trade.attributes.price_to_in_usd);
  
      return prices;
    } catch (error) {
      console.error("Error fetching last 5 prices:", error);
      return [];
    }
}

// --- Logic from your original Ebmedia.js ---
export async function fetchEbPrice() {
    try {
        const response = await axios.get(GEKKO_API_LINK);
        const data = response.data.data;

        if (!data || !data.attributes) {
            throw new Error('No data available');
        }

        // Access the 'base_token_price_usd' value
        const baseTokenPriceUsd = data.attributes.base_token_price_usd;
        const roundedPrice = Number(baseTokenPriceUsd).toFixed(4); // Limit decimals to four
        return roundedPrice;
    } catch (error) {
        console.error('Error fetching EB price:', error);
        return 0; // Return 0 on error to prevent crash
    }
}