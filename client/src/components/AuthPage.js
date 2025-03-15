import React, { useState } from "react";
import { Tabs, Tab, Paper, Grid, Fade } from "@mui/material";
import Login from "./Login";
import Register from "./Register";
import { authPageStyles } from "../styles/AuthPageStyles"; // Импорт стилей
import { AuthPageBackground } from "../styles/AuthPageGraphics"; // Импорт фона

const AuthPage = ({ setIsAuthenticated }) => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <>
      <AuthPageBackground /> {/* Добавление фонового изображения */}
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={authPageStyles.container} // Использование стилей
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
                  <Login setIsAuthenticated={setIsAuthenticated} />
                )}
              </div>
            </Fade>
            <Fade in={activeTab === 1} timeout={300}>
              <div>
                {activeTab === 1 && (
                  <Register setIsAuthenticated={setIsAuthenticated} />
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
