import { db } from "../../constants/firestore";

import { updateorders } from "../reducers/orders/slice";

export const fetchOrders = (store) => (next) => (action) => {
  if (action.type === "orders") {
    db.collection("orders")
      .orderBy("created_at", "desc")
      .onSnapshot((snapshot) => {
        if (!snapshot.empty) {
          let all = [];
          snapshot.forEach((snap) => {
            all.push(snap.data());
          });
          console.log(snapshot.size);

          store.dispatch(updateorders(all));
        } else {
          store.dispatch(updateorders([]));
          // console.log("does not exist");
        }
      });
  }
  return next(action);
};
