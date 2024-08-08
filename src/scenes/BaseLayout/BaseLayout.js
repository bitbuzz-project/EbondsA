import React from 'react'
import classes from './BaseLayout.module.scss'
import Header from '../Header/Header.js'
import { Footer } from '../Footer/Footer'
import { Blockpass } from '../Header/Blockpass'
class BaseLayout extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }


    render() {
        return (
            <>
                {/* <Blockpass /> */}
                <div className={classes.BaseLayout}>
                    <Header />
                    <div className={classes.content}>
                        {this.props.children}
                    </div>
                    <Footer />
                </div>
            </>
        )
    }
}

export default BaseLayout