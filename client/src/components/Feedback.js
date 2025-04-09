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

const Feedback = ({ user }) => {
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
      const response = await api.post("/json/feedback", {
        message,
        userId: user.id,
      });
      setFeedbackList([...feedbackList, response.data]);
      setMessage("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/json/feedback/${id}`);
      setFeedbackList(feedbackList.filter((fb) => fb.id !== id));
    } catch (err) {
      console.error("Error deleting feedback:", err);
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

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Все отзывы
      </Typography>
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

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Мои отзывы
      </Typography>
      <List>
        {feedbackList
          .filter((fb) => fb.userId === user.id)
          .map((fb) => (
            <ListItem
              key={fb.id}
              secondaryAction={
                <Button color="error" onClick={() => handleDelete(fb.id)}>
                  Удалить
                </Button>
              }
            >
              <ListItemText
                primary={fb.message}
                secondary={new Date(fb.createdAt).toLocaleString()}
              />
            </ListItem>
          ))}
      </List>
    </Container>
  );
};

export default Feedback;
