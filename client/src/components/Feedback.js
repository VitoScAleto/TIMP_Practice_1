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
import { useAuth } from "../Context/AuthContext";
import {
  StyledContainer,
  StyledButton,
  StyledTypography,
  StyledList,
  StyledListItemText,
} from "../styles/FeedbackStyles";

const Feedback = () => {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [feedbackList, setFeedbackList] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editMessage, setEditMessage] = useState("");
  const [editId, setEditId] = useState(null);
  const [openMyFeedback, setOpenMyFeedback] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setLoading(true);
        const response = await api.get("/json/feedback");
        setFeedbackList(response.data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setError("Не удалось загрузить отзывы");
      } finally {
        setLoading(false);
      }
    };
    fetchFeedback();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      setLoading(true);
      const response = await api.post("/json/feedback", {
        message,
        userId: user.id,
      });
      setFeedbackList([...feedbackList, response.data]);
      setMessage("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setError("Не удалось отправить отзыв");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/json/feedback/${deleteId}`);
      setFeedbackList(feedbackList.filter((fb) => fb.id !== deleteId));
      setOpenDialog(false);
    } catch (err) {
      console.error("Error deleting feedback:", err);
      setError("Не удалось удалить отзыв");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (id) => {
    if (!editMessage.trim()) return;

    try {
      setLoading(true);
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
      setError("Не удалось изменить отзыв");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledContainer>
      <StyledTypography variant="h4" gutterBottom>
        Обратная связь
      </StyledTypography>

      {error && (
        <StyledTypography color="error" sx={{ mb: 2 }}>
          {error}
        </StyledTypography>
      )}

      {user ? (
        <>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Ваш отзыв"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              fullWidth
              margin="normal"
              variant="outlined"
              disabled={loading}
            />
            <StyledButton
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? "Отправка..." : "Отправить"}
            </StyledButton>
          </form>

          {/* Мои отзывы */}
          <StyledTypography variant="h5" gutterBottom sx={{ mt: 4 }}>
            Мои отзывы
            <IconButton
              onClick={() => setOpenMyFeedback(!openMyFeedback)}
              disabled={loading}
            >
              <ExpandMoreIcon />
            </IconButton>
          </StyledTypography>

          <Collapse in={openMyFeedback}>
            <StyledList>
              {feedbackList
                .filter((fb) => fb.userId === user.id)
                .map((fb) => (
                  <ListItem key={fb.id}>
                    <StyledListItemText
                      primary={
                        editId === fb.id ? (
                          <TextField
                            value={editMessage}
                            onChange={(e) => setEditMessage(e.target.value)}
                            fullWidth
                            variant="outlined"
                            disabled={loading}
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
                      disabled={loading}
                    >
                      {editId === fb.id ? "Сохранить" : "Изменить"}
                    </StyledButton>
                    <StyledButton
                      color="error"
                      onClick={() => {
                        setDeleteId(fb.id);
                        setOpenDialog(true);
                      }}
                      disabled={loading}
                    >
                      Удалить
                    </StyledButton>
                  </ListItem>
                ))}
            </StyledList>
          </Collapse>
        </>
      ) : (
        <StyledTypography sx={{ mt: 2 }}>
          Для отправки отзыва необходимо войти в систему.
        </StyledTypography>
      )}

      {/* Все отзывы */}
      <StyledTypography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Все отзывы
      </StyledTypography>
      {loading ? (
        <StyledTypography>Загрузка...</StyledTypography>
      ) : (
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
      )}

      {/* Диалог удаления */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Подтверждение удаления</DialogTitle>
        <DialogContent>
          <StyledTypography>
            Вы уверены, что хотите удалить этот отзыв?
          </StyledTypography>
        </DialogContent>
        <DialogActions>
          <StyledButton
            onClick={() => setOpenDialog(false)}
            color="primary"
            disabled={loading}
          >
            Отмена
          </StyledButton>
          <StyledButton onClick={handleDelete} color="error" disabled={loading}>
            {loading ? "Удаление..." : "Удалить"}
          </StyledButton>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
};

export default Feedback;
