import React, { useState } from "react";
import { Typography, Container, TextField, Button } from "@mui/material";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post("/api/login", { email, password });
    console.log(response.data);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Вход
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Пароль"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Войти
        </Button>
      </form>
    </Container>
  );
};

export default Login;
