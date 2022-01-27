import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut
} from 'firebase/auth'
import React from 'react'
import firebase from '../firebase.config'

const provider = new GoogleAuthProvider()

// const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID
const Login = props => {
  const { authenticated,setAuthenticated } = props

  provider.addScope('https://www.googleapis.com/auth/contacts.readonly')

  const log = () => {
    const auth = getAuth()

    signInWithPopup(auth, provider)
      .then(result => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const user = result.user
        firebase
          .firestore()
          .collection('Users')
          .doc(user.email)
          .get()
          .then(i => {
            // The signed-in user info.
            setAuthenticated(true)
          })
          .catch(e => {
            signOut(auth)
          })

        // ...
      })
      .catch(error => {
        setAuthenticated(false)
      })
  }
  const log1 = () => {
    const auth = getAuth()
    signOut(auth)
      .then(() => {
        setAuthenticated(false)
      })
      .catch(error => {
        // An error happened.
      })
  }

  return (
    <div style={{ width: 'fit-content', display: 'inline' ,float:'right'}}>
      {!authenticated ? <button className='button' onClick={log}>
        <i className='fab fa-google'></i>Logar
      </button>:<></>
}
      {authenticated ? <button onClick={log1}>Sair</button> : <></>}
    </div>
  )
}

export default Login
