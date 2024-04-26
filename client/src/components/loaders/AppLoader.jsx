import React from "react";
import LinearProgress from "@mui/material/LinearProgress";

const AppLoader = () => {
  return (
    <div className="apploader min-w-[300px] max-w-[700px] w-1/2 h-screen absolute top-1/2 left-1/2 -translate-x-1/2">
      <div className="loader-wrapper">
        <LinearProgress
          thickness={20}
          sx={{
            width: "90%",
            height: "8px",
            borderRadius: "100px",
            backgroundColor: "#89be8e",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "#17AF26",
              borderRadius: "100px",
            },
          }}
        />
      </div>
    </div>
  );
};

export default AppLoader;
