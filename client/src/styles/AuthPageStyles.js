import { styled } from "@mui/material/styles";

export const AuthPageContainer = styled("div")({
  position: "relative",
  zIndex: 1,
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export const AuthPagePaper = styled("div")({
  padding: "16px",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
});

export const AuthPageTabs = {
  marginBottom: "16px",
};
