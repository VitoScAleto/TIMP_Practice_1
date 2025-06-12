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
  Container,
  Button,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import api from "../api";
import { useAuth } from "../Context/AuthContext";
import { useTranslation } from "../hooks/useTranslation";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const Feedback = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const feedbackLocales = t("feedback");
  const navigate = useNavigate();
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
        const response = await api.get("/get/feedback");
        const adaptedFeedback = response.data.feedback.map((item) => ({
          id: item.feed_id,
          message: item.data_feed,
          createdAt: item.created_at,
          userId: item.user_id,
          username: item.username,
        }));
        setFeedbackList(adaptedFeedback);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        const status = error.response?.status || 500;
        const message =
          error.response?.data?.message || feedbackLocales.errorLoading;
        navigate("/error", { state: { status, message } });
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
      const response = await api.post(
        "/post/feedback",
        { message },
        { withCredentials: true }
      );

      const fb = response.data.feedback;
      const newFeedbackItem = {
        id: fb.feed_id,
        message: fb.data_feed,
        createdAt: fb.created_at,
        userId: fb.user_id,
        username: fb.username,
      };

      setFeedbackList([...feedbackList, newFeedbackItem]);
      setMessage("");
    } catch (error) {
      console.error("Error submitting feedback:", error);
      const status = error.response?.status || 500;
      const message =
        error.response?.data?.message || feedbackLocales.errorLoading;
      navigate("/error", { state: { status, message } });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await api.delete(`/delete/feedback/${deleteId}`, {
        withCredentials: true,
      });
      setFeedbackList(feedbackList.filter((fb) => fb.id !== deleteId));
      setOpenDialog(false);
    } catch (err) {
      console.error("Error deleting feedback:", err);
      const status = err.response?.status || 500;
      const message =
        err.response?.data?.message || feedbackLocales.errorLoading;
      navigate("/error", { state: { status, message } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledContainer>
      <StyledTypography variant="h4" gutterBottom>
        {feedbackLocales.title}
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
              label={feedbackLocales.inputLabel}
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
              {loading ? feedbackLocales.sending : feedbackLocales.send}
            </StyledButton>
          </form>

          <StyledTypography variant="h5" gutterBottom sx={{ mt: 4 }}>
            {feedbackLocales.myFeedback}
            <IconButton
              onClick={() => setOpenMyFeedback(!openMyFeedback)}
              disabled={loading}
              aria-label={
                openMyFeedback
                  ? feedbackLocales.hideMyFeedback
                  : feedbackLocales.showMyFeedback
              }
            >
              <ExpandMoreIcon
                style={{
                  transform: openMyFeedback ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.3s",
                }}
              />
            </IconButton>
          </StyledTypography>

          <Collapse in={openMyFeedback}>
            <StyledList>
              {feedbackList
                .filter((fb) => fb.userId === user.id)
                .map((fb) => (
                  <ListItem
                    key={fb.id}
                    secondaryAction={
                      <StyledButton
                        color="error"
                        onClick={() => {
                          setDeleteId(fb.id);
                          setOpenDialog(true);
                        }}
                        disabled={loading}
                      >
                        {feedbackLocales.delete}
                      </StyledButton>
                    }
                  >
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
                          <>
                            <strong>{fb.username}:</strong> {fb.message}
                          </>
                        )
                      }
                      secondary={new Date(fb.createdAt).toLocaleString()}
                    />
                  </ListItem>
                ))}
            </StyledList>
          </Collapse>
        </>
      ) : (
        <StyledTypography sx={{ mt: 2 }}>
          {feedbackLocales.loginPrompt}
        </StyledTypography>
      )}

      <StyledTypography variant="h5" gutterBottom sx={{ mt: 4 }}>
        {feedbackLocales.allFeedback}
      </StyledTypography>
      {loading ? (
        <StyledTypography>{feedbackLocales.loading}</StyledTypography>
      ) : (
        <List>
          {feedbackList.map((feedback) => (
            <ListItem key={feedback.id} alignItems="flex-start">
              <ListItemText
                primary={
                  <>
                    <strong>{feedback.username}:</strong> {feedback.message}
                  </>
                }
                secondary={new Date(feedback.createdAt).toLocaleString()}
              />
            </ListItem>
          ))}
        </List>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{feedbackLocales.deleteConfirmTitle}</DialogTitle>
        <DialogContent>
          <StyledTypography>
            {feedbackLocales.deleteConfirmMessage}
          </StyledTypography>
        </DialogContent>
        <DialogActions>
          <StyledButton
            onClick={() => setOpenDialog(false)}
            color="primary"
            disabled={loading}
          >
            {feedbackLocales.cancel}
          </StyledButton>
          <StyledButton onClick={handleDelete} color="error" disabled={loading}>
            {loading ? feedbackLocales.deleting : feedbackLocales.delete}
          </StyledButton>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
};

export default Feedback;

// ----------- Стили вниз файла -----------
export const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: theme.spacing(4),
  backgroundColor: "#f5f5f5",
  borderRadius: "12px",
  boxShadow: theme.shadows[4],
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
  },
}));

export const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginLeft: theme.spacing(2),
  transition: "all 0.3s",
  "&:hover": {
    backgroundColor: theme.palette.primary.dark,
    transform: "scale(1.05)",
  },
}));

export const StyledTypography = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: theme.palette.text.primary,
  fontWeight: "bold",
}));

export const StyledList = styled(List)(({ theme }) => ({
  maxHeight: 300,
  overflowY: "auto",
  marginTop: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
}));

export const StyledListItemText = styled(ListItemText)(({ theme }) => ({
  "& .MuiTypography-body1": {
    color: theme.palette.text.secondary,
  },
}));
