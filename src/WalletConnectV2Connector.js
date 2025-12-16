import { AbstractConnector } from '@web3-react/abstract-connector';
// CHANGE THIS LINE: Remove the curly braces { } to use Default Import
import EthereumProvider from '@walletconnect/ethereum-provider'; 

export class WalletConnectV2Connector extends AbstractConnector {
  constructor(options) {
    super({ supportedChainIds: options.supportedChainIds });
    this.options = options;
  }

  async activate() {
    try {
      // Initialize the provider
      this.provider = await EthereumProvider.init({
        projectId: this.options.projectId,
        chains: [this.options.mainChainId], // Arbitrum One (42161)
        showQrModal: true,
        rpcMap: this.options.rpcMap
      });

      this.provider.on("chainChanged", (chainId) => this.emitUpdate({ chainId }));
      this.provider.on("accountsChanged", (accounts) => this.emitUpdate({ account: accounts[0] }));
      this.provider.on("disconnect", () => this.emitDeactivate());

      await this.provider.enable();

      return { 
        provider: this.provider, 
        chainId: this.provider.chainId, 
        account: this.provider.accounts[0] 
      };
    } catch (error) {
      console.error("WalletConnect V2 Error:", error);
      throw error;
    }
  }

  async getProvider() {
    return this.provider;
  }

  async getChainId() {
    return this.provider?.chainId;
  }

  async getAccount() {
    return this.provider?.accounts[0];
  }

  deactivate() {
    if (this.provider) {
      this.provider.disconnect();
      this.provider = undefined;
    }
  }
}