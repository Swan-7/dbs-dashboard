import { db } from "../../constants/firestore";

import { updatePharmacies, updateProducts } from "../reducers/pharmacy/slice";

export const fetchPharmacies = (store) => (next) => (action) => {
  // console.log("i ran, middleware shops", action);
  if (action.type === "pharmacies") {
    console.log("pharmcies middleware");
    db.collection("pharmacies").onSnapshot((snapshot) => {
      if (!snapshot.empty) {
        let pharmacies = [];
        snapshot.forEach((snap) => {
          pharmacies.push(snap.data());
        });
        console.log(snapshot.size, "pharmacies size");
        store.dispatch(updatePharmacies(pharmacies));
      } else {
        store.dispatch(updatePharmacies([]));
        console.log("does not exist");
      }
    });
  }
  if (action.type === "selectedPharmacy") {
    console.log(store.getState(), "get state in selected Pharmacy");
    const unsub = db
      .collection("products")
      .where("pharmacy", "==", action.payload.id)
      .onSnapshot((snapshot) => {
        if (!snapshot.empty) {
          let products = [];
          snapshot.forEach((snap) => {
            products.push(snap.data());
          });
          console.log(snapshot.size, "products size");
          store.dispatch(updateProducts(products));
        } else {
          store.dispatch(updateProducts([]));
          console.log("does not exist");
        }
      });
    if (action.payload === undefined || action.payload === null) {
      unsub();
    }
  }
  return next(action);
};
