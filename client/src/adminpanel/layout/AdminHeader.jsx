import React from "react";
import AdminDropdown from "../components/common/AdminDropdown";

const AdminHeader = () => {
  return (
    <header className="adminheader">
      <div className="logo-wrapper">
        {/* <img src={logo} alt="logo" /> */}
        <span className="font-bold text-3xl">StreetNet</span>
      </div>
      <div className="admin-dropdown-wrapper">
        <AdminDropdown />
      </div>
    </header>
  );
};

export default AdminHeader;
