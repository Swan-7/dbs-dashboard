import React, { useState } from "react";
import { TextField, Button, CircularProgress } from "@material-ui/core";
import { Link } from "react-router-dom";
import "./forgotpassword.css";
import ForgotImage from "./forgotpasswordImage";
export default function ForgotPassword() {
  const [values, setValues] = useState({
    email: "",
  });
  const [loading, setloading] = useState(false);
  const [error, seterror] = useState({
    message: null,
    status: false,
  });
  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <div className="forgot-password-container">
      <div className="forgot-password-container-one">
        <ForgotImage />
      </div>
      <div className="forgot-password-container-two">
        <div>
          <h1>Forgot Password?</h1>
          <h3>Enter your email to recover your password</h3>
        </div>

        <div style={{ marginTop: 15, marginBottom: 20, width: "50%" }}>
          <form className="forgot-password-form" noValidate autoComplete="off">
            <TextField
              error={error.status}
              helperText={error.message}
              id="outlined-basic"
              label="Email"
              variant="outlined"
              onChange={handleChange("email")}
            />
          </form>

          <div className="forgot-password-button-container">
            <Button
              variant="contained"
              size="large"
              color="secondary"
              onMouseDown={handleMouseDownPassword}
              disabled={loading}
              onClick={() => {
                if (
                  values.email.length > 6 &&
                  values.email.includes(".") &&
                  values.email.includes("@")
                ) {
                  setloading(true);
                  seterror({
                    message: null,
                    status: false,
                  });
                } else {
                  seterror({
                    message:
                      values.email.length < 7
                        ? "Email must be more than 6 characters"
                        : !values.email.includes(".")
                        ? "Email must contain (.)"
                        : "Email must contain (@)",
                    status: true,
                  });
                }
              }}
            >
              {!loading ? (
                "Send Email"
              ) : (
                <CircularProgress size={24} color={"secondary"} />
              )}
            </Button>
          </div>
          <div className="forgot-password-sign-container">
            <span>Remember your password?</span>
            <Link to="/signin">
              <Button
                onMouseDown={handleMouseDownPassword}
                color="primary"
                style={{ textDecorationLine: "underline" }}
              >
                Sign in
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
