import classes from './TierPage.module.scss'

import Soil from './resources/soil.svg';
import Seed from './resources/seed.svg';
import Sapling from './resources/sapling.svg';
import Tree from './resources/tree.svg';
import Oak from './resources/oak.svg';
import { useState } from 'react';

const TierPage = () => {

    const [tiers, setTiers] = useState([
        {
            text: 'Tier 1',
            image: Soil,
            value: 10000,
            pool_weight: 4
        },

        {
            text: 'Tier 2',
            image: Seed,
            value: 50000,
            pool_weight: 10
        },

        {
            text: 'Tier 3',
            image: Sapling,
            value: 100000,
            pool_weight: 20
        },

        {
            text: 'Tier 4',
            image: Tree,
            value: 250000,
            pool_weight: 38
        },

        {
            text: 'Tier 5',
            image: Oak,
            value: 1000000, 
            pool_weight: 70 
        }
    ])

    return (<div className={classes.TierPage}>
        <header>
            <h1>Tier system</h1>
            <p>5 tier levels with guaranteed token allocations</p>
        </header>
        <main>

            <section>
                <p>
                    As we at PEAKDEFI Launchpad stand for fair project launches, we 
                    created a tier system that enables everyone to get the right portion 
                    of each pools’ allocation.
                </p>
            </section>

            <section>
                <div className={classes.tierTableWrapper}>
                    <div className={classes.tierTable}>
                        <h1>Our Tier System</h1>
                        <table>
                            <tr>
                                <th className={classes.picth}>Tier</th>
                                <th>PEAK tokens staking amount</th>
                                <th>Pool Weight</th>
                            </tr>
                            {
                                tiers.map(tier => {
                                    return (<tr>
                                        <td className={classes.pictd}>
                                            <div className={classes.tierName}>
                                                <img src={tier.image} />
                                                <p>{tier.text}</p>
                                            </div>
                                        </td>
                                        <td>
                                            {tier.value}
                                        </td>
                                        <td>
                                            {tier.pool_weight}
                                        </td>
                                    </tr>)
                                })
                            }
                        </table>
                    </div>
                </div>


                <p>
                    Our tier system covers 5 different tiers in total. We have four (tier 1 to tier 4) 
                    public sale tiers and one private sale tier (tier 5). The private sale tier offers 
                    our investors a reduced token price, but also other vesting conditions compared to 
                    the public sales tiers. 
                </p>
                <p>
                    Once an IDO pool is opened, the pool stays open until all tickets are sold out 
                    or the pool reaches the time limit. If an allocation gets not sold out, the remaining 
                    tokens will be split between all other tiers according to their pool weights. 
                </p>
            </section>


        </main>
    </div>);
}

export default TierPage;