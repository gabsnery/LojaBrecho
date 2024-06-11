import firebase from '../firebase.config'

const create = (collection, data) => {
  data['created'] = new Date()
  data['hostUser'] = firebase.auth().currentUser.email
  return firebase
    .firestore()
    .collection(collection)
    .add(data)
}

const update = (collection, data) => {
  data['modified'] = new Date()

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
const getAll = async collection => {
  const response = firebase.firestore().collection(collection).where('hostUser', '==', firebase.auth().currentUser.email)
  const data = await response.get()
  let Items_ = []
  let List = data.docs
  for (let index = 0; index < List.length; index++) {
    let item = List[index].data()
    item['id'] = List[index].id
    Items_.push(item)
  }
  Items_ = Items_.filter(x => x.disable === undefined || x.disable === false)
  return Items_
}
const getSubCollection = async (collection, item, subCollection) => {
  let data = await firebase
    .firestore()
    .collection(collection)
    .doc(item.id)
    .collection(subCollection)
    .get()
  let List = data.docs
  return List.map(item => item.data())
}
const FirebaseServices = {
  create,
  update,
  remove,
  getAll,
  getSubCollection
}

export default FirebaseServices
