import React from "react";
import { useTranslation } from "../hooks/useTranslation";
import { List, ListItem, ListItemText, CardHeader } from "@mui/material";
import Lottie from "lottie-react";
import { styled } from "@mui/material/styles";
import { Card, Container, Typography, Link, Box } from "@mui/material";
import physical from "../Lottile/PoliceTraining.json";
import fire from "../Lottile/FireTraining.json";
import medical from "../Lottile/MedicalTraining.json";
import security from "../Lottile/CybersecurityTraining.json";
import eco from "../Lottile/EcoTraining.json";
import psycho from "../Lottile/PsychoTraining.json";
import { transform } from "framer-motion";

const animationMap = {
  physical: physical,
  fire: fire,
  medical: medical,
  information: security,
  environmental: eco,
  psychological: psycho,
};

const Training = () => {
  const { t } = useTranslation();
  const trainingData = t("trainingSections");
  const titlePageTraining = t("titlePageTraining");
  return (
    <StyledContainer>
      <Typography variant="h4" gutterBottom>
        {titlePageTraining}
      </Typography>

      {trainingData?.map((section, index) => (
        <StyledCard key={index}>
          <CardHeader
            avatar={
              <AnimationBox>
                <Lottie
                  animationData={animationMap[section.key]}
                  loop
                  autoplay
                />
              </AnimationBox>
            }
            title={
              <StyledTypographyTitle variant="h6">
                {section.title}
              </StyledTypographyTitle>
            }
          />
          <DescriptionText variant="body2">
            {section.description}
          </DescriptionText>
          <List dense>
            {section.list?.map((item, idx) => (
              <ListItem key={idx}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
          {section.resourceLink && (
            <StyledLink
              href={section.resourceLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("training more")}
            </StyledLink>
          )}
          {section.resourceLink1 && (
            <StyledLink
              href={section.resourceLink1}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("training more")}
            </StyledLink>
          )}
        </StyledCard>
      ))}
    </StyledContainer>
  );
};

export default Training;

// Стили остаются без изменений
const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[3],
  transition: "background-color 0.3s ease-in-out",
}));

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2],
  transition: "0.3s ease",
  "&:hover": {
    boxShadow: theme.shadows[6],
  },
  padding: theme.spacing(3),
}));

const StyledTypographyTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  fontSize: "1.5rem",
}));

const DescriptionText = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: theme.palette.text.secondary,
  fontSize: "1rem",
}));

const StyledLink = styled(Link)(({ theme }) => ({
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

const AnimationBox = styled(Box)(({ theme }) => ({
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
