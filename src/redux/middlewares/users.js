import { db } from "../../constants/firestore";
import { updateUsers } from "../reducers/users/slice";

export const fetchUsers = (store) => (next) => (action) => {
  // console.log("i ran, middleware", action);
  if (action.type === "users") {
    db.collection("users")
      .where("id", "!=", action.payload)
      // .where("roles", "")
      .onSnapshot((snapshot) => {
        if (!snapshot.empty) {
          let users = [];
          snapshot.forEach((snap) => {
            if (!snap.data().roles.includes("DRIVER")) {
              users.push(snap.data());
            }
          });
          // console.log(snapshot.size);
          store.dispatch(updateUsers(users));
        } else {
          store.dispatch(updateUsers([]));
          // console.log("does not exist");
        }
      });
  }
  return next(action);
};
