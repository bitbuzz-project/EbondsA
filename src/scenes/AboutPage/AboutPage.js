import classes from './AboutPage.module.scss'
import '@uniswap/widgets/dist/fonts.css'
import { SwapWidget } from '@uniswap/widgets'

const theme = {
  primary: '#000',
  secondary: '#666',
  interactive: '#f5f5f5',
  container: '#FFF',
  module: '#E7E7E7',
  accent: '#d39d5d',
  outline: '#343D3A',
  dialog: '#FFF',
  color: '#fff',
  fontFamily: 'Space Grotesk',
  borderRadius: 0.8,
};
// You can also pass a token list as JSON, as long as it matches the schema
const MY_TOKEN_LIST = [
    {
    "name": "EBONDS",
    "address": "0x53ee546eb38fb2c8b870f56deeaecf80367a4551",
    "symbol": "EBONDS",
    "decimals": 18,
    "chainId": 42161,
    "logoURI": "https://ebonds.finance/whitelogo.png"
  },
  {
    "name": "ESIR",
    "address": "0x8C75a1C86C21b74754FC8e3Bc4e7f79B4fCC5a28",
    "symbol": "ESIR",
    "decimals": 18,
    "chainId": 42161,
    "logoURI": "https://ebonds.finance/ESIR.png"
  },
  {
    "name": "Bridged USDC",
    "address": "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8",
    "symbol": "USDC.e",
    "decimals": 6,
    "chainId": 42161,
    "logoURI": "https://arbiscan.io/token/images/centre-usdc_28.png"
  },
  //   {
  //   "name": "Tether USD",
  //   "address": "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  //   "symbol": "USDT",
  //   "decimals": 6,
  //   "chainId": 42161,
  //   "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"
  // },
  // {
  //   "name": "USD Coin",
  //   "address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  //   "symbol": "USDC",
  //   "decimals": 6,
  //   "chainId": 42161,
  //   "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48/logo.png"
  // },
]
// Use the native token of the connected chain as the default input token
const NATIVE = '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8' // Special address for native token

// WBTC as the default output token
const WBTC = '0x53ee546eb38fb2c8b870f56deeaecf80367a4551'

const AboutPage = () => {
    return (<div className={classes.AboutPage}>
        <header>
    
            
        </header>
        <main>
 <div className={classes.Uniswap}>
    <SwapWidget width={460} theme={theme} tokenList={MY_TOKEN_LIST}    defaultInputTokenAddress={NATIVE}
      defaultOutputTokenAddress={WBTC} />
  </div>       

    
        
        </main>
    </div>);
}
 
export default AboutPage;