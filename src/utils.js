import React, { createContext, useContext, useEffect, useState } from 'react'
import firebase from '../firebase.config'
import FirebaseServices from '../../services/services'

export function formatDollars (dollars) {
  dollars = (Math.round(dollars * 100) / 100).toFixed(2)
  dollars = dollars.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return dollars
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
