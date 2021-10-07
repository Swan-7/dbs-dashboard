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
// import "./signup.css";
import { difference } from "lodash";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { auth, db, fieldValue, storage } from "../../constants/firestore";
import { useSelector, useDispatch } from "react-redux";
import { update, userData } from "../../redux/reducers/user/slice";
import { categories } from "../../redux/reducers/categories/slice";
import { campus } from "../../redux/reducers/campus/slice";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import axios from "axios";
import { shops } from "../../redux/reducers/pharmacy/slice";

export function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function AddPharmacy(props) {
  const history = useHistory();
  const user = useSelector(userData);
  const selectedPharmacy = useSelector(
    (state) => state.pharmacies.selectedPharmacy
  );
  const [owner, setowner] = useState({
    id: "",
  });

  const [modal, setmodal] = useState({ show: false, for: "" });
  const [values, setValues] = useState({
    title: "",
    quantity: "",
    is_active: "yes",
    id: "",
    price: "",
  });
  const [type, settype] = useState("SHOP");
  const reset = () => {
    setValues({
      title: "",
      quantity: "",

      is_active: "yes",

      added_by: "",

      id: "",
      pharmacy: "",
      pharmacyInfo: {
        title: "",
        contact: "",
        location: null,
      },
    });
  };
  const [titleError, settitleError] = useState({
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
      status: Number(values.quantity) === 0,
      message:
        Number(values.quantity) === 0
          ? "Quantity must be greater than zero"
          : "",
    });
  };

  useEffect(() => {
    console.log(selectedPharmacy, "selected pharmacy in products add");
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
    const productDBRef = db.collection("products").doc();

    productDBRef
      .set({
        title: values.title,
        quantity: Number(values.quantity),
        price: Number(Number(values.price).toFixed(2)),
        is_active: values.is_active === "yes" ? true : false,
        added_by: user.user.id,
        id: productDBRef.id,
        created_at: date,
        pharmacy: selectedPharmacy.id,
        price: values.price,
        pharmacy_info: {
          title: selectedPharmacy.title,
          contact: selectedPharmacy.contact,
          location: selectedPharmacy.location,
        },
      })
      .then(() => {
        setOpenSnack({
          message: `Product uploaded successfully`,
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
  const updateShop = () => {
    let isActive = values.is_active === "yes" ? true : false;
    // let dif = difference(props.user.roles, userRole);
    if (
      values.title !== props.editData.title ||
      values.phone_number !== props.user.phone_number ||
      isActive !== props.user.is_active
      // || dif.length > 0
    ) {
      let id = user.user.id;
      let shopRef = db.collection("shops").doc(props.user.id);
      setloading(true);
      shopRef
        .update({
          title: values.title,
          phone_number: values.phone_number,
          description: values.description,
          is_active: values.is_active === "yes" ? true : false,

          location: values.location,
          added_by: user.user.id,
          campus: values.campus,
          category: values.category,
          id: shopRef.id,
          owners: fieldValue.arrayUnion(owner.id),
          type: type,
          updated: fieldValue.arrayUnion({
            on: new Date().getTime(),
            by: id,
          }),
        })
        .then((docRef) => {
          setloading(false);
          setOpenSnack({
            message: "Account updated successfully",
            show: true,
            severity: "success",
          });
          props.close();
          reset();
          // console.log("Document written with ID: ", docRef.id);
        })
        .catch((error) => {
          setloading(false);
          setOpenSnack({
            message: error,
            show: true,
            severity: "error",
          });
          console.error("Error updating document: ", error);
        });
    } else {
      setOpenSnack({
        message: "No Changes made yet, make changes to update user",
        show: true,
        severity: "error",
      });
    }
  };
  useEffect(() => {
    console.log(props.user, "userDataval");
  }, [props.user]);
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
          {props.modal.for === "edit" ? "EDIT" : "ADD PRODUCT"}
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
              label="Price"
              inputProps={{
                maxLength: 10,
              }}
              variant="outlined"
              error={priceError.status}
              helperText={priceError.message}
              value={values.price}
              onChange={handleChange("price")}
            />
            <TextField
              id="outlined-basic"
              label="Quantity"
              inputProps={{
                maxLength: 10,
              }}
              variant="outlined"
              error={priceError.status}
              helperText={priceError.message}
              value={values.quantity}
              onChange={handleChange("quantity")}
            />

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
              if (Number(values.quantity) > 0 && values.title.length > 1) {
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
