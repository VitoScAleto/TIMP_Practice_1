import { styled } from "@mui/material/styles";
import { AppBar, Toolbar, Button, Typography, IconButton } from "@mui/material";

export const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: "#1976d2",
  boxShadow: theme.shadows[4],
  transition: "background-color 0.3s ease-in-out",
}));

export const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export const StyledButton = styled(Button)(({ theme }) => ({
  marginLeft: theme.spacing(2),
  transition: "background-color 0.3s",
  "&:hover": {
    backgroundColor: "#1565c0",
  },
}));

export const StyledTypography = styled(Typography)({
  flexGrow: 1,
  fontWeight: "bold",
});

export const StyledIconButton = styled(IconButton)(({ theme }) => ({
  display: "none",
  [theme.breakpoints.down("sm")]: {
    display: "block",
  },
}));
