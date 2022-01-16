import firebase from '../firebase.config'


const create = (collection, data) => {
  data['Created'] = new Date()
  return firebase
    .firestore()
    .collection(collection)
    .add(data)
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
  remove
}

export default FirebaseServices
