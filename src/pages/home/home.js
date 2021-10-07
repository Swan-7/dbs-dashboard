import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import {
  Snackbar,
  Backdrop,
  IconButton,
  Icon,
  FormHelperText,
  Button,
  CircularProgress,
  Breadcrumbs,
  Link,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { Alert } from "@material-ui/lab";
import firebase from "firebase";
import { useHistory } from "react-router-dom";
import { db, storage } from "../../constants/firestore";
import { userData } from "../../redux/reducers/user/slice";
// import "./home.css";

import { users } from "../../redux/reducers/users/slice";
import {
  shops,
  updateOwner,
  updateSelectedPharmacy,
  updateShops,
} from "../../redux/reducers/pharmacy/slice";
import AddProduct from "./addpharmacy";
// import { Link } from "react-router-dom";

function handleClick(event) {
  event.preventDefault();
  console.info("You clicked a breadcrumb.");
}

export default function Home() {
  const history = useHistory();
  const user = useSelector(userData);
  const pharmacies = useSelector((state) => state.pharmacies.pharmacies);
  const dispatch = useDispatch();
  const usersList = useSelector(users);
  const [page, setpage] = useState("feed");
  const [values, setValues] = useState({
    full_name: "",
    phone_number: "",
    email: "",
    is_active: "",
    roles: "",
    id: "",
  });
  const [selectedDate, setSelectedDate] = useState(null);
  const [products, setproducts] = useState([]);

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
  const [modal, setmodal] = useState({ show: false, for: "" });
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
  const [usersDataList, setusersDataList] = useState([]);

  const handleCloseModal = () => {
    setmodal({ show: false, for: "" });
  };
  const handleModalToggle = (f) => {
    setmodal({
      show: !modal.show,
      for: f,
    });
  };
  const [loadingImage, setloadingImage] = useState(false);

  const updateUser = () => {
    let userDataVal = user.user;
    if (
      userDataVal.first_name !== values.first_name ||
      userDataVal.last_name !== values.last_name ||
      userDataVal.profession !== values.profession ||
      userDataVal.gender !== values.gender ||
      (values.short_background !== null &&
        values.short_background !== undefined &&
        values.short_background.length > 10 &&
        values.short_background !== userDataVal.short_background)
    ) {
      db.collection("users")
        .doc(userDataVal.id)
        .update({
          first_name: values.first_name.trim(),
          last_name: values.last_name.trim(),
          gender: values.gender,
          profession: values.profession.trim(),
          short_background:
            values.short_background !== undefined
              ? values.short_background
              : "",
          dob:
            selectedDate.getFullYear() - new Date().getFullYear() > 15
              ? selectedDate
              : null,
        })
        .then(() => {
          setloading(false);

          setOpenSnack({
            message: "Profile update successfully",
            severity: "success",
            show: true,
          });
        })
        .catch((error) => {
          setloading(false);

          setOpenSnack({
            message: error,
            severity: "error",
            show: true,
          });
        });
    } else {
      setloading(false);
      setOpenSnack({
        message: "No changes in Profile data, make changes to update",
        severity: "error",
        show: true,
      });
    }
  };
  const [deleteDialog, setdeleteDialog] = useState(true);
  const [selectedUser, setselectedUser] = useState(null);
  const [pharmaciesData, setpharmaciesData] = useState([]);
  useEffect(() => {
    if (pharmacies !== null) {
      console.log(pharmacies, "Pharmacies");
      setpharmaciesData(pharmacies);
    }
  }, [pharmacies]);
  return (
    <div style={{ maxWidth: "100%" }}>
      <Snackbar
        style={{ zIndex: 99999999 }}
        open={openSnack.show}
        autoHideDuration={2500}
        onClose={handleSnackClose}
      >
        <Alert onClose={handleSnackClose} severity={openSnack.severity}>
          {openSnack.message}
        </Alert>
      </Snackbar>
      <AddProduct
        modal={modal}
        user={selectedUser}
        close={() => {
          setmodal({
            show: false,
            for: "",
          });
          setselectedUser(null);
        }}
      />

      {/* <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/signin" onClick={handleClick}>
          Material-UI
        </Link>
        <Link
          color="inherit"
          href="/getting-started/installation/"
          onClick={handleClick}
        >
          Core
        </Link>
        <Link
          color="textPrimary"
          href="/components/breadcrumbs/"
          onClick={handleClick}
          aria-current="page"
        >
          Breadcrumb
        </Link>
      </Breadcrumbs> */}
      <MaterialTable
        actions={[
          {
            isFreeAction: true,
            icon: "add",
            tooltip: "Add Product",
            onClick: (event, rowData) => {
              // Do save operation
              setmodal({
                for: "product",
                show: true,
              });
            },
          },
          {
            icon: "edit",
            tooltip: "Edit Product",
            iconProps: {
              color: "primary",
            },
            onClick: (event, rowData) => {
              // Do save operation
              setselectedUser(rowData);
              setmodal({
                show: true,
                for: "edit",
              });
            },
          },
          // {
          //   icon: "delete",
          //   tooltip: "Delete User",
          //   onClick: (event, rowData) => {
          //     // Do save operation
          //   },
          // },
        ]}
        onRowClick={(event, rowData) => {
          dispatch({
            type: "selectedPharmacy",
            payload: { id: rowData.id },
          });
          dispatch(updateSelectedPharmacy(rowData));
          history.push(`/${rowData.title}/products`);
        }}
        columns={[
          { title: "Title", field: "title" },
          { title: "Location", field: "location.name" },
          { title: "Contact", field: "contact" },
          {
            title: "Active",
            field: "is_active",
            cellStyle: (data, rowData) => ({
              color: data ? "green" : "red",
              fontWeight: "bold",
            }),
          },
        ]}
        data={
          Array.isArray(pharmaciesData) &&
          pharmaciesData !== undefined &&
          pharmaciesData !== null &&
          pharmaciesData.length > 0
            ? pharmaciesData.map((d) => ({ ...d }))
            : []
        }
        title="Pharmacies"
        options={{
          actionsColumnIndex: -1,
        }}
      />
    </div>
  );
}
