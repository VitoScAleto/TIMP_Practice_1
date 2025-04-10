import React from "react";
import { Box } from "@mui/material";
import Lottie from "lottie-react";
import animationData from "../Lottile/backgroundAuthPage.json";

export const AuthPageBackground = () => {
  return (
    <Box
      sx={{
        position: "absolute", // changed from fixed
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0, // было -1, но может ломать MUI layout
        overflow: "hidden",
        pointerEvents: "none",
        opacity: 0.7,
      }}
    >
      {/* <Lottie
        animationData={animationData}
        loop
        autoplay
        style={{
          width: "100%",
          height: "100%",
        }}
      /> */}
    </Box>
  );
};
