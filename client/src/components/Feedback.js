import React, { useState } from "react";
import {
  Typography,
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import axios from "axios";

const Feedback = () => {
  const [message, setMessage] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await axios.post("/api/feedback", { message });
    setFeedbackList([...feedbackList, response.data]);
    setMessage("");
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Обратная связь
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Ваш отзыв"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Отправить
        </Button>
      </form>
      <List>
        {feedbackList.map((feedback, index) => (
          <ListItem key={index}>
            <ListItemText primary={feedback.message} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Feedback;
