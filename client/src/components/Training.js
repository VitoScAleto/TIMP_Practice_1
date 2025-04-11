import React from "react";
import { trainingSections } from "../Text/TrainingText";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  CardHeader,
  Box,
} from "@mui/material";
import {
  StyledContainer,
  StyledCard,
  DescriptionText,
  StyledLink,
  AnimationBox,
  StyledTypographyTitle,
} from "../styles/TrainingStyles";
import Lottie from "lottie-react";

import physical from "../Lottile/PoliceTraining.json";
import fire from "../Lottile/FireTraining.json";
import medical from "../Lottile/MedicalTraining.json";
import security from "../Lottile/CybersecurityTraining.json";
import eco from "../Lottile/EcoTraining.json";
import psycho from "../Lottile/PsychoTraining.json";

const animationMap = {
  "Физическая безопасность": physical,
  "Пожарная безопасность": fire,
  "Медицинская безопасность": medical,
  "Информационная безопасность": security,
  "Экологическая безопасность": eco,
  "Психологическая безопасность": psycho,
};

const Training = () => {
  return (
    <StyledContainer>
      <Typography variant="h4" gutterBottom>
        Обучение и тренинги
      </Typography>

      {trainingSections.map((section, index) => (
        <StyledCard key={index}>
          <CardHeader
            avatar={
              <AnimationBox>
                <Lottie
                  animationData={animationMap[section.title]}
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
            {section.list.map((item, idx) => (
              <ListItem key={idx}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
          <StyledLink
            href={section.resourceLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Подробнее
          </StyledLink>
          <StyledLink
            href={section.resourceLink1}
            target="_blank"
            rel="noopener noreferrer"
          >
            Подробнее
          </StyledLink>
        </StyledCard>
      ))}
    </StyledContainer>
  );
};

export default Training;
