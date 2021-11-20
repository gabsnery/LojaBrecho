import React, { createContext, useContext, useEffect, useState } from 'react'
import firebase from '../firebase.config'

const DataContext = createContext()

export default function DataProvider ({ children }) {
  const [State_, setState_] = useState(true)
  const [Clients, setClients] = useState([])
  const [Products, setProducts] = useState([])
  const [Entries, setEntries] = useState([])
  const [Sales, setSales] = useState([])
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      //setState_(true)
    }
  })
  useEffect(() => {
    async function fetchData () {
      setClients(await getData('Clients', 'Nome'))
      setProducts(await getData('Products', 'Nome'))
      setEntries(await getData('Entries', 'Nome'))
      setSales(await getData('Sales', 'Nome'))
    }

    if (State_) {
      fetchData()
      setState_(false)
    }
  }, [State_])

  async function getData (collection, sort) {
    const response = firebase.firestore().collection(collection)
    const data = await response.get()
    let Items_ = []
    let List = data.docs
    for (let index = 0; index < List.length; index++) {
      let item = List[index].data()
      item['id'] = List[index].id
      Items_.push(item)
    }
    Items_ = Items_.filter(x => x.disable === undefined || x.disable === false)
    Items_.sort((a, b) => (a[sort] > b[sort] ? 1 : b[sort] > a[sort] ? -1 : 0))
    return Items_
  }
  async function updateSalesProducts (Sale, Products) {
    let Products_ = (
      await firebase
        .firestore()
        .collection('Sales')
        .doc(Sale.id)
        .collection('Products')
        .get()
    ).docs.map(x => {
      return x.data()['Product']
    })
    Products = [...Products]
    for (var i = Products.length - 1; i >= 0; i--) {
      for (var j = 0; j < Products_.length; j++) {
        if (Products[i] && Products[i].id === Products_[j].id) {
          Products.splice(i, 1)
          Products_.splice(j, 1)
        }
      }
    }
    console.log('Products', Products)

    let ProductsToAdd =
      Products_.length > 0
        ? Products.filter(el => {
            return Products_.every(f => {
              return el.id !== f.id
            })
          })
        : Products
    let ProductsToRemove =
      Products_.length > 0
        ? Products_.filter(el => {
            return Products.every(f => {
              return el.id !== f.id
            })
          })
        : Products

    Products.map(item => {
      let ProductsRef = firebase
        .firestore()
        .collection('Products')
        .doc(item.id)
      firebase
        .firestore()
        .collection('Sales')
        .doc(Sale.id)
        .collection('Products')
        .add({ Product: ProductsRef })
    })
  }
  async function reduceStock (products) {
    products.map(item =>
      firebase
        .firestore()
        .collection('Products')
        .doc(item.id)
        .update({ Stock: item.Stock - 1 })
    )
  }
  async function updateTotalValue (product) {
    let total = 0

    let Products_ = await getData('Products', 'Nome')
    Products_.filter(t => t['Entry'] !== undefined)
      .filter(l => l['Entry'].id === product['Entry'].id)
      .map(y => (total += y.Value))
    firebase
      .firestore()
      .collection('Entries')
      .doc(product['Entry'].id)
      .get()
      .then(data => {
        if (data.data()['AutoCalculate']) {
          firebase
            .firestore()
            .collection('Entries')
            .doc(product['Entry'].id)
            .update({ Value: total, Credit: total * 0.7 })
        } else {
          firebase
            .firestore()
            .collection('Entries')
            .doc(product['Entry'].id)
            .update({ Value: total })
        }
        setState_(true)
      })
  }

  return (
    <DataContext.Provider
      value={{
        Clients,
        setClients,
        Products,
        setProducts,
        State_,
        setState_,
        Entries,
        setEntries,
        Sales,
        setSales,
        updateTotalValue,
        reduceStock,
        updateSalesProducts
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData () {
  const context = useContext(DataContext)
  if (!context) throw new Error('useData must be used within a DataProvider')
  const {
    Clients,
    setClients,
    Products,
    setProducts,
    Entries,
    setEntries,
    Sales,
    setSales,
    updateTotalValue,
    reduceStock,
    updateSalesProducts
  } = context
  return {
    Clients,
    setClients,
    Products,
    setProducts,
    Entries,
    setEntries,
    Sales,
    setSales,
    updateTotalValue,
    reduceStock,
    updateSalesProducts
  }
}

export function useState_ () {
  const context = useContext(DataContext)
  if (!context) throw new Error('useData must be used within a DataProvider')
  const { State_, setState_ } = context
  return { State_, setState_ }
}
