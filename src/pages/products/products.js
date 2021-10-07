import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import { Snackbar } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { Alert } from "@material-ui/lab";
import firebase from "firebase";
import { useHistory } from "react-router-dom";
import { db, storage } from "../../constants/firestore";
import { userData } from "../../redux/reducers/user/slice";
// import "./home.css";

import { users } from "../../redux/reducers/users/slice";
import AddProduct from "./addproducts";
// import { Link } from "react-router-dom";

function handleClick(event) {
  event.preventDefault();
  console.info("You clicked a breadcrumb.");
}

export default function Products() {
  const history = useHistory();
  const user = useSelector(userData);
  const dispatch = useDispatch();
  const [selectedDate, setSelectedDate] = useState(null);
  const productsData = useSelector((state) => state.pharmacies.products);

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

  const [modal, setmodal] = useState({ show: false, for: "" });

  const [selectedUser, setselectedUser] = useState(null);
  const [products, setProducts] = useState([]);
  const selectedPharmacy = useSelector(
    (state) => state.pharmacies.selectedPharmacy
  );
  useEffect(() => {
    if (productsData !== null) {
      setProducts(productsData);
    }
  }, [productsData]);
  useEffect(() => {
    if (selectedPharmacy === null) {
      history.push("/");
    }
  }, [selectedPharmacy]);
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

      <MaterialTable
        // editable={{
        //   isDeleteHidden: (rowData) => rowData.status === "cancelled",
        //   // onRowUpdate: () => {},
        //   deleteTooltip: () => "Delete Product",
        //   onRowDelete: (oldData) => {
        //     db.collection("products").doc(oldData.id).delete();
        //     // .then(() => {
        //     //   setOpenSnack({
        //     //     message: "Product deleted",
        //     //     severity: "succcess",
        //     //     show: true,
        //     //   });
        //     // })
        //     // .catch((error) => {
        //     //   setOpenSnack({
        //     //     message: "An error occurred, try again. " + String(error),
        //     //     severity: "error",
        //     //     show: true,
        //     //   });
        //     // });
        //   },
        // }}
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
          // {
          //   icon: "edit",
          //   tooltip: "Edit Product",
          //   iconProps: {
          //     color: "primary",
          //   },
          //   onClick: (event, rowData) => {
          //     // Do save operation
          //     setselectedUser(rowData);
          //     setmodal({
          //       show: true,
          //       for: "edit",
          //     });
          //   },
          // },
          // {
          //   icon: "delete",
          //   tooltip: "Delete Product",
          //   onClick: (event, rowData) => {
          //     // Do save operation
          //   },
          // },
        ]}
        onRowClick={(event, rowData) => {}}
        columns={[
          { title: "Title", field: "title" },
          { title: "Price(GHC)", field: "price" },
          { title: "Quantity", field: "quantity" },

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
          Array.isArray(products) &&
          products !== undefined &&
          products !== null &&
          products.length > 0
            ? products.map((d) => ({ ...d }))
            : []
        }
        title={
          "Products of " +
          (selectedPharmacy !== null && selectedPharmacy !== undefined
            ? selectedPharmacy.title
            : "")
        }
        options={{
          actionsColumnIndex: -1,
        }}
      />
    </div>
  );
}
