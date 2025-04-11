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
import { motion } from "framer-motion";

import welcomeAnimation from "../Lottile/Welcome.json";
import {
  HeroSection,
  StyledLottieBox,
  HighlightBlock,
  StyledQuote,
  CTAButton,
  fadeInUp,
} from "../styles/HomePageStyles";

const HomePage = ({ user }) => {
  return (
    <Container>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInUp}
      >
        <HeroSection>
          <Typography variant="h3" gutterBottom>
            Добро пожаловать, {user?.name || "гость"}!
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Всё о безопасности на спортивных объектах — просто, удобно и
            наглядно.
          </Typography>
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
