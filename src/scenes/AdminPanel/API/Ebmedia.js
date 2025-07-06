import axios from 'axios';
export const API_LINK = 'https://api.geckoterminal.com/api/v2/networks/arbitrum/pools/0x67ac5588bbfbcf0ffe2e24608d9b4e7102345835';

export async function fetchEbPrice() {
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
