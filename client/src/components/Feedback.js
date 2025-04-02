import React, { useState, useEffect } from "react";

import {
  Typography,
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import api from "../api";

const Feedback = () => {
  const [message, setMessage] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await api.get("/json/feedback");
        setFeedbackList(response.data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
      }
    };
    fetchFeedback();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      const response = await api.post("/json/feedback", { message });
      setFeedbackList([...feedbackList, response.data]);
      setMessage("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
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
        {feedbackList.map((feedback) => (
          <ListItem key={feedback.id}>
            <ListItemText
              primary={feedback.message}
              secondary={new Date(feedback.createdAt).toLocaleString()}
            />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Feedback;
