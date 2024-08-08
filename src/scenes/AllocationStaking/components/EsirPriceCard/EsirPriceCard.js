import React, { useState, useEffect } from 'react';
import classes from './EsirPriceCard.scss'
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

const EsirPriceCard = ({ totalValueLocked }) => {
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
      <div className={classes.EsirPriceCard}>
        {/* Card 1 - Total Value Locked */}
        <div className={classes.subsection}>
          <div>
            <div className={classes.subsectionTitle}>Total Vasslue Locked</div>
            <div className={classes.subsectionContent}>
              {'$' + numFormatter(totalValueLocked)}
            </div>
          </div>
        </div>

      </div>
    );
  };
  
  export default EsirPriceCard;
  