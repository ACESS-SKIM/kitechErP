import React, { useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import AssesProductInfo from '../AssesProductInfo';
import RecyclabilityTable1 from './RecyclabilityTable1';
import RecyclabilityGraph1 from './RecyclabilityGraph1';
import RecyclabilityTable2 from './RecyclabilityTable2';

export default function Recyclability({ productID }) {

  const [results, setResults] = useState({
    otherPartValue: 0,
    preTreatmentValue: 0,
    batteryValue: 0,
    pcbAssemblyValue: 0,
    externalElecCableValue: 0,
    phoneOtherPartValue: 0,
    phoneMonoValue: 0,
    phoneBatteryValue: 0
  });



  const handleResults = (data) => {
    setResults(data);
  };


  return (
    <>
      <Box sx={{ m: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" align="center" sx={{ mb: 2 }}>
              제품정보
            </Typography>
            <AssesProductInfo productID={productID} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" align="center" sx={{ mb: 2 }}>
              Recyclability 요약 정보
            </Typography>
            <RecyclabilityTable1 productID={productID} onResultsCalculated={handleResults} />

          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" align="center" sx={{ mb: 2 }}>
              Recyclability 그래프
            </Typography>
            <RecyclabilityGraph1 productID={productID} results={results} />

          </Grid>
          <Grid item xs={12} style={{ height: '200px' }}>
            <Typography variant="h6" align="center" sx={{ mb: 2, mt: 4 }}>
              Recycled Contents 세부정보
            </Typography>
            <RecyclabilityTable2 productID={productID} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}