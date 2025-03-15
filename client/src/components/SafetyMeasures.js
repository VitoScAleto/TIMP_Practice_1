import React from "react";
import {
  Typography,
  Container,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  styled,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { safetyMeasuresText } from "../Text/SafetyMeasuresText";

// Стилизованные компоненты
const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: "#f5f5f5",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
}));

const StyledTypographyTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  color: "#333",
  fontWeight: "bold",
}));

const StyledTypographyDescription = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  color: "#555",
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  padding: theme.spacing(3),
}));

const StyledAccordionTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  color: "#3f51b5",
  fontWeight: "bold",
}));

const StyledList = styled(List)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  paddingLeft: theme.spacing(2),
  color: "#555",
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(4),
  backgroundColor: "#fff",
  borderRadius: "8px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
}));

const StyledTableCellHeader = styled(TableCell)(({ theme }) => ({
  backgroundColor: "#3f51b5",
  color: "#fff !important",
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: "#555",
}));

const SafetyMeasures = () => {
  return (
    <StyledContainer>
      {/* Заголовок и описание */}
      <StyledTypographyTitle variant="h4" gutterBottom>
        {safetyMeasuresText.title}
      </StyledTypographyTitle>
      <StyledTypographyDescription variant="body1">
        {safetyMeasuresText.description}
      </StyledTypographyDescription>

      {/* Секции с аккордеонами */}
      {safetyMeasuresText.sections.map((section, index) => (
        <StyledAccordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <StyledAccordionTitle variant="h6">
              {section.title}
            </StyledAccordionTitle>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" gutterBottom>
              {section.content.description}
            </Typography>
            <StyledList>
              {section.content.list.map((item, idx) => (
                <StyledListItem key={idx}>
                  <ListItemText primary={item} />
                </StyledListItem>
              ))}
            </StyledList>
          </AccordionDetails>
        </StyledAccordion>
      ))}

      {/* Таблица */}
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {safetyMeasuresText.tableData.columns.map((column, index) => (
                <StyledTableCellHeader key={index}>
                  {column}
                </StyledTableCellHeader>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {safetyMeasuresText.tableData.rows.map((row, index) => (
              <TableRow key={index}>
                {row.map((cell, idx) => (
                  <StyledTableCell key={idx}>{cell}</StyledTableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </StyledContainer>
  );
};

export default SafetyMeasures;
