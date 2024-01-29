import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import AssesProductInfo from '../AssesProductInfo';
import ReusedTable1 from './ReusedTable1';
import ReusedGraph1 from './ReusedGraph1';
import ReusedTable2 from './ReusedTable2';

export default function Reused({ productID }) {
  const [reusedCount, setReusedCount] = useState(0);
  const [totalParts, setTotalParts] = useState(0);

  const handleParts = (data) => {
    // data 객체에는 reusedCount와 totalParts 값들이 있습니다.
    console.log(data);
    setReusedCount(data.reusedCount); // 상태 업데이트
    setTotalParts(data.totalParts);   // 상태 업데이트
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
              Reused 요약 정보
            </Typography>
            <ReusedTable1
              productID={productID}
              handleParts={handleParts}
            />

          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" align="center" sx={{ mb: 2 }}>
              Reused 그래프
            </Typography>
            <ReusedGraph1
              reusedCount={reusedCount}
              totalParts={totalParts}
            />

          </Grid>
          <Grid item xs={12} style={{ height: '200px' }}>
            <Typography variant="h6" align="center" sx={{ mb: 2, mt: 4 }}>
              Reused 세부정보
            </Typography>
            <ReusedTable2 productID={productID} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}