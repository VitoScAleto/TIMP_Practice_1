import React from "react";
import {
  Typography,
  Container,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

const SafetyMeasures = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Меры безопасности
      </Typography>
      <List>
        <ListItem>
          <ListItemText primary="Физическая безопасность: охрана территории, контроль доступа." />
        </ListItem>
        <ListItem>
          <ListItemText primary="Пожарная безопасность: эвакуационные планы, системы оповещения." />
        </ListItem>
        <ListItem>
          <ListItemText primary="Медицинская безопасность: наличие медицинского персонала, первичная помощь." />
        </ListItem>
      </List>
    </Container>
  );
};

export default SafetyMeasures;
