import React, { createContext, useContext, useEffect, useState } from 'react' 
 import { useTranslation } from 'react-i18next'
import firebase from '../firebase.config'

export const DataContext = createContext()

export default function DataProvider ({ children }) {
  const [State_, setState_] = useState(true)
  const [Clients, setClients] = useState([])
  const [Products, setProducts] = useState([])
  const [Entries, setEntries] = useState([])
  const [Sales, setSales] = useState([])

  useEffect(() => {
    async function fetchData () {
      let _Clients = await getData('Clients', 'Nome')
      for (let x = 0; x < _Clients.length; x++) {
        let data = await firebase
          .firestore()
          .collection('Clients')
          .doc(_Clients[x].id)
          .collection('Credits')
          .get()
        let List = data.docs
        _Clients[x]['Credits'] = List.map(item => item.data())
      }

      setClients(_Clients)

      let _Sales = await getData('Sales', 'name')
      let _Products = await getData('Products', 'name')

      for (let x = 0; x < _Sales.length; x++) {
        let data_ = await firebase
          .firestore()
          .collection('Sales')
          .doc(_Sales[x].id)
          .collection('Products')
          .get()
        let List_ = data_.docs.map(data1 => data1.data()['Product'])
        _Sales[x]['Products'] = []
        for (let y = 0; y < List_.length; y++) {
          _Sales[x]['Products'].push(_Products.find(x => x.id === List_[y].id))
        }
      }

      setSales(_Sales)

      setProducts(_Products)
      setEntries(await getData('Entries', 'name'))
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
  async function handleCredit (CreditValue, Client, Products, Type) {
    Products = Products.map(item =>
      firebase
        .firestore()
        .collection('Products')
        .doc(item.id)
    )

    await firebase
      .firestore()
      .collection('Clients')
      .doc(Client)
      .collection('Credits')
      .add({
        Value: CreditValue,
        created: new Date(),
        type: Type,
        Products: Products
      })
      .then(() => {
        Products.map(item => item.update({ releasedCredit: true }))
        setState_(true)
      })

    return
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
      return {}
    })
  }
  async function reduceStock (products) {
    products.map(item =>
      firebase
        .firestore()
        .collection('Products')
        .doc(item.id)
        .update({ stock: item.stock - 1, sold: true })
    )
  }
  async function updateTotalValue (product) {
    let total = 0

    let Products_ = await getData('Products', 'name')
    Products_.filter(t => t['Entry'] !== undefined)
      .filter(l => l['Entry'].id === product['Entry'].id)
      .map(y => (total += y.value))
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
        updateSalesProducts,
        handleCredit
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
    updateSalesProducts,
    handleCredit
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
    updateSalesProducts,
    handleCredit
  }
}

export function useState_ () {
  const context = useContext(DataContext)
  if (!context) throw new Error('useData must be used within a DataProvider')
  const { State_, setState_ } = context
  return { State_, setState_ }
}
