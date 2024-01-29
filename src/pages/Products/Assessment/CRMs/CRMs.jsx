import React, { useRef, useState } from 'react';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import AssesProductInfo from '../AssesProductInfo';
import CRMsGraph from './CRMsGraph';
import CRMsTable2 from './CRMsTable2';
import CRMsTable3 from './CRMsTable3';
import ReactToPrint from 'react-to-print';
import { FileDownload } from '@mui/icons-material';


export default function CRMs({ productID }) {
  const [totalWeight, setTotalWeight] = useState(0);
  const [productWeight, setProductWeight] = useState(0);
  const componentRef = useRef(); // 참조 생성

  const handleWeights = (totalSubstanceWeight, productWeight) => {
    setTotalWeight(totalSubstanceWeight);
    setProductWeight(productWeight);
  };

  return (
    <>
      <div>
        {/* 다운로드 버튼*/}
        <Box height={10} />
        <Stack direction="row" spacing={2} className="my-2 mb-2">
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          ></Typography>
          <ReactToPrint
            trigger={() => <Button variant="contained" endIcon={<FileDownload />} sx={{
              backgroundColor: '#6AA7FF', // 배경색 설정
              color: 'white', // 글자색 설정
              '&:hover': {
                backgroundColor: '#5a95e5', // Optional: 호버 상태일 때의 배경색 변경
                color: 'white'
              }
            }}>Save</Button>}
            content={() => componentRef.current}
          />
        </Stack>
        <Box height={10} />
      </div>

      <div ref={componentRef}> {/* PDF로 변환할 컴포넌트에 참조 연결 -> 여기서부터 인쇄영역임 */}

        <Typography
          variant="h6"
          component="div"
          align="center"
          sx={{ flexGrow: 1, fontSize: '2rem', marginBottom: '30px' }}
        >Critical Raw Materials</Typography>
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
      </div>
    </>
  );
}