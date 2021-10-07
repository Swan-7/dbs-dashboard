import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import ForgotPassword from "./pages/forgotpassword/ForgotPassword";
import SignIn from "./pages/signin/signin";
import { BrowserRouter } from "react-router-dom";
import { Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store/store";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <div>
          <Switch>
            <Route path="/forgot_password">
              <ForgotPassword />
            </Route>
            <Route path="/signin">
              <SignIn />
            </Route>
            <Route path="/">
              <App />
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
