import firebase from "../../firebase.config"
const INITIAL_STATE = {
 title:'',
 type:''
};
export default function reducer(state = INITIAL_STATE, action) {
  console.log("🚀 ~ reducer ~ action:", action)
  switch (action.type) {
    case 'SET_SNACKBAR':
      return {
        title: action.SnackBar.title,
        type: action.SnackBar.type,
      }
    case 'CLEAR_SNACKBAR':
      return INITIAL_STATE
    default:
  }
  return state;
}
