import { ADD_TO_CART,REMOVE_ITEM,SUB_QUANTITY,ADD_QUANTITY,ADD_SHIPPING } from '../actions/action-types/cart-actions'
import Item1 from '../../images/keyboard.jpeg'
import Item2 from '../../images/hushme.jpeg'
import Item3 from '../../images/iphone4.jpeg'
import Item4 from '../../images/manu-hoodie.jpeg'
import Item5 from '../../images/amazon-echo.jpg'
import Item6 from '../../images/g502.jpg'
import Item7 from '../../images/lg-tv.jpg'
import Item8 from '../../images/pink-watch.jpg'
import Item9 from '../../images/rangefinder.jpg'


// Dummy Data for use / change
export const initState = {
    items: [
        {id:1,title:'Keychron K6 Keyboard', desc: "With this wireless keyboard, you can connect to multiple devices at the same time.", price:230,img: Item1},
        {id:2,title:'HushMe', desc: "Prevent others from hearing your calls", price:500,img: Item2},
        {id:3,title:'iPhone 4', desc: "The most powerful iPhone yet...",price:600,img: Item3},
        {id:4,title:'Manulife Hoodie', desc: "Simple yet cool hoodie from Manulife...", price:90,img:Item4},
        {id:5,title:'Amazon Echo Dot (4th Generation)', desc: "The world's most popular smart speaker with Alexa", price:100,img: Item5},
        {id:6,title:'G502 Wireless Mouse', desc: "The best wireless mouse on the market from Logitech",price:170,img: Item6},
        {id:7,title:'LG OLED R', desc: "World's best television from LG",price:2230,img: Item7},
        {id:8,title:"Pink Watch", desc: "Pink Watch that works for all genders and ages",price:400,img: Item8},
        {id:9,title:"Digital Length Measurer", desc: "Measure accurately with latest laser technology",price:45,img: Item9}
    ],
    addedItems:[],
    total: 0
}

export function cartReducer (state = initState,action) {
    //INSIDE HOME COMPONENT
    if (action.type === ADD_TO_CART){
        let addedItem = state.items.find(item=> item.id === action.id)
         let existed_item= state.addedItems.find(item=> action.id === item.id)
         if (existed_item)
         {
            addedItem.quantity += 1 
             return {
                ...state,
                 total: state.total + addedItem.price 
                  }
        }
         else {
            addedItem.quantity = 1;
            //calculating the total
            let newTotal = state.total + addedItem.price 
            
            return {
                ...state,
                addedItems: [...state.addedItems, addedItem],
                total : newTotal
            }
            
        }
    }
    if (action.type === REMOVE_ITEM) {
        let itemToRemove= state.addedItems.find(item=> action.id === item.id)
        let new_items = state.addedItems.filter(item=> action.id !== item.id)
        
        //calculating the total
        let newTotal = state.total - (itemToRemove.price * itemToRemove.quantity )
        console.log(itemToRemove)
        return {
            ...state,
            addedItems: new_items,
            total: newTotal
        }
    }
    //INSIDE CART COMPONENT
    if (action.type === ADD_QUANTITY) {
        let addedItem = state.items.find(item=> item.id === action.id)
          addedItem.quantity += 1 
          let newTotal = state.total + addedItem.price
          return {
              ...state,
              total: newTotal
          }
    }
    if(action.type === SUB_QUANTITY) {  
        let addedItem = state.items.find(item=> item.id === action.id) 
        //if the qt == 0 then it should be removed
        if(addedItem.quantity === 1) {
            let new_items = state.addedItems.filter(item=>item.id !== action.id)
            let newTotal = state.total - addedItem.price
            return {
                ...state,
                addedItems: new_items,
                total: newTotal
            }
        }
        else {
            addedItem.quantity -= 1
            let newTotal = state.total - addedItem.price
            return {
                ...state,
                total: newTotal
            }
        }
        
    }

    if(action.type === ADD_SHIPPING) {
          return {
              ...state,
              total: state.total + 35
          }
    }

    if(action.type === 'SUB_SHIPPING') {
        return {
            ...state,
            total: state.total - 35
        }
  }
    
  else {
    return state
    }
}

export default cartReducer;
