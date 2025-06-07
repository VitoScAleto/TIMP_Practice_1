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
import { useTranslation } from "../hooks/useTranslation";
import { styled } from "@mui/material/styles";

const HomePage = () => {
  const { user } = useAuth();
  const { t } = useTranslation();

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
                key={user?.username || "guest"}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={nameAnimation}
              >
                <Typography variant="h3" gutterBottom>
                  {t("home.welcome")}, {user?.username || t("home.guest")}!
                </Typography>
              </motion.div>
            </AnimatePresence>
            <Typography variant="h6" color="text.secondary">
              {t("home.subtitle")}
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
          📌 {t("home.getStarted")}
        </Typography>
        <List>
          <ListItem>1. {t("home.step1")}</ListItem>
          <ListItem>2. {t("home.step2")}</ListItem>
          <ListItem>3. {t("home.step3")}</ListItem>
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
          <StyledQuote variant="body1">“{t("home.quote")}”</StyledQuote>
          <Typography variant="caption" display="block" textAlign="right">
            — {t("home.quoteAuthor")}
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
            {t("home.contactUs")}
          </CTAButton>
        </Box>
      </motion.div>
    </Container>
  );
};

export default HomePage;

// ================= СТИЛИ =================

const HeroSection = styled(Box)(({ theme }) => ({
  textAlign: "center",
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(6),
}));

const StyledLottieBox = styled(Box)(() => ({
  maxWidth: 300,
  margin: "0 auto",
  marginTop: 20,
}));

const HighlightBlock = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(3),
  marginTop: theme.spacing(6),
  marginBottom: theme.spacing(4),
}));

const StyledQuote = styled(Typography)(() => ({
  fontStyle: "italic",
}));

const CTAButton = styled(Button)(() => ({
  marginTop: 32,
}));

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
