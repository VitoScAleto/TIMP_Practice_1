import { styled } from "@mui/material/styles";
import { Container, Button, TextField, Typography, Box } from "@mui/material";

export const StyledContainer = styled(Container)({
  maxWidth: "sm",
  marginTop: "20px",
});

export const StyledTypography = styled(Typography)({
  marginBottom: "28px",
});

export const StyledTextField = styled(TextField)(({ error }) => ({
  marginBottom: "28px",
  ...(error && {
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: "red" },
      "&:hover fieldset": { borderColor: "red" },
    },
    "& .MuiFormLabel-root": { color: "red" },
    "& .MuiFormHelperText-root": { color: "red" },
  }),
}));

export const StyledButton = styled(Button)({
  marginTop: "16px",
  height: "48px",
});
