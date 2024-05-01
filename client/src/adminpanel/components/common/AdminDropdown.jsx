import React from "react";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { Avatar } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { adminLogout, adminLoginCheck } from "../../../store/adminSlice";

const AdminDropdown = () => {
  const dispatch = useDispatch();
  const adminInfo = useSelector((state) => state.admin.adminInfo);

  const onClickLogout = () => {
    dispatch(adminLogout());
    dispatch(adminLoginCheck());
  };

  if (!adminInfo) return "";
  return (
    <div className="admindropdown">
      <div className="admindropdown-toggle">
        <div className="text-admin">
          {adminInfo.role === "TESTADMIN" ? "DEMO ADMIN" : "ADMIN"}
        </div>
        <div className="admin-logo">
          <Avatar
            alt={adminInfo.firstname}
            src={
              adminInfo.image ??
              `https://api.dicebear.com/5.x/avataaars/svg?seed=${adminInfo.firstname}`
            }
          />
        </div>
      </div>

      <div className="admindropdown-menu">
        <div className="hello-text">Hello, {adminInfo.firstname}!</div>
        {adminInfo.role === "TESTADMIN" && (
          <div className="main-text">
            You are using <br />
            <span className="span-test-admin">Demo Admin Account.</span>
            <br />
            <div className="span-only-view">You cannot make any changes.</div>
          </div>
        )}
        <div className="logout-btn">
          <button className="logout-btn" onClick={onClickLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDropdown;
