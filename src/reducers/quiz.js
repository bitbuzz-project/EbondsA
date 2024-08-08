import { LOCATION_CHANGE } from 'connected-react-router';


async function  quiz(){
    let plist = require('plist');

        try {
            const { default: src } = await import(/* webpackMode: "lazy" */ `../source/quiz`);
            let json = await plist.parse(src)
            return json

          } catch (err) {
              
          }
} 

const initialState =  quiz()

const infoReducer = (state = initialState, action) => {
    switch (action.type) {
        // case SEND_CONTACT_QUESTION: {
        //     return state;
        // }

        case LOCATION_CHANGE:
            return initialState;

        default:
            return state;
    }
};

export default infoReducer;