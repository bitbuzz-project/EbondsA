import React from "react";
import classes from "./Info.module.scss";
import CheckMark from "../../../../resources/check.svg"; // Replace with the path to your SVG image
import CustomIcon from "../../../../resources/nocheck.svg"; // Replace with the path to your SVG image

const PriceCard = ({ title, features }) => {
  return (
    <div className={classes.priceCard}>
      <div className={classes.title}>{title}</div>
      <hr className={classes.line} />
      <ul className={classes.features}>
        {features.map((feature, index) => (
          <li key={index}>
            {feature.icon === "checkmark" && (
              <img src={CheckMark} alt="Check Mark" className={classes.checkmark} />
            )}
            {feature.icon === "custom" && (
              <img src={CustomIcon} alt="Custom Icon" className={classes.customIcon} />
            )}
            {feature.text}
          </li>
        ))}
      </ul>

    </div>
  );
};

const Info = () => {
  const priceCards = [
    {
      title: "EBONDS Protocols",
      features: [
        { text: "Real yield", icon: "checkmark" },
        { text: "Deflationary model", icon: "checkmark" },
        { text: "Collateral Investment Strategy", icon: "checkmark" },
        { text: "Low Strategy Risk and High Asset Exposure", icon: "checkmark" },
        { text: "High Asset-Backed Tokens", icon: "checkmark" },
        { text: "Positive Flywheel Effect ", icon: "checkmark" },
      ],
    },
    {
      title: "Other Protocols",
      features: [
        { text: "Ponzynomics", icon: "custom" },
        { text: "Inflationary Model", icon: "custom" },
        { text: "Fractional Reserve", icon: "custom" },
        { text: "High Strategy Risk and Low Asset Exposure", icon: "custom" },
        { text: "Low/No Asset-Backed Tokens", icon: "custom" },
        { text: "Price Dilution towards zero", icon: "custom" },
      ],
    },
  ];

  return (
    
    <div className={classes.Info}>
                <div className={classes.titleBlock}><span>Features of EBONDS</span> That We Can Share</div>

      <div className={classes.priceCards}>
        {priceCards.map((card, index) => (
          <PriceCard key={index} title={card.title} features={card.features} />
        ))}
      </div>
    </div>
  );
};

export default Info;
