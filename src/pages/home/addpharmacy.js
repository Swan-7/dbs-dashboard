import React, { useState, useEffect } from "react";
import {
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  InputAdornment,
  Icon,
  IconButton,
  Button,
  CircularProgress,
  FormHelperText,
  Snackbar,
  Backdrop,
  Radio,
  RadioGroup,
  FormLabel,
  FormControlLabel,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { Link, useHistory } from "react-router-dom";
import { difference } from "lodash";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { auth, db, fieldValue, storage } from "../../constants/firestore";
import { useSelector, useDispatch } from "react-redux";
import { update, userData } from "../../redux/reducers/user/slice";

import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import axios from "axios";
import { shops } from "../../redux/reducers/pharmacy/slice";

export function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function AddPharmacy(props) {
  const history = useHistory();
  const user = useSelector(userData);
  const [owner, setowner] = useState({
    id: "",
  });

  const [modal, setmodal] = useState({ show: false, for: "" });
  const [values, setValues] = useState({
    title: "",
    contact: "",
    is_active: "yes",
    added_by: "",
    id: "",

    location: {
      coords: {
        lat: null,
        lng: null,
      },
      name: "",
      viewport: {
        northeast: {
          lat: null,
          lng: null,
        },
        southwest: {
          lat: null,
          lng: null,
        },
      },
    },
  });
  const [type, settype] = useState("SHOP");
  const reset = () => {
    setValues({
      title: "",
      contact: "",
      is_active: "yes",
      added_by: "",
      id: "",
      location: {
        coords: {
          lat: null,
          lng: null,
        },
        name: "",
        viewport: {
          northeast: {
            lat: null,
            lng: null,
          },
          southwest: {
            lat: null,
            lng: null,
          },
        },
      },
    });
  };
  const [titleError, settitleError] = useState({
    message: null,
    status: false,
  });
  const [locationError, setlocationError] = useState({
    message: null,
    status: false,
  });
  const [stockError, setstockError] = useState({
    message: null,
    status: false,
  });
  const [descriptionError, setdescriptionError] = useState({
    message: null,
    status: false,
  });
  const [categoryError, setcategoryError] = useState({
    message: null,
    status: false,
  });
  const [priceError, setpriceError] = useState({
    message: null,
    status: false,
  });

  const [loading, setloading] = useState(false);
  const [openSnack, setOpenSnack] = useState({
    show: false,
    message: "",
    severity: "",
  });
  const [usernameStatus, setusernameStatus] = useState({
    status: false,
    show: false,
  });
  const [emailStatus, setemailStatus] = useState({
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
  const [visibility, setVisibility] = useState({
    showPassword: false,
    showConfirmPassword: false,
  });
  const handleCloseModal = () => {
    setmodal({ show: false, for: "" });
  };
  const handleModalToggle = (f) => {
    setmodal({
      show: !modal.show,
      for: f,
    });
  };
  const handleChange = (prop) => (event) => {
    // if (prop === "email" && props.user === null && props.modal.for !== "edit") {
    //   checkforEmail(event.target.value);
    // }

    setValues({ ...values, [prop]: event.target.value });

    // console.log(values);
    // errors();
  };

  const handleClickShowPassword = (prop, state) => {
    setVisibility({ ...visibility, [prop]: state });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const errors = () => {
    settitleError({
      status: values.title.length < 2,
      message:
        values.title.length < 2 ? "Title must be 2 or more characters" : "",
    });
    setpriceError({
      status: Number(values.contact) !== 10,
      message:
        Number(values.contact) !== 10 ? "Contact must be 10 characters" : "",
    });

    setOpenSnack({
      message: `Provide a location`,
      severity: "error",
      show: values.location.coords.lat === null,
    });
  };

  useEffect(() => {
    if (props.editData !== null && props.editData !== undefined) {
      setValues({
        ...props.editData,
        is_active: props.editData.is_active ? "yes" : "no",
      });
    }
  }, [props.editData]);
  const createProduct = () => {
    setloading(true);
    const date = new Date().getTime();
    const productDBRef = db.collection("pharmacies").doc();

    productDBRef
      .set({
        title: values.title,
        contact: values.contact,
        is_active: values.is_active === "yes" ? true : false,
        added_by: user.user.id,
        id: productDBRef.id,
        location: values.location,
        created_at: date,
      })
      .then(() => {
        dispatch({
          type: "pharmacy",
        });
        setOpenSnack({
          message: `Pharmacy added successfully`,
          severity: "success",
          show: true,
        });
        setTimeout(() => {
          props.close();
          reset();

          setloading(false);
        }, 2500);
      })
      .catch((error) => {
        setOpenSnack({
          message: error,
          severity: "error",
          show: true,
        });
      });

    // ...
  };
  const dispatch = useDispatch();
  return (
    <Backdrop
      style={{
        zIndex: 1202,
        display: "flex",
        flexDirection: "column",
      }}
      open={props.modal.show}
      // onClick={handleCloseModal}
    >
      <Snackbar
        open={openSnack.show}
        autoHideDuration={2500}
        onClose={handleSnackClose}
      >
        <Alert onClose={handleSnackClose} severity={openSnack.severity}>
          {openSnack.message}
        </Alert>
      </Snackbar>
      <div
        className="add-user-container"
        style={{
          overflowY: "auto",
          backgroundColor: "#fff",
          width: "70%",
          display: "flex",
          padding: "1em",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: 10,
            top: 0,
            // display: "flex",
            // alignItems: "center",
            // justifyContent: "flex-end",

            // width: "100%",
          }}
        >
          <IconButton
            style={{}}
            onClick={() => {
              props.close();

              reset();
            }}
          >
            <Icon>close</Icon>
          </IconButton>
        </div>
        <h3 style={{ marginTop: 0, alignSelf: "center" }}>
          {props.modal.for === "edit" ? "EDIT" : "ADD PHARMACY"}
        </h3>

        <div style={{ marginTop: 5, marginBottom: 20 }}>
          <form
            className="sign-up-form"
            style={{
              gap: "1em",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
            noValidate
            autoComplete="off"
          >
            <TextField
              // disabled={props.modal.for === "edit" ? true : false}
              id="outlined-basic"
              label="Name"
              variant="outlined"
              autoComplete="off"
              error={titleError.status}
              helperText={titleError.message}
              value={values.title}
              onChange={handleChange("title")}
            />

            <TextField
              id="outlined-basic"
              label="Contact"
              inputProps={{
                maxLength: 10,
              }}
              variant="outlined"
              error={priceError.status}
              helperText={priceError.message}
              value={values.contact}
              onChange={handleChange("contact")}
            />
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <GooglePlacesAutocomplete
                selectProps={{
                  placeholder: "Search location",
                  onChange: (value) => {
                    // errors();
                    console.log(value.value.place_id, "selected place");
                    let place_id = value.value.place_id;
                    axios
                      .get(
                        `https://us-central1-drug-distribution-system.cloudfunctions.net/place_details?place_id=${place_id}`
                      )
                      .then((response) => {
                        console.log(response.data.result);
                        let result = response.data.result;
                        setValues({
                          ...values,
                          location: {
                            coords: result.geometry.location,
                            name: result.name,
                            viewport: result.geometry.viewport,
                          },
                        });
                      })
                      .catch((error) => {
                        console.log(error);
                      });
                  },
                }}
                apiKey="AIzaSyCSfLqHtXZmHww98tHHDPkd70yB-3FVTT4"
              />
              {props.editData !== null && props.editData !== undefined && (
                <span style={{ fontWeight: "bold" }}>
                  Current Location: {props.editData.location.name}
                </span>
              )}
              {locationError.status && (
                <FormHelperText error={locationError.status}>
                  {locationError.message}
                </FormHelperText>
              )}
            </div>
            <FormControl component="fieldset" style={{ marginTop: "1.5em" }}>
              <FormLabel component="legend">Status</FormLabel>
              <RadioGroup
                aria-label="status"
                name="Status"
                style={{ display: "flex", flexDirection: "row" }}
                value={values.is_active}
                onChange={handleChange("is_active")}
              >
                <FormControlLabel
                  value="yes"
                  control={<Radio />}
                  label="Active"
                />
                <FormControlLabel
                  value="no"
                  control={<Radio />}
                  label="InActive"
                />
              </RadioGroup>
            </FormControl>
          </form>
          {/* <div style={{ width: "100%" }}> */}
          <Button
            variant="contained"
            size="large"
            color="secondary"
            style={{ width: "100%" }}
            disabled={loading}
            onMouseDown={handleMouseDownPassword}
            onClick={() => {
              if (
                Number(values.contact) > 0 &&
                values.title.length > 1 &&
                values.location.coords.lat !== null
              ) {
                setloading(true);
                createProduct();
                errors();
                // console.log("i ran");
              } else {
                errors();
              }
              // }
            }}
          >
            {!loading ? (
              props.modal.for === "edit" ? (
                "UPDATE"
              ) : (
                "ADD"
              )
            ) : (
              <CircularProgress
                size={24}
                color={"secondary"}
                // style={{ color: "white" }}
              />
            )}
          </Button>
          {/* </div> */}
        </div>
      </div>
    </Backdrop>
  );
}
