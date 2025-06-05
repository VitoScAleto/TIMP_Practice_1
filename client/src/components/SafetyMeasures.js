import React from "react";
import { safetyMeasuresText } from "../Text/SafetyMeasuresText";
import {
  Typography,
  ListItemText,
  Table,
  TableBody,
  TableHead,
  TableRow,
  Paper,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { styled } from "@mui/material/styles";
import {
  Card,
  Container,
  List,
  ListItem,
  TableCell,
  TableContainer,
  Accordion,
} from "@mui/material";

const SafetyMeasures = () => {
  return (
    <StyledContainer>
      <StyledTypographyTitle variant="h4" gutterBottom>
        {safetyMeasuresText.title}
      </StyledTypographyTitle>
      <StyledTypographyDescription variant="body1">
        {safetyMeasuresText.description}
      </StyledTypographyDescription>

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

// Стили внизу файла:

const StyledContainer = styled(Container)(({ theme }) => ({
  padding: theme.spacing(6),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
  transition: "background-color 0.3s ease-in-out",
}));

const StyledTypographyTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  fontWeight: 700,
  color: theme.palette.text.primary,
  fontSize: "2rem",
}));

const StyledTypographyDescription = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  color: theme.palette.text.secondary,
  fontSize: "1rem",
  lineHeight: 1.6,
}));

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  backgroundColor: "#fff",
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2],
  padding: theme.spacing(2),
  "&:hover": {
    boxShadow: theme.shadows[4],
  },
}));

const StyledAccordionTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 600,
}));

const StyledList = styled(List)(({ theme }) => ({
  paddingLeft: theme.spacing(3),
  marginTop: theme.spacing(2),
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  paddingLeft: theme.spacing(3),
  color: theme.palette.text.primary,
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  marginTop: theme.spacing(5),
  backgroundColor: "#fff",
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2],
}));

const StyledTableCellHeader = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: "#fff",
  fontWeight: 600,
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "0.9rem",
}));
