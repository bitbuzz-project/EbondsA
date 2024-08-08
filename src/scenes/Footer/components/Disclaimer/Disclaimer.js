import classes from './Disclaimer.module.scss';

const Disclaimer = () => {


    return (<div className={classes.Disclaimer}>
        <h5>Disclaimer</h5>

        <h6>No Advice</h6>
        <p>
            The information on this Site is provided for information only and does not constitute, 
            and should not be construed as, investment advice or a recommendation to buy, sell, or 
            otherwise transact in any investment including any products or services or an invitation, offer 
            or solicitation to engage in any investment activity.
        </p>
        <p>
            The information on this Site is provided solely on the basis that you will make your own 
            investment decisions and PEAKDEFI does not take account of any investor’s investment objectives, 
            particular needs, or financial situation. In addition, nothing on this Site shall, or is intended 
            to, constitute financial, legal, accounting or tax advice.
        </p>
        <p>
            It is strongly recommended that you seek professional investment advice before making 
            any investment decision. Any investment decision that you make should be based on an assessment
             of your risks in consultation with your investment adviser.
        </p>

        <h6>Risk Warnings</h6>
        <p>
            There are significant risks associated with an investment in any products or services 
            provided by PEAKDEFI. Investment in the products and services is intended only for those 
            investors who can accept the risks associated with such an investment (including the risk 
            of a complete loss of investment) and you should ensure you have fully understood such risks before
             taking any decision to invest.
        </p>
        <p>
            Past performance does not guarantee future performance and the value of investments can fall as 
            well as rise. No investment strategy is without risk and markets influence investment performance. 
            Investment markets and conditions can change rapidly. Strategies or products can lose money as 
            well as gain. All investors should consider investing only if they can accept the risks associated 
            with investing including a loss of invested capital. No investor should invest without a thorough 
            reading of the risk factors associated with each investment strategy in official documentation 
            provided for each fund or strategy. Investors with questions should additionally seek independent 
            investment advice tailored to their needs, circumstances, and risk tolerances.
        </p>
    </div>);
}
 
export default Disclaimer;