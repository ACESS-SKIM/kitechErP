import React, { useState } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import AssesProductInfo from '../AssesProductInfo';
import RecycledTable1 from './RecycledTable1';
import RecycledGraph from './RecycledGraph';
import RecycledTable2 from './RecycledTable2';

export default function Recycled({ productID }) {
  const [productWeight, setProductWeight] = useState(0);
  // Recycled 컴포넌트에서 state 추가
  const [preConsumerValue, setPreConsumerValue] = useState(0);
  const [postConsumerValue, setPostConsumerValue] = useState(0);
  const [unspecifiedValue, setUnspecifiedValue] = useState(0);
  const [preConsumerRatio, setPreConsumerRatio] = useState(0);
  const [postConsumerRatio, setPostConsumerRatio] = useState(0);
  const [unSpecifiedRatio, setUnSpecifiedRatio] = useState(0);


  const handleWeights = (weights) => {
    const { preConsumerValue,
      postConsumerValue,
      unspecifiedValue,
      preConsumerRatio,
      postConsumerRatio,
      unSpecifiedRatio,
      productWeight } = weights;

    console.log("Recycled - productWeight:", productWeight);
    setProductWeight(productWeight);
    updatePreConsumerValue(preConsumerValue);
    updatePostConsumerValue(postConsumerValue);
    updateUnspecifiedValue(unspecifiedValue);
    updatePreConsumerRatio(preConsumerRatio);
    updatePostConsumerRatio(postConsumerRatio);
    updateUnSpecifiedRatio(unSpecifiedRatio);
  };

  const updatePreConsumerValue = (value) => {
    console.log("preConsumerValue:", value);
    setPreConsumerValue(value);
  };

  const updatePostConsumerValue = (value) => {
    console.log("postConsumerValue:", value);
    setPostConsumerValue(value);
  };

  const updateUnspecifiedValue = (value) => {
    console.log("unspecifiedValue:", value);
    setUnspecifiedValue(value);
  };

  const updatePreConsumerRatio = (value) => {
    console.log("preConsumerRatio:", value);
    setPreConsumerRatio(value);
  };

  const updatePostConsumerRatio = (value) => {
    console.log("postConsumerRatio:", value);
    setPostConsumerRatio(value);
  };

  const updateUnSpecifiedRatio = (value) => {
    console.log("unSpecifiedRatio:", value);
    setUnSpecifiedRatio(value);
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
              Recycled Contents 요약 정보
            </Typography>
            <RecycledTable1
              productID={productID}
              handleWeights={handleWeights}
              setPreConsumerValue={updatePreConsumerValue}
              setPostConsumerValue={updatePostConsumerValue}
              setUnspecifiedValue={updateUnspecifiedValue}
              setPreConsumerRatio={updatePreConsumerRatio}
              setPostConsumerRatio={updatePostConsumerRatio}
              setUnSpecifiedRatio={updateUnSpecifiedRatio}
            />

          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" align="center" sx={{ mb: 2 }}>
              Recycled Contents 그래프
            </Typography>
            <RecycledGraph
              productWeight={productWeight}
              preConsumerValue={preConsumerValue}
              postConsumerValue={postConsumerValue}
              unspecifiedValue={unspecifiedValue}
              preConsumerRatio={preConsumerRatio}
              postConsumerRatio={postConsumerRatio}
              unSpecifiedRatio={unSpecifiedRatio}
            />

          </Grid>
          <Grid item xs={12} style={{ height: '200px' }}>
            <Typography variant="h6" align="center" sx={{ mb: 2, mt: 4 }}>
              Recycled Contents 세부정보
            </Typography>
            <RecycledTable2 productID={productID} productWeight={productWeight} />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}