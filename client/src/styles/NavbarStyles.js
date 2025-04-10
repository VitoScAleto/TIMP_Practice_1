import { styled } from "@mui/material/styles";
import { AppBar, Toolbar, Button, Typography } from "@mui/material";

export const StyledAppBar = styled(AppBar)({
  backgroundColor: "#1976d2",
});

export const StyledToolbar = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

export const StyledButton = styled(Button)({
  marginLeft: "16px",
});

export const StyledTypography = styled(Typography)({
  flexGrow: 1,
});
