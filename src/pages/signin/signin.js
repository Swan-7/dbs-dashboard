import React, { useState } from "react";
import {
  TextField,
  InputAdornment,
  Icon,
  IconButton,
  Button,
  CircularProgress,
  Snackbar,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import "./signin.css";
// import SignUpImge from "../../assets/signup.png";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

import { useSelector, useDispatch } from "react-redux";
import {
  updateCurrentUser,
  updateUserCred,
} from "../../redux/reducers/user/slice";
import { auth, db } from "../../constants/firestore";
import MuiAlert from "@material-ui/lab/Alert";
export function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function SignIn() {
  const history = useHistory();
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const [visibility, setVisibility] = useState({
    showPassword: false,
    showConfirmPassword: false,
  });
  const [loading, setloading] = useState(false);
  const [googleloading, setgoogleloading] = useState(false);

  const [emailError, setEmailError] = useState({
    message: null,
    status: false,
  });
  const [passwordError, setPasswordError] = useState({
    message: null,
    status: false,
  });
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
    // console.log(values);
  };

  const handleClickShowPassword = (prop, state) => {
    setVisibility({ ...visibility, [prop]: state });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const [openSnack, setOpenSnack] = useState({
    show: false,
    message: "",
    severity: "",
  });
  const [usernameStatus, setusernameStatus] = useState({
    status: false,
    show: false,
  });
  const handleSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnack({
      message: "",
      show: false,
      severity: "",
    });
  };
  const userCheck = (id) => {
    db.collection("users")
      .doc(id)
      .get()
      .then((snap) => {
        if (snap.exists) {
          setloading(false);

          let roles = [];
          roles = snap.data().roles;
          // console.log(roles, "roles");
          if (roles.includes("ADMIN") && snap.data().is_active) {
            setOpenSnack({
              message: `Hello, welcome back`,
              show: true,
              severity: "success",
            });
            dispatch({
              type: "user",
              payload: {
                id: snap.id,
                email: snap.data().email,
                // password: values.password,
              },
            });

            setTimeout(() => {
              history.push("/");
            }, 2500);
          } else {
            setOpenSnack({
              message: !roles.includes("ADMIN")
                ? "You do not have access as admin"
                : "Your account has been de-activated",
              show: true,
              severity: "error",
            });
          }
        } else {
          setOpenSnack({
            message: "Account does not exist",
            show: true,
            severity: "error",
          });
        }
      })
      .catch((error) => {
        setloading(false);
        setOpenSnack({
          message: String(error),
          show: true,
          severity: "error",
        });
      });
  };
  const signinUser = () => {
    setloading(true);
    firebase
      .auth()
      .signInWithEmailAndPassword(values.email.trim(), values.password)
      .then((userCredential) => {
        // Signed in
        var user = userCredential.user;
        // const currentUser = firebase.auth().currentUser();
        // dispatch(updateUserCred(userCredential));
        // dispatch(updateCurrentUser(currentUser));
        userCheck(user.uid);
        // ...
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        setOpenSnack({
          message: errorMessage,
          show: true,
          severity: "error",
        });
        setloading(false);
      });
  };
  const dispatch = useDispatch();
  return (
    <div className="sign-in-container">
      <Snackbar
        open={openSnack.show}
        autoHideDuration={2500}
        onClose={handleSnackClose}
      >
        <Alert onClose={handleSnackClose} severity={openSnack.severity}>
          {openSnack.message}
        </Alert>
      </Snackbar>
      {/* <div className="sign-in-container-one">
        <img
          src={SignUpImge}
          style={{ width: "50%", height: "auto" }}
          alt="sign-in"
        />{" "}
      </div> */}
      <div className="sign-in-container-two">
        <div>
          <h1>DBS ADMIN</h1>
          <h3>Provide your credentials to sign in</h3>
        </div>

        <div style={{ marginTop: 30, marginBottom: 20, width: "50%" }}>
          <form className="sign-in-form" noValidate autoComplete="off">
            {/* <div> */}

            <TextField
              id="outlined-basic"
              label="Email"
              variant="outlined"
              error={emailError.status}
              helperText={emailError.message}
              onChange={handleChange("email")}
            />
            {/* </div> */}
            <div style={{ height: 15 }} />
            <TextField
              style={{ marginBottom: 16 }}
              id="outlined-basic"
              label="Password"
              variant="outlined"
              error={passwordError.status}
              helperText={passwordError.message}
              onChange={handleChange("password")}
              type={visibility.showPassword ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() =>
                        handleClickShowPassword(
                          "showPassword",
                          !visibility.showPassword
                        )
                      }
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      <Icon>
                        {visibility.showPassword
                          ? "visibility"
                          : "visibility_off"}
                      </Icon>
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </form>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Link to="/forgot_password">
              <Button
                key="forgot_password"
                color="primary"
                style={{ textTransform: "none" }}
              >
                Forgot Password?
              </Button>
            </Link>
          </div>
          <div className="sign-in-button-container">
            <Button
              variant="contained"
              size="large"
              color="secondary"
              disabled={loading}
              onMouseDown={handleMouseDownPassword}
              onClick={() => {
                // history.push("/home");
                if (
                  values.email.length > 6 &&
                  values.email.includes(".") &&
                  values.email.includes("@") &&
                  values.password.length >= 8
                ) {
                  setloading(true);
                  setEmailError({
                    message: null,
                    status: false,
                  });
                  setPasswordError({
                    message: null,
                    status: false,
                  });
                  signinUser();
                } else {
                  setEmailError({
                    message:
                      values.email.length < 7
                        ? "Email must be more than 6 characters"
                        : !values.email.includes(".")
                        ? "Email must contain (.)"
                        : "Email must contain (@)",
                    status: true,
                  });
                  setPasswordError({
                    status: true,
                    message: "Password must be 8 or more characters",
                  });
                }
              }}
            >
              {!loading ? (
                "Login"
              ) : (
                <CircularProgress size={24} color={"secondary"} />
              )}
            </Button>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              marginTop: 20,
            }}
          >
            <span style={{}}>Or</span>
          </div>
          <div className="sign-in-button-container">
            <Button
              variant="outlined"
              size="large"
              color="secondary"
              disabled={googleloading}
              onMouseDown={handleMouseDownPassword}
              onClick={() => {
                setgoogleloading(true);
                // Step 1.
                // User tries to sign in to Google.
                auth
                  .signInWithPopup(new firebase.auth.GoogleAuthProvider())
                  .then((result) => {
                    /** @type {firebase.auth.OAuthCredential} */
                    var credential = result.credential;
                    setgoogleloading(false);

                    // This gives you a Google Access Token. You can use it to access the Google API.
                    var token = credential.accessToken;
                    // The signed-in user info.
                    var user = result.user;
                    console.log("user id: ", user.uid);
                    userCheck(user.uid);

                    // ...
                  })
                  .catch(function (error) {
                    setgoogleloading(false);
                    setOpenSnack({
                      message: error.message,
                      show: true,
                      severity: "error",
                    });
                  });
              }}
            >
              {!googleloading ? (
                "Sign in with Google"
              ) : (
                <CircularProgress size={24} color={"secondary"} />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
