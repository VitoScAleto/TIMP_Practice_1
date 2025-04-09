import React, { useState } from "react";
import { Tabs, Tab, Paper, Grid, Fade } from "@mui/material";
import Login from "./Login";
import Register from "./Register";
import { authPageStyles } from "../styles/AuthPageStyles";
import { AuthPageBackground } from "../styles/AuthPageGraphics";

const AuthPage = ({ setIsAuthenticated, setUser }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <AuthPageBackground />
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={authPageStyles.container}
      >
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <Paper elevation={3} sx={authPageStyles.paper}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              indicatorColor="primary"
              textColor="primary"
              sx={authPageStyles.tabs}
            >
              <Tab label="Вход" />
              <Tab label="Регистрация" />
            </Tabs>
            <Fade in={activeTab === 0} timeout={300}>
              <div>
                {activeTab === 0 && (
                  <Login
                    setIsAuthenticated={setIsAuthenticated}
                    setUser={setUser}
                  />
                )}
              </div>
            </Fade>
            <Fade in={activeTab === 1} timeout={300}>
              <div>
                {activeTab === 1 && (
                  <Register
                    setIsAuthenticated={setIsAuthenticated}
                    setUser={setUser}
                  />
                )}
              </div>
            </Fade>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default AuthPage;
