import { styled } from "@mui/material/styles";
import { Box, Typography, Button } from "@mui/material";

export const HeroSection = styled(Box)(({ theme }) => ({
  textAlign: "center",
  paddingTop: theme.spacing(8),
  paddingBottom: theme.spacing(6),
}));

export const StyledLottieBox = styled(Box)(() => ({
  maxWidth: 300,
  margin: "0 auto",
  marginTop: 20,
}));

export const HighlightBlock = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(3),
  marginTop: theme.spacing(6),
  marginBottom: theme.spacing(4),
}));

export const StyledQuote = styled(Typography)(() => ({
  fontStyle: "italic",
}));

export const CTAButton = styled(Button)(() => ({
  marginTop: 32,
}));

export const fadeInUp = {
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

export const nameAnimation = {
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
