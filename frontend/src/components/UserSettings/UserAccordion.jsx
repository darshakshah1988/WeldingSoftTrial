import * as React from 'react';
import { useState } from 'react'
import { Accordion, AccordionSummary, AccordionDetails,Typography,Box } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Sidebar from "../sidebar/Sidebar";
import UserCreationform from './UserCreate/UserCreationform';
import UserEdit from './UserEdit/UserEdit';

function UserAccordion() {
  const [expanded, setExpanded] = useState(false)
  
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <Sidebar>

      <Box sx={{ width: 700, mt:5 }}>

        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
          
          <AccordionSummary aria-controls="panel1d-content" id="panel1d-header" expandIcon={<ExpandMoreIcon />}>
            <Typography>Add New User</Typography>
          </AccordionSummary>  
          <AccordionDetails sx={{ width: "100%", height: "510px" }}>
            <UserCreationform />
          </AccordionDetails>

        </Accordion>

        <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>

          <AccordionSummary aria-controls="panel2d-content" id="panel2d-header" expandIcon={<ExpandMoreIcon />}>
            <Typography>Edit User </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <UserEdit />
          </AccordionDetails>
          
        </Accordion>

      </Box>

    </Sidebar>
  )
}

export default UserAccordion;