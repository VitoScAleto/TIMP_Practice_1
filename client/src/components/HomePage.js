import React from "react";
import {
  Typography,
  Container,
  Box,
  List,
  ListItem,
  Button,
  Divider,
} from "@mui/material";
import Lottie from "lottie-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../Context/AuthContext";
import welcomeAnimation from "../Lottile/Welcome.json";

import { styled } from "@mui/material/styles";
// Основной компонент
const HomePage = () => {
  const { user } = useAuth();

  return (
    <Container>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <HeroSection>
          <Box sx={{ minHeight: 48, mt: 2 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={user?.name || "guest"}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={nameAnimation}
              >
                <Typography variant="h3" gutterBottom>
                  Добро пожаловать, {user?.username || "гость"}!
                </Typography>
              </motion.div>
            </AnimatePresence>
            <Typography variant="h6" color="text.secondary">
              Всё о безопасности на спортивных объектах — просто, удобно и
              наглядно.
            </Typography>
          </Box>
          <StyledLottieBox>
            <Lottie animationData={welcomeAnimation} loop autoplay />
          </StyledLottieBox>
        </HeroSection>
      </motion.div>

      <Divider sx={{ my: 4 }} />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        custom={1}
      >
        <Typography variant="h5" gutterBottom>
          📌 С чего начать:
        </Typography>
        <List>
          <ListItem>1. Ознакомьтесь с мерами безопасности.</ListItem>
          <ListItem>2. Пройдите обучающие тренинги.</ListItem>
          <ListItem>3. Посмотрите статистику и достижения.</ListItem>
        </List>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        custom={2}
      >
        <HighlightBlock>
          <StyledQuote variant="body1">
            “Мы не просто обучаем. Мы формируем культуру безопасности в спорте.”
          </StyledQuote>
          <Typography variant="caption" display="block" textAlign="right">
            — Руководитель отдела охраны труда
          </Typography>
        </HighlightBlock>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
        custom={3}
      >
        <Box textAlign="center">
          <CTAButton
            variant="contained"
            color="primary"
            size="large"
            href="/feedback"
          >
            Связаться с нами
          </CTAButton>
        </Box>
      </motion.div>
    </Container>
  );
};

export default HomePage;

// ================= СТИЛИ =================

// Секция героя
const HeroSection = styled(Box)(({ theme }) => ({
  textAlign: "center",
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(6),
}));

// Анимация (Lottie)
const StyledLottieBox = styled(Box)(() => ({
  maxWidth: 300,
  margin: "0 auto",
  marginTop: 20,
}));

// Выделенный блок
const HighlightBlock = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(3),
  marginTop: theme.spacing(6),
  marginBottom: theme.spacing(4),
}));

// Цитата
const StyledQuote = styled(Typography)(() => ({
  fontStyle: "italic",
}));

// Кнопка
const CTAButton = styled(Button)(() => ({
  marginTop: 32,
}));

// Анимация появления
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

// Анимация имени пользователя
const nameAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};
