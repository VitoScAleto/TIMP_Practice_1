import { styled } from "@mui/material/styles";
import {
  Container,
  Button,
  Typography,
  List,
  ListItemText,
} from "@mui/material";

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
