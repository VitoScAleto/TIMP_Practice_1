// FeedbackStyles.js
import { styled } from "@mui/material/styles";
import { Container, Button, Typography, List } from "@mui/material";

export const StyledContainer = styled(Container)({
  marginTop: "20px",
  padding: "20px",
  backgroundColor: "#f9f9f9",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
});

export const StyledButton = styled(Button)({
  marginTop: "10px",
  marginLeft: "10px",
});

export const StyledTypography = styled(Typography)({
  marginBottom: "10px",
});

export const StyledList = styled(List)({
  maxHeight: 200,
  overflowY: "auto",
  marginTop: "10px",
});
