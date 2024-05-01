import React from "react";
import AdminDropdown from "../components/common/AdminDropdown";
import ChatIcon from "@mui/icons-material/Chat";
import { useNavigate } from "react-router-dom";

const AdminHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="adminheader">
      <div className="logo-wrapper">
        {/* <img src={logo} alt="logo" /> */}
        <span className="text-3xl font-bold">StreetNet</span>
      </div>
      <div className="admin-dropdown-wrapper">
        <div
          className="flex flex-row items-center justify-center gap-2 px-3 py-1 mr-4 border-2 border-green-800 cursor-pointer rounded-2xl chat"
          onClick={() => navigate("./chats")}
        >
          <ChatIcon className="text-green-800" fontSize="medium" />
          <span className="text-[#17AF26] text-[14px] font-[500]">CHATS</span>
        </div>
        <AdminDropdown />
      </div>
    </header>
  );
};

export default AdminHeader;
