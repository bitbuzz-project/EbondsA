import React, { useState } from "react";
import classes from "./Info.module.scss";

function Tab(props) {
  return (
    <div className={classes.tab}>
      <div className={classes.leftCorner}>
        <img src={props.img} alt="" />
      </div>
      <div className={classes.rightCorner}>
        <h3>{props.contentTitle}</h3>
        <div dangerouslySetInnerHTML={{__html:props.text}}/>
      </div>
    </div>
  );
}

const Info = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabsData = [
    {
      tabTitle: "Liquidity Mining",
      contentTitle: "ETH/BTC/USDC/PAXG Liquidity Mining",
      text: "<p className={classes.leftText}>Exposure in V3 Concentrated Liquidity should start with a mixed allocation of 50% USDC / 50% ETH / WBTC and 25% USDC / 75% PAXG allocation, however, changes at a rapid pace as it approaches extremes of the price range. It is noteworthy that providing liquidity on V3 pools generally entails lower impermanent loss compared to V2, while offering the potential for much greater fee rewards while in range.</p>",
      img: "",
    },
    {
      tabTitle: "ETH Liquid Staking",
      contentTitle: "ETH Liquid Staking",
      text: "<p className={classes.leftText}>We will allocate 10% of the EBONDS allocation to Ethereum staking</p>",
      img: "image-url-2",
    },
    {
      tabTitle: "AltCoin Liquidity",
      contentTitle: "AltCoin Liquidity Mining/ Spot",
    text: `<ul className={classes.leftText}>
    <li>12% GMX-USDC: Decentralized exchange; Innovative technology; Strong development team; Growing adoption; etc...</li>
    <li>12% FTM-USDC LP: Innovative technology; Strong development team; Growing adoption; etc...</li>
    <li>12% LINK-USDC LP: Innovative technology; Strong development team; Growing adoption; etc...</li>
    <li>12% ARB-USDC LP: Layer 2 enhanced scaling solution, Lower transaction fees, Innovative technology; Strong development team; Growing adoption; Strong VC backing, etc...</li>
    <li>12% GNS-USDC LP: Decentralized exchange; Innovative technology; Strong development team; Growing adoption; etc...</li>
    <li>12% MATIC-USDC LP: Scalable blockchain infrastructure; Layer 2 scaling solution; Strong development team; Growing adoption; >92% supply in circulation, etc...</li>
    <li>28% OTHERS: Diversification; High beta; Narratives; Airdrops, Presales, etc...</li></ul>`,
      img: "image-url-3",
    },
    {
      tabTitle: "Dynamic Hedging",
      contentTitle: "Dynamic Hedging and Funding Rate Interest",
      text: `<ul>
      <li>Partial/ full hedge level to level</li>
      <li>Liquidity Levels Scaling in/out</li>
      <li>Regular rebalancing 50% USDC/ 50% BTC</li>
      <li>Funding Rate Interest/Carry Interest</li>
      <li>Scaling in below pivot levels, scaling out above pivot levels</li></ul>`,
      img: "image-url-3",
    },
  ];

  const handleTabClick = (index) => {
    setActiveTab(index);
  };
 
  return (

    <div className={classes.Info}>
          <div className={classes.titleBlock}>Unlocking Growth: The Power of <span>Collateralized Investments</span></div>

      <div className={classes.tabs}>
        
        {tabsData.map((data, index) => (
          <div
            key={index}
            className={`${classes.tabItem} ${
              activeTab === index ? classes.active : ""
            }`}
            onClick={() => handleTabClick(index)}
          >
            {data.tabTitle}
          </div>
        ))}
      </div>

      <div className={classes.tabContent}>
        <Tab {...tabsData[activeTab]} />
      </div>
    </div>
  );
};

export default Info;
