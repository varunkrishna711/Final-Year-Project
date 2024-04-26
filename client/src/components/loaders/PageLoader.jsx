import React from "react";
import CircularProgress from "@mui/material/CircularProgress";

const PageLoader = () => {
  return (
    <div className="!h-screen pageloader-wrapper">
      <div className="pageloader">
        <div className="loader-wrapper">
          <CircularProgress sx={{ color: "#17AF26" }} size={83} thickness={4} />
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
