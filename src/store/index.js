import { createStore } from 'redux'

const INITIAL_STATE = {
  Products: [],
  Entries: [],
  Clients: [],
  Sales: []
}

function reducer (state = INITIAL_STATE, action) {
  console.log(action)
  switch (action.type) {
    case 'SET_PRODUCTOS':
      return {
        ...state,
        Products: action.Products
      }
    case 'ADD_PRODUCT':
      let Products = [...state.Products]
      Products.push(action.Product)
      return {
        ...state,
        Products: Products
      }
    case 'UPDATE_PRODUCT':
      return {
        ...state,
        Products: state.Products.map(item =>
          item['id'] === action.Product['id'] ? action.Product : item
        )
      }
    case 'REMOVE_PRODUCT':
      return {
        ...state,
        Products: [
          ...state.Products.slice(0, action.Product),
          ...state.Products.slice(action.Product + 1)
        ]
      }
    case 'SET_CLIENTS':
      return {
        ...state,
        Clients: action.Clients
      }
    case 'ADD_CLIENT':
      return {
        ...state,
        Clients: [...state.Clients, action.Client]
      }
    case 'UPDATE_CLIENT':
      return {
        ...state,
        Clients: state.Clients.map(item =>
          item['id'] === action.Clients['id'] ? action.Clients : item
        )
      }
    case 'SET_ENTRIES':
      return {
        ...state,
        Entries: action.Entries
      }
    case 'ADD_ENTRY':
      let Entries = state.Entries
      Entries.push(action.Entry)
      return {
        ...state,
        Entries: Entries
      }
    case 'UPDATE_ENTRY':
      return {
        ...state,
        Entries: state.Entries.map(item =>
          item['id'] === action.Entry['id'] ? action.Entry : item
        )
      }
    case 'REMOVE_ENTRY':
      return {
        ...state,
        Entries: [
          ...state.Entries.slice(0, action.Entry),
          ...state.Entries.slice(action.Entry + 1)
        ],
        Products: state.Products.filter(
          prod => prod['Entry'].id !== action.Entry['id']
        )
      }
    case 'SET_SALES':
      return {
        ...state,
        Sales: action.Sales
      }
    case 'ADD_SALE':
      let Sales = [...state.Sales]
      let Products_ = [...state.Products]
      Sales.push({ ...action.Sale, Products: action.Products })

      Products_ = Products_.map(x => {
        let num = (action.Products.filter(y => y['id'] === x.id)).length
        if (num > 0) {
          return { ...x, stock: x.stock - num }
        } else {
          return x
        }
      })
      return {
        ...state,
        Sales: Sales,
        Products:Products_
      }
    case 'UPDATE_SALE':
      return {
        ...state,
        Sales: state.Sales.map(item =>
          item['id'] === action.Sale['id'] ? action.Sale : item
        )
      }
    default:
  }
  return state
}
const store = createStore(reducer)
export default store
