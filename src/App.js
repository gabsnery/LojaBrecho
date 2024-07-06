import { ThemeProvider } from "@mui/material";
import React, { useEffect } from "react";
import { Provider } from "react-redux";
import LanguageSelector from "./Components/LanguageSelector";
import Login from "./Components/Login";
import LoggedArea from "./LoggedArea";
import firebase from "./firebase.config";
import store from "./store";
import { muiTheme } from "./theme";

function App() {
  const [authenticated, setAuthenticated] = React.useState(false);
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user)
        if (user.auth.currentUser) {
          firebase
            .firestore()
            .collection("Users")
            .doc(user.auth.currentUser.email)
            .get()
            .then((i) => {
              setAuthenticated(i.exists);
            });
        }
    });
  }, []);
  return (
    <Provider store={store}>
      <ThemeProvider theme={muiTheme}>
        <div className="app-container">
          <header className="app-header">
            <h1>Loja Brechó</h1>
          </header>
          <LanguageSelector />
          <Login
            authenticated={authenticated}
            setAuthenticated={setAuthenticated}
          />

           <LoggedArea /> 
        </div>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
