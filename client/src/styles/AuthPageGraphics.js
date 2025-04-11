import React from "react";
import { Box } from "@mui/material";
import Lottie from "lottie-react";
import animationData from "../Lottile/security.json";
import animationData1 from "../Lottile/ball.json";

export const AuthPageBackground = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: "300px",
        width: "100%",
        height: "100%",
        zIndex: -1,
        overflow: "hidden",
        pointerEvents: "none",
        opacity: 0.7,
      }}
    >
      {/* Анимация security */}
      <Box
        sx={{
          position: "absolute",
          width: "50%",
          height: "100%",
          zIndex: 2,
          right: "250px",
        }}
      >
        <Lottie
          animationData={animationData}
          loop
          autoplay
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </Box>
      {/* Мяч */}
      <Box
        sx={{
          position: "fixed",
          right: "1000px",
          width: "40%",
          height: "100%",
          zIndex: 1,
        }}
      >
        <Lottie
          animationData={animationData1}
          loop
          autoplay
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </Box>
    </Box>
  );
};
