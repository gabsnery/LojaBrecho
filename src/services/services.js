import firebase from '../firebase.config'
import { doc, deleteDoc } from 'firebase/firestore'

const create = (collection, data) => {
  data['Created'] = new Date()
  return firebase
    .firestore()
    .collection(collection)
    .add(data)
}

const truncate = async () => {
  firebase.firestore().collection('Clients')
    .get()
    .then(querySnapshot => {
      querySnapshot.docs.forEach(snapshot => {
        snapshot.ref.delete()
      })
    })
  firebase.firestore().collection('Products')
    .get()
    .then(querySnapshot => {
      querySnapshot.docs.forEach(snapshot => {
        snapshot.ref.delete()
      })
    })
  firebase.firestore().collection('Entries')
    .get()
    .then(querySnapshot => {
      querySnapshot.docs.forEach(snapshot => {
        snapshot.ref.delete()
      })
    })
  firebase.firestore().collection('Sales')
    .get()
    .then(querySnapshot => {
      querySnapshot.docs.forEach(snapshot => {
        snapshot.ref.delete()
      })
    })
}
const update = (collection, data) => {
  data['Modified'] = new Date()

  return firebase
    .firestore()
    .collection(collection)
    .doc(data.id)
    .update(data)
}

const remove = (collection, data) => {
  return firebase
    .firestore()
    .collection(collection)
    .doc(data.id)
    .delete()
}

const FirebaseServices = {
  create,
  update,
  remove,
  truncate
}

export default FirebaseServices
