import {
  Typography,
  Container,
  List,
  ListItem,
  TableCell,
  TableContainer,
  Accordion,
  styled,
} from "@mui/material";

export const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: "#f5f5f5",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
}));

export const StyledTypographyTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  color: "#333",
  fontWeight: "bold",
}));

export const StyledTypographyDescription = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  color: "#555",
}));

export const StyledAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  padding: theme.spacing(3),
}));

export const StyledAccordionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: "#3f51b5",
  fontWeight: "bold",
}));

export const StyledList = styled(List)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
}));

export const StyledListItem = styled(ListItem)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  color: "#555",
}));

export const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(4),
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
}));

export const StyledTableCellHeader = styled(TableCell)(({ theme }) => ({
  backgroundColor: "#3f51b5",
  color: "#fff !important",
}));

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: "#555",
}));
