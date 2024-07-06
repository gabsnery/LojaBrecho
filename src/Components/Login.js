import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import React, { useState } from "react";
import firebase from "../firebase.config";
import { TextField, Button, Grid, Snackbar, Alert } from "@mui/material";
import { useTranslation } from "react-i18next";

const provider = new GoogleAuthProvider();

// const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID
const Login = (props) => {
  const { t } = useTranslation();

  const { authenticated, setAuthenticated } = props;
  const [authInfo, setAuthInfo] = useState({});
  const [accountCreationError, setAccountCreationError] = useState();
  const [loginError, setLoginError] = useState();
  const [createAccountOpen, setCreateAccountOpen] = useState(false);

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
            if (i.exists) setAuthenticated(true);
            else {
              firebase
                .firestore()
                .collection("Users")
                .doc(user.email)
                .set({ guest: true });
            }
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
        setLoginError(error.message);
      });
  };
  const logWPass = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, authInfo.email, authInfo.password)
      .then(() => {
        setAuthenticated(false);
      })
      .catch((error) => {
        setLoginError(error.message.toString());
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
        setLoginError(errorMessage);
        // ..
      });
  };

  return (
    <div style={{ width: "100%", textAlign: "center" }}>
      <Snackbar
        open={!!loginError}
        autoHideDuration={6000}
        onClose={() => {
          setLoginError(undefined);
        }}
      >
        <Alert
          onClose={() => {
            setLoginError(undefined);
          }}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {loginError}
        </Alert>
      </Snackbar>
      {/*       <Snackbar
  open={open}
  autoHideDuration={6000}
  onClose={handleClose}
  message="Note archived"
  action={action}
/> */}
      <Grid container>
        <Grid item xs={4}></Grid>
        <Grid item container xs={4} spacing={2}>
        {/*   {!authenticated && (
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
          )} */}
     {/*      {!authenticated ? (
            <Grid item xs={12}>
              <Button fullWidth variant="contained" onClick={logWPass}>
                Logar
              </Button>
            </Grid>
          ) : (
            <></>
          )} */}
          {!authenticated ? (
            <Grid item xs={12}>
              <Button fullWidth variant="contained" onClick={log}>
                Logar com google
              </Button>
            </Grid>
          ) : (
            <></>
          )}
         {/*  {!authenticated ? (
            <Grid item xs={12}>
              <Button
                variant="text"
                color={"secondary"}
                onClick={() => setCreateAccountOpen(true)}
              >
                Criar conta
              </Button>
            </Grid>
          ) : (
            <></>
          )} */}
          {authenticated ? <button onClick={log1}>Sair</button> : <></>}
          {createAccountOpen && !authenticated ? (
            <Grid item xs={12}>
              <Button fullWidth variant="contained" onClick={log}>
                Criar com google
              </Button>
            </Grid>
          ) : (
            <></>
          )}
        </Grid>
      </Grid>
    </div>
  );
};

export default Login;
