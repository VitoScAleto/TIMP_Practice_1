import React, { useState } from "react";
import { Tabs, Tab, Paper, Box, Fade } from "@mui/material";
import Login from "./Login";
import Register from "./Register";
import {
  AuthPageContainer,
  AuthPagePaper,
  AuthPageTabs,
} from "../styles/AuthPageStyles";
import { AuthPageBackground } from "../styles/AuthPageGraphics";
import { useAuth } from "../Context/AuthContext";

const AuthPage = ({ onLogin }) => {
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
            <Tab label="Вход" />
            <Tab label="Регистрация" />
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
