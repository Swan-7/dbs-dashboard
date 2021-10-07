import { db } from "../../constants/firestore";
import { updateCategories } from "../reducers/categories/slice";

export const fetchCategories = (store) => (next) => (action) => {
  console.log("i ran, middleware categories", action);
  if (action.type === "categories") {
    db.collection("categories").onSnapshot((snapshot) => {
      if (!snapshot.empty) {
        let categories = [];
        snapshot.forEach((snap) => {
          categories.push(snap.data());
        });
        console.log(snapshot.size);
        store.dispatch(updateCategories(categories));
      } else {
        store.dispatch(updateCategories([]));
        console.log("categories does not exist");
      }
    });
  }
  return next(action);
};
