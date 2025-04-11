import { styled } from "@mui/material/styles";
import {
  Card,
  Container,
  Typography,
  List,
  ListItem,
  TableCell,
  TableContainer,
  Accordion,
  Paper,
} from "@mui/material";

export const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(6),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
  transition: "background-color 0.3s ease-in-out",
}));

export const StyledTypographyTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  fontWeight: 700,
  color: theme.palette.text.primary,
  fontSize: "2rem",
}));

export const StyledTypographyDescription = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  color: theme.palette.text.secondary,
  fontSize: "1rem",
  lineHeight: 1.6,
}));

export const StyledAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  backgroundColor: "#fff",
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2],
  padding: theme.spacing(2),
  "&:hover": {
    boxShadow: theme.shadows[4],
  },
}));

export const StyledAccordionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 600,
}));

export const StyledList = styled(List)(({ theme }) => ({
  paddingLeft: theme.spacing(3),
  marginTop: theme.spacing(2),
}));

export const StyledListItem = styled(ListItem)(({ theme }) => ({
  paddingLeft: theme.spacing(3),
  color: theme.palette.text.primary,
}));

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(5),
  backgroundColor: "#fff",
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2],
}));

export const StyledTableCellHeader = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  fontWeight: 600,
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "0.9rem",
}));
