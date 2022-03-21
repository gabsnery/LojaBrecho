import firebase from '../../firebase.config'
import FirebaseServices from '../../services/services'

export async function handleCredit (CreditValue, Client, Products, Type) {
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
    })

  return
}

export async function updateSalesProducts (Sale, Products) {
  let SaleRef = firebase
    .firestore()
    .collection('Sales')
    .doc(Sale.id)

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
    reduceStock(Products)
    return {}
  })



  Products.map(item => {
    firebase
      .firestore()
      .collection('Products')
      .doc(item.id)
      .collection('Sales')
      .add({ Sale: SaleRef })
    return null
  })
}
export async function reduceStock (products) {
  products.map(item =>
    firebase
      .firestore()
      .collection('Products')
      .doc(item.id)
      .update({ stock: item.stock - 1, sold: true,soldValue:item.soldValue,percDiscount:item.percDiscount })
  )
}

export async function updateTotalValue (product) {
  let total = 0

  let Products_ = await FirebaseServices.getAll('Products')
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
    })
}
