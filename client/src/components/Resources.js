import React from "react";
import {
  Typography,
  Container,
  List,
  ListItem,
  ListItemText,
  Link,
} from "@mui/material";

const Resources = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Полезные ресурсы
      </Typography>
      <List>
        <ListItem>
          <Link href="#" color="primary">
            Нормативные документы
          </Link>
        </ListItem>
        <ListItem>
          <Link href="#" color="primary">
            Контакты служб экстренной помощи
          </Link>
        </ListItem>
        <ListItem>
          <Link href="#" color="primary">
            Рекомендации по улучшению безопасности
          </Link>
        </ListItem>
      </List>
    </Container>
  );
};

export default Resources;
