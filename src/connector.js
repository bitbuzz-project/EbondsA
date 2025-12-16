import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectV2Connector } from './WalletConnectV2Connector'; // Import the file we just made
import { RpcProvider } from './consts/rpc';

export const injected = new InjectedConnector({
  supportedChainIds: [42161], // Arbitrum One
});

// Configure WalletConnect V2
export const walletconnect = new WalletConnectV2Connector({
  supportedChainIds: [42161],
  mainChainId: 42161,
  rpcMap: { 42161: RpcProvider },
  // -----------------------------------------------------------
  // TODO: Replace with your actual Project ID from cloud.reown.com
  projectId: "c07ae9abdbc5b70e77f69348a09bb9c1", 
  // -----------------------------------------------------------
});