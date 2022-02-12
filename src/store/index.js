import { createStore } from 'redux'

const INITIAL_STATE = {
  Products: [],
  Entries: [],
  Clients: [],
  Sales: [],
}

function reducer (state = INITIAL_STATE, action) {
  console.log(action)
  switch (action.type) {
    case 'ADD_PRODUCT':
      let Products = state.Products;
      Products.push(action.Product);
      return {
        ...state,
        Products: Products
      }
    case 'SET_PRODUCTOS':
      return {
        ...state,
        Products: action.Products
      }
    case 'SET_CLIENTS':
      return {
        ...state,
        Clients: action.Clients
      }
    default:
  }
  return state
}
const store = createStore(reducer)
export default store
