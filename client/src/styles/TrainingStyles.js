import { styled } from "@mui/material/styles";
import { Card, Container, Typography, Link, Avatar, Box } from "@mui/material";

export const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
  transition: "background-color 0.3s ease-in-out",
}));

export const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2],
  transition: "0.3s ease",
  "&:hover": {
    boxShadow: theme.shadows[6],
  },
  padding: theme.spacing(3),
}));

export const StyledTypographyTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  fontSize: "1.5rem",
}));

export const DescriptionText = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: theme.palette.text.secondary,
  fontSize: "1rem",
}));

export const StyledLink = styled(Link)(({ theme }) => ({
  display: "inline-block",
  marginTop: theme.spacing(2),
  fontWeight: 500,
  color: theme.palette.primary.main,
  textDecoration: "underline",
  "&:hover": {
    textDecoration: "none",
  },
  marginLeft: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

export const AnimationBox = styled(Box)(({ theme }) => ({
  width: 75,
  height: 75,
  borderRadius: theme.shape.borderRadius * 2,
  backgroundColor: theme.palette.grey[100],
  boxShadow: theme.shadows[2],
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: theme.spacing(2),
}));
