import React from "react";
import { resourcesData } from "../Text/ResourceText";
import { Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Card, Container, Typography, List, ListItem } from "@mui/material";
const Resources = () => {
  return (
    <StyledContainer maxWidth="md">
      <StyledTitle variant="h1">{resourcesData.title}</StyledTitle>
      <StyledDescription variant="body1">
        {resourcesData.description}
      </StyledDescription>

      <Grid container spacing={3}>
        {resourcesData.sections.map((section, index) => (
          <Grid item xs={12} md={4} key={index}>
            <StyledCard>
              <StyledCardContent>
                <StyledCardTitle variant="h2">
                  <StyledIconWrapper>{section.icon}</StyledIconWrapper>
                  {section.title}
                </StyledCardTitle>
                <StyledList>
                  {section.items.map((item, itemIndex) => (
                    <StyledListItem key={itemIndex}>
                      <StyledLink
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {item.text}
                      </StyledLink>
                    </StyledListItem>
                  ))}
                </StyledList>
              </StyledCardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </StyledContainer>
  );
};

export default Resources;

// --- Стили вниз файла ---

export const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(6),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

export const StyledTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  fontWeight: 700,
  color: theme.palette.primary.main,
  fontSize: "2.5rem",
  textAlign: "center",
}));

export const StyledDescription = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  color: theme.palette.text.secondary,
  fontSize: "1.1rem",
  lineHeight: 1.6,
  textAlign: "center",
}));

export const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
  transition: "transform 0.3s, box-shadow 0.3s",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: theme.shadows[6],
  },
}));

export const StyledCardContent = styled("div")(({ theme }) => ({
  flexGrow: 1,
  display: "flex",
  flexDirection: "column",
}));

export const StyledCardTitle = styled(Typography)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(2),
  marginBottom: theme.spacing(2),
  fontWeight: 600,
  color: theme.palette.text.primary,
  fontSize: "1.5rem",
  minHeight: "72px",
}));

export const StyledList = styled(List)(({ theme }) => ({
  padding: 0,
  flexGrow: 1,
}));

export const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1, 0),
  minHeight: "48px",
  display: "flex",
  alignItems: "center",
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const StyledLink = styled("a")(({ theme }) => ({
  color: theme.palette.primary.main,
  textDecoration: "none",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  width: "100%",
  padding: theme.spacing(1, 0),
  "&:hover": {
    textDecoration: "underline",
    color: theme.palette.primary.dark,
  },
}));

export const StyledIconWrapper = styled("span")(({ theme }) => ({
  width: "24px",
  textAlign: "center",
}));
