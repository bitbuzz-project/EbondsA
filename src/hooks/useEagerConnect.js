import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { injected, walletconnect } from '../connector';

export function useEagerConnect() {
  const { activate, active } = useWeb3React();
  const [tried, setTried] = useState(false);

  useEffect(() => {
    const connectedWallet = localStorage.getItem('connectedWallet');

    if (connectedWallet === 'METAMASK') {
      injected.isAuthorized().then((isAuthorized) => {
        if (isAuthorized) {
          activate(injected, undefined, true).catch(() => {
            setTried(true);
          });
        } else {
          setTried(true);
        }
      });
    } else if (connectedWallet === 'WALLETCONNECT') {
       // WalletConnect usually persists session, but we need to ensure the connector is active
       activate(walletconnect).catch(() => {
         setTried(true);
       });
    } else {
      setTried(true);
    }
  }, [activate]); // Run once on mount

  // If the connection works, mark as tried
  useEffect(() => {
    if (!tried && active) {
      setTried(true);
    }
  }, [tried, active]);

  return tried;
}