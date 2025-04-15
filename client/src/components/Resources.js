import React from "react";
import { resourcesData } from "../Text/ResourceText";
import {
  StyledContainer,
  StyledTitle,
  StyledDescription,
  StyledCard,
  StyledCardContent,
  StyledCardTitle,
  StyledList,
  StyledListItem,
  StyledLink,
  StyledIconWrapper,
} from "../styles/ResourcesStyles";
import { CardContent, Grid } from "@mui/material";

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
