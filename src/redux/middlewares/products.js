import { db } from "../../constants/firestore";
import { updateCategories } from "../reducers/categories/slice";
import { updateShops } from "../reducers/shops/slice";

export const fetchShops = (store) => (next) => (action) => {
  // console.log("i ran, middleware shops", action);
  if (action.type === "products") {
    db.collection("shops")
      .where("owners", "array-contains", action.payload.id)
      .onSnapshot((snapshot) => {
        if (!snapshot.empty) {
          let shops = [];
          snapshot.forEach((snap) => {
            shops.push(snap.data());
          });
          console.log(snapshot.size);
          store.dispatch(updateShops(shops));
        } else {
          store.dispatch(updateShops([]));
          console.log("does not exist");
        }
      });
  }
  return next(action);
};
