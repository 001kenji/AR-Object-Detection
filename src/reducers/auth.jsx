import {
ToogleTheme,
PageToogleReducer,

}from '../actions/types'


const date = new Date()
const initialState = {
    Theme : 'dark',
    Page : '',
   

};
//console.log(min)
// the function bellow can be imported from any file using any name since we have exported it as default and we have not assigned a name to it

export default function (state = initialState, action) {

  
    const { type, payload} = action;
        // {<Notifier   />}
       
    const currentTime = new Date();
        const minutesToAdd = 1;
        const newTime = new Date(currentTime);
        newTime.setMinutes(currentTime.getMinutes() + minutesToAdd);

        //console.log('fired')
    switch (type) {
        case ToogleTheme:
            return {
                ...state,
                Theme : payload
            }
        case PageToogleReducer:
            return {
                ...state,
                Page : payload
            }
       
        default:
            return state
    }

   
}