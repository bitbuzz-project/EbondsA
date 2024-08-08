import axios from 'axios';
export const API_LINK = 'https://api.geckoterminal.com/api/v2/networks/arbitrum/pools/0x67ac5588bbfbcf0ffe2e24608d9b4e7102345835/trades'
// const UNISWAP_API_LINK = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3';
// const ETHEREUM_API_LINK = 'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd';

export function createMediaDetail(idoData, id){
    return axios.post(API_LINK + '/media_detail_create', idoData);
}

export function updateMediaDetail(idoData, id){
    return axios.put(API_LINK + '/media_detail_update/'+id, idoData);
}

export function deleteMediaDetail(id){
    return axios.delete(API_LINK + '/media_detail_delete/'+id);
}



export async function fetchEbPrice() {
    try {
        const response = await axios.get(API_LINK);
        const data = response.data.data;

        if (data.length === 0) {
            throw new Error('No trade data available');
        }

        // Access the 'price_to_in_usd' value from the first trade object
        const priceToInUsd = data[0].attributes.price_to_in_usd;
        const roundedPrice = Number(priceToInUsd).toFixed(4); // Limit decimals to four
        return roundedPrice;
    } catch (error) {
        console.error('Error fetching USDT price:', error);
        throw error;
    }
  }