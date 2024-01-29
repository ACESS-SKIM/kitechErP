import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import Recycled from './Assessment/RecycledContent/Recycled';
import CRMs from './Assessment/CRMs/CRMs';
import Recyclability from './Assessment/Recyclability/Recyclability';
import Reused from './Assessment/Reused/Reused';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      style={{ maxHeight: '90vh', overflowY: 'auto' }}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

export default function Assessment({ productID, closeEvent }) {

  console.log('Assessment productID:', productID);
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Box sx={{ m: 2 }} />
      <Typography variant="h5" align="center" sx={{ mb: 4 }}>
        Assessment
      </Typography>
      <IconButton
        style={{ position: "absolute", top: '0', right: '0' }}
        onClick={closeEvent}
      >
        <Close />
      </IconButton>
      <Tabs value={value} onChange={handleChange} variant="fullWidth">
        <Tab label="Reused Components" />
        <Tab label="Recyclability" />
        <Tab label="Recycled Material Content" />
        <Tab label="Critical Raw Materials" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Reused productID={productID} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Recyclability productID={productID} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Recycled productID={productID} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <CRMs productID={productID} />
      </TabPanel>
    </>
  );
}