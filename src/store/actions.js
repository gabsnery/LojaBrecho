
export function setProductos (Products) {
    return {
      type: 'SET_PRODUCTOS',
      Products
    }
  }
export function addProduct (Product) {
    return {
      type: 'ADD_PRODUCT',
      Product
    }
  }
export function updateProduct (Product) {
    return {
      type: 'UPDATE_PRODUCT',
      Product
    }
  }
export function setClients (Clients) {
    return {
      type: 'SET_CLIENTS',
      Clients
    }
  }
  export function addClient (Client) {
    return {
      type: 'ADD_CLIENT',
      Client
    }
  }
export function updateClient (Client) {
    return {
      type: 'UPDATE_CLIENT',
      Client
    }
  }
  export function setEntries (Entries) {
    return {
      type: 'SET_ENTRIES',
      Entries
    }
  }
export function addEntry (Entry) {
    return {
      type: 'ADD_ENTRY',
      Entry
    }
  }
export function updateEntry (Entry) {
    return {
      type: 'UPDATE_ENTRY',
      Entry
    }
  }
export function removeEntry (Entry) {
    return {
      type: 'REMOVE_ENTRY',
      Entry
    }
  }
  export function setSales (Sales) {
    return {
      type: 'SET_SALES',
      Sales
    }
  }
export function addSale (Sale,Products) {
    return {
      type: 'ADD_SALE',
      Sale,
      Products
    }
  }
export function updateSale (Sale,Products) {
    return {
      type: 'UPDATE_SALE',
      Sale,
      Products
    }
  }