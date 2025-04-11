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
import {
  StyledContainer,
  StyledTypographyTitle,
  StyledTypographyDescription,
  StyledAccordion,
  StyledAccordionTitle,
  StyledList,
  StyledListItem,
  StyledTableContainer,
  StyledTableCellHeader,
  StyledTableCell,
} from "../styles/SafetyMeasuresStyles";

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
