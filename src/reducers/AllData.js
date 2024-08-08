import { LOCATION_CHANGE } from 'connected-react-router';

async function getLevelData(){
        let bg = []
        for(let i = 0; i < 20; i++)
        {
            try 
            {
                const { default: src } = await import(/* webpackMode: "lazy" */ `../source/patterns/pattern-${Math.ceil(Math.random()*24)}.png`);
                bg.push(src)
            } catch (err) {
                }
        }
       
        
       return bg
} 

const initialState =  getLevelData()

const infoReducer = (state = initialState, action) => {
    switch (action.type) {

        case LOCATION_CHANGE:
            return initialState;

        default:
            return state;
    }
};

export default infoReducer;