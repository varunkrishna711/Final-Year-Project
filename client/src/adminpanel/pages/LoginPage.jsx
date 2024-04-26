import React, { useState, useEffect } from "react";
import AdminPanelInput from "../components/UI/AdminPanelInput";
import { useSelector, useDispatch } from "react-redux";
import { adminSignIn } from "../../store/adminSlice";
import { openSuccessSnackbar, openErrorSnackbar } from "../../store/modalSlice";
import "../styles/pages/loginpage.scss";

const LoginPage = () => {
  const dispatch = useDispatch();
  const isAdminLoginLoading = useSelector(
    (state) => state.admin.isAdminLoginLoading
  );

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);

  const handleEmailInput = (value) => {
    setEmail(value);
  };

  const handlePasswordInput = (value) => {
    setPassword(value);
  };

  const onClickLogin = () => {
    if (isAdminLoginLoading) return;
    console.log(email);
    console.log(password);

    dispatch(adminSignIn({ email, password })).then((data) => {
      console.log(data);
      if (data.type === "admin/adminSignIn/fulfilled") {
        dispatch(
          openSuccessSnackbar(`You are logged in as ${data.payload.role}`)
        );
      }
      if (data.type === "admin/adminSignIn/rejected") {
        dispatch(openErrorSnackbar(data.error.message));
      }
    });
  };

  return (
    <div className="loginpage">
      <div className="login-container">
        <div className="login-image">
          {/* <img src={logo} alt="logo" /> */}
          <span className="text-3xl font-bold">StreetNet</span>
        </div>
        <div className="login-inputs">
          <div>
            <AdminPanelInput
              label="Email"
              placeholder="Email..."
              onChange={handleEmailInput}
            />
          </div>
          <div>
            <AdminPanelInput
              label="Password"
              placeholder="Password..."
              type="password"
              onChange={handlePasswordInput}
            />
          </div>
        </div>
        <div className="login-button">
          <button onClick={onClickLogin}>Login</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
