import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import React, { useState } from "react";
import firebase from "../firebase.config";
import { TextField, Button, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";

const provider = new GoogleAuthProvider();

// const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID
const Login = (props) => {
  const { t } = useTranslation();

  const { authenticated, setAuthenticated } = props;
  const [authInfo, setAuthInfo] = useState({});

  provider.addScope("https://www.googleapis.com/auth/contacts.readonly");

  const log = () => {
    const auth = getAuth();

    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const user = result.user;
        firebase
          .firestore()
          .collection("Users")
          .doc(user.email)
          .get()
          .then((i) => {
            // The signed-in user info.
            setAuthenticated(true);
          })
          .catch((e) => {
            signOut(auth);
          });

        // ...
      })
      .catch((error) => {
        setAuthenticated(false);
      });
  };
  const log1 = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        setAuthenticated(false);
      })
      .catch((error) => {
        // An error happened.
      });
  };
  const createAccount = () => {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, authInfo.email, authInfo.password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
  };

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <Grid container>
        <Grid item xs={4}></Grid>
        <Grid item container xs={4} spacing={2}>
          {!authenticated && (
            <>
              <Grid item xs={12}>
                <TextField
                  sx={{ backgroundColor: "white" }}
                  label={t("Email")}
                  type="text"
                  value={authInfo.email}
                  onChange={(e) =>
                    setAuthInfo({
                      ...authInfo,
                      email: e.target.value,
                    })
                  }
                  id="formatted-numberformat-input"
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  sx={{ backgroundColor: "white" }}
                  label={t("password")}
                  type="password"
                  value={authInfo.password}
                  onChange={(e) =>
                    setAuthInfo({
                      ...authInfo,
                      password: e.target.value,
                    })
                  }
                  id="formatted-numberformat-input"
                  variant="standard"
                />
              </Grid>
            </>
          )}
          {!authenticated ? (
            <Grid item xs={12}>
              <Button variant="contained" onClick={createAccount}>Logar</Button>
            </Grid>
          ) : (
            <></>
          )}
          {!authenticated ? (
            <Grid item xs={12}>
              <button className="button" onClick={log}>
                <i className="fab fa-google"></i>Logar com google
              </button>
            </Grid>
          ) : (
            <></>
          )}
          {!authenticated ? (
            <Grid item xs={12}>
              <button onClick={createAccount}>Criar conta</button>
            </Grid>
          ) : (
            <></>
          )}
          {authenticated ? <button onClick={log1}>Sair</button> : <></>}
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;
