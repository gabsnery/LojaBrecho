import { Button } from '@mui/material'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Provider } from 'react-redux'
import Login from './Components/Login'
import firebase from './firebase.config'
import LoggedArea from './LoggedArea'
import store from './store'
import {muiTheme} from './theme'
import { ThemeProvider } from "@mui/material";

function App () {
  const [authenticated, setAuthenticated] = React.useState(false)
  const { i18n } = useTranslation()

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user)
        if (user.auth.currentUser) {
          firebase
            .firestore()
            .collection('Users')
            .doc(user.auth.currentUser.email)
            .get()
            .then(i => {
              setAuthenticated(i.exists)
            })
        }
    })

  }, [])
  return (
      <Provider store={store}>
                <ThemeProvider theme={muiTheme}>
        <div style={{ width: 'fit-content', display: 'inline' }}>
          <Button sx={{color:'white'}} onClick={() => i18n.changeLanguage('pt')}>Português</Button>
          <Button sx={{color:'white'}} onClick={() => i18n.changeLanguage('en')}>English</Button>
        </div>
        <Login
          authenticated={authenticated}
          setAuthenticated={setAuthenticated}
        />

        {authenticated ? <LoggedArea /> : <></>}
                </ThemeProvider>
      </Provider>
  )
}

export default App
