import { auth, db } from "../../constants/firestore";
import { update } from "../reducers/user/slice";

export const fetchuser = (store) => (next) => (action) => {
  console.log("i ran, middleware", action);
  if (action.type === "user") {
    // auth.onAuthStateChanged((user) => {
    //   if (user) {
    //     // User is signed in, see docs for a list of available properties
    //     // https://firebase.google.com/docs/reference/js/firebase.User
    //     var uid = user.uid;
    //     // ...
    //   } else {
    //     auth.signInWithEmailAndPassword(
    //       action.payload.email,
    //       action.payload.password
    //     );
    //     // User is signed out
    //     // ...
    //   }
    // });
    db.collection("users")
      .doc(action.payload.id)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          console.log(snapshot.data());
          // let userData = snapshot.data();
          store.dispatch(update(snapshot.data()));
        } else {
          console.log("does not exist");
        }
      });
  }
  return next(action);
};
