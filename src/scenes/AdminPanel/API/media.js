import axios from 'axios';
import { API_LINK, LAST_TRADE } from '../../../consts/api';

const UNISWAP_API_LINK = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3';
const ETHEREUM_API_LINK = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd';

export function createMediaDetail(idoData, id){
    return axios.post(API_LINK + '/media_detail_create', idoData);
}

export function updateMediaDetail(idoData, id){
    return axios.put(API_LINK + '/media_detail_update/'+id, idoData);
}

export function deleteMediaDetail(id){
    return axios.delete(API_LINK + '/media_detail_delete/'+id);
}



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
    console.error('Error fetching EB price:', error);
    throw error;
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
      console.error("Error fetching data:", error);
      // Handle error as needed
      return [];
    }
  }
  