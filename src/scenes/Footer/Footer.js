import React from "react";
import classes from './Footer.module.scss';
import Logo from '../../resources/logo_dark.svg';
import UsefulLinks from "./components/UsefulLinks/UsefulLinks";
import MediaLinks from "./components/MediaLinks/MediaLinks";
import Disclaimer from "./components/Disclaimer/Disclaimer";

export function Footer(props) {
  const addTokenToMetamask = () => {
    // Replace these values with your token information
    const tokenAddress = '0x53ee546eb38fb2c8b870f56deeaecf80367a4551';
    const tokenSymbol = 'EBONDS';
    const tokenDecimals = 18;

    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: 'https://ebonds.finance/whitelogo.png',
          },
        },
      });
    } else {
      // Metamask not available, provide user with instructions or alternative
      alert('Metamask not detected. Please make sure you have Metamask installed.');
    }
  };

  const addEsirToMetamask = () => {
    // Replace these values with your token information
    const tokenAddress = '0x8c75a1c86c21b74754fc8e3bc4e7f79b4fcc5a28';
    const tokenSymbol = 'ESIR';
    const tokenDecimals = 18;

    if (window.ethereum && window.ethereum.isMetaMask) {
      window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
            image: 'https://ebonds.finance/ESIR.png',
          },
        },
      });
    } else {
      // Metamask not available, provide user with instructions or alternative
      alert('Metamask not detected. Please make sure you have Metamask installed.');
    }
  };
  return (
    <footer className={classes.Footer}>
      <div className={classes.container}>
        {/* <UsefulLinks /> */}
        <div className={classes.linkContainer}>
          <a href="https://medium.com/@EBONDS.Finance/ebonds-finance-whitepaper-69d5164235ea" className={classes.footerLink}>
            Docs
          </a>
          <a href="#" className={classes.footerLink}>
            Audit
          </a>
          <a href="/terms" className={classes.footerLink}>
            Terms of Use
          </a>
          <a href="#" className={classes.footerLink}>
            Privacy Notice
          </a>
  
        </div>

       
        <div className={classes.mediaLinksContainer}>
        <div className={classes.buttonContainer}>
  <button onClick={addTokenToMetamask} className={classes.footerButton}>
    <div className={classes.buttonContent}>
      <svg
        id="bfbeadc9-83b1-4f6b-b770-b3a2dcde9763"
        data-name="Calque 1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        width="20"
        height="20"
        viewBox="0 0 349.9 463.15"
      >
        {<path class="b1ef4d73-6d94-400b-b3d7-490ae8b1a74a" d="M250.31,18.43c26.25,28.07,54.87,54.48,79.39,84.05,26.89,33.82,31.23,82.63,4.1,117.72-25.38,31-56.13,57.71-83.73,86.73-14.67-16.56-33.43-28.94-33.91-53.22C226.49,222.64,267.57,204,277.51,172c5.2-21.29-15.77-40-27-55.9-29.56,30-60.24,59.13-89.25,89.65-20.19,20.73-28.62,57.16-7,79.79,30.91,33.83,64.26,65.6,96,98.72,30.75-30.75,61.1-61.9,91.85-92.65,18-18.37,37.38-38.55,47.39-62.6,7.49-17.51,6.94-39.43,8.44-58.27,13.24,24.44,26.57,46.28,27,75.22,1.5,42.1-19.47,75.38-47.38,104.71q-63.4,65.76-127.58,130.88-64.21-65.76-128.2-131.91c-25.63-26.81-45.1-57.4-46.6-95.64-1.26-41.24,19.08-74.82,46.75-103.6C159.32,111.78,245,23.79,250.31,18.43Z" transform="translate(-75.05 -18.43)" fill="#fff"/>}
      </svg>
      <span>Add EBONDS to Metamask</span>
    </div>
  </button>
  
  <button onClick={addEsirToMetamask} className={classes.footerButton}>
  <div className={classes.buttonContent}>
  <svg
    id="bfbeadc9-83b1-4f6b-b770-b3a2dcde9763"
    data-name="Calque 1"
    fill="#fff"
    width="22"
    height="22"
    viewBox="0 0 349.9 463.15"
    dangerouslySetInnerHTML={{
      __html: `<defs><style>.cls-1{fill:none;}.cls-2{fill:#fff;}.cls-2,.cls-4,.cls-5,.cls-7{fill-rule:evenodd;}.cls-3{clip-path:url(#clip-path);}.cls-4{opacity:0.22;isolation:isolate;}.cls-5{fill:#fff;}.cls-6{clip-path:url(#clip-path-2);}.cls-7{fill:#fff;}.cls-8{clip-path:url(#clip-path-3);}</style><clipPath id="clip-path" transform="translate(0.01 0.04)"><path class="cls-1" d="M.45,147.75a114.89,114.89,0,0,1,141-122h0c89.74,21.32,143.82-15.5,143.82-15.5s.12,1.41.34,3.9a99.87,99.87,0,0,1-136.77,101.5h0C82.41,89,1.75,162.26,1.75,162.26S1.24,156.52.45,147.75Z"/></clipPath><clipPath id="clip-path-2" transform="translate(0.01 0.04)"><path class="cls-1" d="M.45,265.9a114.89,114.89,0,0,1,141-122h0c89.74,21.33,143.82-15.49,143.82-15.49s.12,1.41.34,3.9A99.85,99.85,0,0,1,148.84,233.8h0C82.41,207.05,1.75,280.41,1.75,280.41S1.24,274.67.45,265.9Z"/></clipPath><clipPath id="clip-path-3" transform="translate(0.01 0.04)"><path class="cls-1" d="M.45,384a114.88,114.88,0,0,1,141-122h0c89.74,21.32,143.82-15.49,143.82-15.49s.12,1.4.34,3.89A99.87,99.87,0,0,1,148.84,352h0C82.42,325.21,1.76,398.56,1.76,398.56S1.24,392.82.45,384Z"/></clipPath></defs><g id="Calque_1-2" data-name="Calque 1"><path class="cls-2" d="M.45,147.75a114.89,114.89,0,0,1,141-122h0c89.74,21.32,143.82-15.5,143.82-15.5s.12,1.41.34,3.9a99.87,99.87,0,0,1-136.77,101.5h0C82.41,89,1.75,162.26,1.75,162.26S1.24,156.52.45,147.75Z" transform="translate(0.01 0.04)"/><g class="cls-3"><path class="cls-4" d="M2.12,185.77A108.13,108.13,0,0,1,146,72.48h0C237.3,105.11,294.21,0,294.21,0s.09,25.57.21,55.87A105.86,105.86,0,0,1,149,154.42h0C82.6,127.67,4.29,206.06,4.29,206.06S3.41,197.79,2.12,185.77Z" transform="translate(0.01 0.04)"/></g><path class="cls-5" d="M.45,265.9a114.89,114.89,0,0,1,141-122h0c89.74,21.33,143.82-15.49,143.82-15.49s.12,1.41.34,3.9A99.85,99.85,0,0,1,148.84,233.8h0C82.41,207.05,1.75,280.41,1.75,280.41S1.24,274.67.45,265.9Z" transform="translate(0.01 0.04)"/><g class="cls-6"><path class="cls-4" d="M2.12,304A108.12,108.12,0,0,1,146,190.63h0c91.29,32.63,148.2-72.49,148.2-72.49s.09,25.58.21,55.88A105.86,105.86,0,0,1,149,272.61h0C82.6,245.86,4.29,324.26,4.29,324.26S3.41,316,2.12,304Z" transform="translate(0.01 0.04)"/></g><path class="cls-7" d="M.45,384a114.88,114.88,0,0,1,141-122h0c89.74,21.32,143.82-15.49,143.82-15.49s.12,1.4.34,3.89A99.87,99.87,0,0,1,148.84,352h0C82.42,325.21,1.76,398.56,1.76,398.56S1.24,392.82.45,384Z" transform="translate(0.01 0.04)"/><g class="cls-8"><path class="cls-4" d="M2.12,422.06A108.13,108.13,0,0,1,146,308.78h0c91.29,32.62,148.2-72.49,148.2-72.49s.09,25.58.21,55.88A105.86,105.86,0,0,1,149,390.75h0C82.6,364,4.29,442.39,4.29,442.39S3.41,434.08,2.12,422.06Z" transform="translate(0.01 0.04)" fill="#fff"/>`
    }}
  />
      <span>Add ESIR to Metamask</span>
    </div>
  </button>
</div>



        </div>
        <div className={classes.separator} />
        <div className={classes.mediaLinksContainer}>
     
          <MediaLinks />
        </div>
        {/* <Disclaimer /> */}
      </div>
    </footer>
  );
}
