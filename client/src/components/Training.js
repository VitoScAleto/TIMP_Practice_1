import React from "react";
import {
  Typography,
  Container,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const Training = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Обучение и тренинги
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="Программы обучения для персонала." />
        </ListItem>
        <ListItem>
          <ListItemText primary="Вебинары и семинары для посетителей." />
        </ListItem>
        <ListItem>
          <ListItemText primary="Рекомендации по поведению в экстренных ситуациях." />
        </ListItem>
      </List>
    </Container>
  );
};

export default Training;
