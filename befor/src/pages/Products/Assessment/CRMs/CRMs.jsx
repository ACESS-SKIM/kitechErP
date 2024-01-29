import React, { useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import AssesProductInfo from '../AssesProductInfo';
import CRMsGraph from './CRMsGraph';
import CRMsTable2 from './CRMsTable2';
import CRMsTable3 from './CRMsTable3';


export default function CRMs({ productID }) {
  const [totalWeight, setTotalWeight] = useState(0);
  const [productWeight, setProductWeight] = useState(0);

  const handleWeights = (totalSubstanceWeight, productWeight) => {
    setTotalWeight(totalSubstanceWeight);
    setProductWeight(productWeight);
  };

  return (
    <>
      <Box sx={{ m: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" align="center" sx={{ mb: 2 }}>
              제품정보
            </Typography>
            <AssesProductInfo productID={productID} productWeight={productWeight} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" align="center" sx={{ mb: 2 }}>
              CRMs 요약 정보
            </Typography>
            <CRMsTable2 productID={productID} handleWeights={handleWeights} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" align="center" sx={{ mb: 2 }}>
              CRMs 그래프
            </Typography>
            <CRMsGraph totalWeight={totalWeight} productWeight={productWeight} />
          </Grid>
          <Grid item xs={12} style={{ height: '200px' }}>
            <Typography variant="h6" align="center" sx={{ mb: 2, mt: 4 }}>
              CRMs 세부정보
            </Typography>
            <CRMsTable3 productID={productID} productWeight={productWeight} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}