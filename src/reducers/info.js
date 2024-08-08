import { LOCATION_CHANGE } from 'connected-react-router';

async function  info(){
    let plist = require('plist');

        try {
            const { default: src } = await import(/* webpackMode: "lazy" */ `../source/shema`);
            let json = await plist.parse(src)
            return json
          } catch (err) {
            this.setState({ err: err.toString() });
          }
} 

const initialState =  info()

const infoReducer = (state = initialState, action) => {
    switch (action.type) {


        case LOCATION_CHANGE:
            return initialState;

        default:
            return state;
    }
};

export default infoReducer;