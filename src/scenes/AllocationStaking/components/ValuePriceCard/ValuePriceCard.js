import React, { useState, useEffect } from 'react';
import classes from './ValuePriceCard.module.scss'
import { fetchUSDTPrice } from '../../../AdminPanel/API/media'
import tvl from './images/tvl.svg'
import priceIco from './images/price.svg'

function numFormatter(num) {
    if(num > 999 && num < 1000000){
        return (num/1000).toFixed(1) + 'K'; // convert to K for number from > 1000 < 1 million 
    }
    else if(num > 1000000 && num < 10**9){
        return (num/1000000).toFixed(1) + 'M'; // convert to M for number from > 1 million 
    }
    else if(num > 10**9){
        return((num/(10**9)).toFixed(2)+'B');
    }
    else if(num < 900){
        return num.toFixed(2); // if value < 1000, nothing to do
    }
}

const ValuePriceCard = ({ totalValueLocked }) => {
    const [price, setPrice] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const arbPrice = await fetchUSDTPrice();
          const eBondPrice = arbPrice;
          setPrice(eBondPrice);
          console.log(await fetchUSDTPrice());
        } catch (error) {
          console.error('Error fetching price:', error);
        }
      };
  
      fetchData();
    }, []);
  
    return (
      <div className={classes.Info}>
        <div className={classes.featureCards}>
          {/* Parent Container for Available Funds and Your Custom Card Title */}
          <div className={`${classes.cardContainer} ${classes.dFlex} ${classes.flexColumn}`}>
            {/* Available Funds Card */}
            <div className={`${classes.card} ${classes.cardWithBorder}`}>
              <div className={`${classes.ms2} ${classes.cDetails}`}>
                <h6 className={classes.mb0}>Available Funds</h6>
              </div>
              <div className={classes.badge}>
                <span className={classes.badgeSpan}>Overall Funds</span>
              </div>
              <div className={classes.mt5}>
                <div className={classes.mt5}>
                  <div className={classes.progress}>
                    <div className={classes.progressBar} style={{ width: '50%' }}></div>
                  </div>
                  <div className={`${classes.cardFooter} ${classes.cardWithBorder}`}>
                    <div className={classes.mt3} style={{ padding: '0 60px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        {/* First group */}
                       
                        
                        {/* Second group */}
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', backgroundColor: '#e0e0e0', borderRadius: '25px', padding: '8px', marginRight: '8px' }}>
              <svg
      id="bfbeadc9-83b1-4f6b-b770-b3a2dcde9763"
      data-name="Calque 1"
  
      width="20"
      height="20"
      viewBox="0 0 349.9 463.15"
      dangerouslySetInnerHTML={{
        __html: `<defs><style>.cls-1{fill:none;}.cls-2{fill:#5b5b5b;}.cls-2,.cls-4,.cls-5,.cls-7{fill-rule:evenodd;}.cls-3{clip-path:url(#clip-path);}.cls-4{opacity:0.22;isolation:isolate;}.cls-5{fill:#474646;}.cls-6{clip-path:url(#clip-path-2);}.cls-7{fill:#303030;}.cls-8{clip-path:url(#clip-path-3);}</style><clipPath id="clip-path" transform="translate(0.01 0.04)"><path class="cls-1" d="M.45,147.75a114.89,114.89,0,0,1,141-122h0c89.74,21.32,143.82-15.5,143.82-15.5s.12,1.41.34,3.9a99.87,99.87,0,0,1-136.77,101.5h0C82.41,89,1.75,162.26,1.75,162.26S1.24,156.52.45,147.75Z"/></clipPath><clipPath id="clip-path-2" transform="translate(0.01 0.04)"><path class="cls-1" d="M.45,265.9a114.89,114.89,0,0,1,141-122h0c89.74,21.33,143.82-15.49,143.82-15.49s.12,1.41.34,3.9A99.85,99.85,0,0,1,148.84,233.8h0C82.41,207.05,1.75,280.41,1.75,280.41S1.24,274.67.45,265.9Z"/></clipPath><clipPath id="clip-path-3" transform="translate(0.01 0.04)"><path class="cls-1" d="M.45,384a114.88,114.88,0,0,1,141-122h0c89.74,21.32,143.82-15.49,143.82-15.49s.12,1.4.34,3.89A99.87,99.87,0,0,1,148.84,352h0C82.42,325.21,1.76,398.56,1.76,398.56S1.24,392.82.45,384Z"/></clipPath></defs><g id="Calque_1-2" data-name="Calque 1"><path class="cls-2" d="M.45,147.75a114.89,114.89,0,0,1,141-122h0c89.74,21.32,143.82-15.5,143.82-15.5s.12,1.41.34,3.9a99.87,99.87,0,0,1-136.77,101.5h0C82.41,89,1.75,162.26,1.75,162.26S1.24,156.52.45,147.75Z" transform="translate(0.01 0.04)"/><g class="cls-3"><path class="cls-4" d="M2.12,185.77A108.13,108.13,0,0,1,146,72.48h0C237.3,105.11,294.21,0,294.21,0s.09,25.57.21,55.87A105.86,105.86,0,0,1,149,154.42h0C82.6,127.67,4.29,206.06,4.29,206.06S3.41,197.79,2.12,185.77Z" transform="translate(0.01 0.04)"/></g><path class="cls-5" d="M.45,265.9a114.89,114.89,0,0,1,141-122h0c89.74,21.33,143.82-15.49,143.82-15.49s.12,1.41.34,3.9A99.85,99.85,0,0,1,148.84,233.8h0C82.41,207.05,1.75,280.41,1.75,280.41S1.24,274.67.45,265.9Z" transform="translate(0.01 0.04)"/><g class="cls-6"><path class="cls-4" d="M2.12,304A108.12,108.12,0,0,1,146,190.63h0c91.29,32.63,148.2-72.49,148.2-72.49s.09,25.58.21,55.88A105.86,105.86,0,0,1,149,272.61h0C82.6,245.86,4.29,324.26,4.29,324.26S3.41,316,2.12,304Z" transform="translate(0.01 0.04)"/></g><path class="cls-7" d="M.45,384a114.88,114.88,0,0,1,141-122h0c89.74,21.32,143.82-15.49,143.82-15.49s.12,1.4.34,3.89A99.87,99.87,0,0,1,148.84,352h0C82.42,325.21,1.76,398.56,1.76,398.56S1.24,392.82.45,384Z" transform="translate(0.01 0.04)"/><g class="cls-8"><path class="cls-4" d="M2.12,422.06A108.13,108.13,0,0,1,146,308.78h0c91.29,32.62,148.2-72.49,148.2-72.49s.09,25.58.21,55.88A105.86,105.86,0,0,1,149,390.75h0C82.6,364,4.29,442.39,4.29,442.39S3.41,434.08,2.12,422.06Z" transform="translate(0.01 0.04)"/>`
      }}
    />
                ESIR
              </span>
                          <span className={classes.tokenfund}>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
  
            {/* Your Custom Card Title */}
            <div className={`${classes.cardsRow}`}>
            <div className={`${classes.blackcard} ${classes.cardWithBorder}`}>
              <div className={`${classes.ms2} ${classes.cDetails}`}>
                <h6 className={classes.mb0}>Real-Time APY</h6>
  
              </div>
              {/* Add any additional elements for the new card header here */}
              {/* Add the body content for the new card here */}
            </div>
            <div className={`${classes.card} ${classes.cardWithBorder} ${classes.cardWithBackground}}`} >
              <div className={`${classes.ms2} ${classes.cDetails}`}>
              <h6 className={classes.mb0}>Total EBONDS Staked</h6>
                <span className={classes.mb2}></span>
              </div>
  
            </div></div>
            <div className={`${classes.card} ${classes.cardWithBorder}`}>
        <div className={`${classes.ms2} ${classes.cDetails}`}>
          <h6 className={classes.mb0}>EBONDS Top allocation</h6>
        </div>
     </div>
        <div>
        
      
      </div>
     
          </div>
  
          {/* History Card (positioned on the right) */}
          <div className={`${classes.card} ${classes.cardWithBorder} ${classes.historyCard}`}>
            <div className={`${classes.dFlex} ${classes.justifyContentBetween}`}>
              <div className={`${classes.dFlex} ${classes.flexRow} ${classes.alignItemsCenter}`}>
                <div className={`${classes.ms2} ${classes.headWithBorder} ${classes.cDetails}`}>
                  <h6 className={classes.mb1}>History</h6>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default ValuePriceCard;
  