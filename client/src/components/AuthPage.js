import React, { useState } from "react";
import { Tabs, Tab, Paper, Box, Fade } from "@mui/material";
import Login from "./Login";
import Register from "./Register";
import Lottie from "lottie-react";
import animationData from "../Lottile/security.json";
import animationData1 from "../Lottile/ball.json";
import { useAuth } from "../Context/AuthContext";
import { styled } from "@mui/material/styles";

import { useTranslation } from "../hooks/useTranslation";

const AuthPage = ({ onLogin }) => {
  const { t } = useTranslation();
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <AuthPageBackground />
      <AuthPageContainer>
        <AuthPagePaper>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
            sx={AuthPageTabs}
          >
            <Tab label={t("auth.login")} />
            <Tab label={t("auth.register")} />
          </Tabs>
          <Fade in={activeTab === 0} timeout={300}>
            <div>{activeTab === 0 && <Login onLogin={onLogin} />}</div>
          </Fade>
          <Fade in={activeTab === 1} timeout={300}>
            <div>{activeTab === 1 && <Register onLogin={onLogin} />}</div>
          </Fade>
        </AuthPagePaper>
      </AuthPageContainer>
    </>
  );
};

export default AuthPage;

// ========== СТИЛИ ==========

const AuthPageContainer = styled("div")({
  position: "relative",
  zIndex: 1,
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const AuthPagePaper = styled("div")({
  padding: "16px",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
});

const AuthPageTabs = {
  marginBottom: "16px",
};

// ========== ГРАФИКА (ФОН) ==========

const AuthPageBackground = () => {
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
      {/* Анимация ball */}
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
