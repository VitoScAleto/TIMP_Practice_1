import React, { useState, useEffect } from "react";
import {
  TextField,
  ListItem,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Collapse,
  IconButton,
  List,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import api from "../api";
import {
  StyledContainer,
  StyledButton,
  StyledTypography,
  StyledList,
} from "../styles/FeedbackStyles";

const Feedback = ({ user }) => {
  const [message, setMessage] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editMessage, setEditMessage] = useState("");
  const [editId, setEditId] = useState(null);
  const [openMyFeedback, setOpenMyFeedback] = useState(false);

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

  const handleDelete = async () => {
    try {
      await api.delete(`/json/feedback/${deleteId}`);
      setFeedbackList(feedbackList.filter((fb) => fb.id !== deleteId));
      setOpenDialog(false);
    } catch (err) {
      console.error("Error deleting feedback:", err);
    }
  };

  const handleEdit = async (id) => {
    if (!editMessage.trim()) return;

    try {
      const response = await api.put(`/json/feedback/${id}`, {
        message: editMessage,
      });
      setFeedbackList(
        feedbackList.map((fb) => (fb.id === id ? response.data : fb))
      );
      setEditMessage("");
      setEditId(null);
    } catch (error) {
      console.error("Error editing feedback:", error);
    }
  };

  return (
    <StyledContainer>
      <StyledTypography variant="h4" gutterBottom>
        Обратная связь
      </StyledTypography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Ваш отзыв"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          fullWidth
          margin="normal"
        />
        <StyledButton type="submit" variant="contained" color="primary">
          Отправить
        </StyledButton>
      </form>
      <StyledTypography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Мои отзывы
        <IconButton onClick={() => setOpenMyFeedback(!openMyFeedback)}>
          <ExpandMoreIcon />
        </IconButton>
      </StyledTypography>
      <Collapse in={openMyFeedback}>
        <StyledList>
          {feedbackList
            .filter((fb) => fb.userId === user.id)
            .map((fb) => (
              <ListItem key={fb.id}>
                <ListItemText
                  primary={
                    editId === fb.id ? (
                      <TextField
                        value={editMessage}
                        onChange={(e) => setEditMessage(e.target.value)}
                        fullWidth
                      />
                    ) : (
                      fb.message
                    )
                  }
                  secondary={new Date(fb.createdAt).toLocaleString()}
                />
                <StyledButton
                  color="primary"
                  onClick={() => {
                    if (editId === fb.id) {
                      handleEdit(fb.id);
                    } else {
                      setEditId(fb.id);
                      setEditMessage(fb.message);
                    }
                  }}
                >
                  {editId === fb.id ? "Сохранить" : "Изменить"}
                </StyledButton>
                <StyledButton
                  color="error"
                  onClick={() => {
                    setDeleteId(fb.id);
                    setOpenDialog(true);
                  }}
                >
                  Удалить
                </StyledButton>
              </ListItem>
            ))}
        </StyledList>
      </Collapse>

      <StyledTypography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Все отзывы
      </StyledTypography>
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

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <StyledTypography>
            Вы уверены, что хотите удалить этот отзыв?
          </StyledTypography>
        </DialogContent>
        <DialogActions>
          <StyledButton onClick={() => setOpenDialog(false)} color="primary">
            Отмена
          </StyledButton>
          <StyledButton onClick={handleDelete} color="error">
            Удалить
          </StyledButton>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
};

export default Feedback;
