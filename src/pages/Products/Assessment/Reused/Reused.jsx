import React, { useEffect, useRef, useState } from 'react';
import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import AssesProductInfo from '../AssesProductInfo';
import ReusedTable1 from './ReusedTable1';
import ReusedGraph1 from './ReusedGraph1';
import ReusedTable2 from './ReusedTable2';
import { FileDownload } from '@mui/icons-material';
import ReactToPrint from 'react-to-print';

export default function Reused({ productID }) {
  const [reusedCount, setReusedCount] = useState(0);
  const [totalParts, setTotalParts] = useState(0);
  const componentRef = useRef(); // 참조 생성

  const handleParts = (data) => {
    // data 객체에는 reusedCount와 totalParts 값들이 있습니다.
    console.log(data);
    setReusedCount(data.reusedCount); // 상태 업데이트
    setTotalParts(data.totalParts);   // 상태 업데이트
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

      <div ref={componentRef}> {/* PDF로 변환할 컴포넌트에 참조 연결 */}
        <Typography
          variant="h6"
          component="div"
          align="center"
          sx={{ flexGrow: 1, fontSize: '2rem', marginBottom: '30px' }}
        >Reused Components</Typography>
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
      </div>
    </>
  );
}


// 참고사항
// PDF파일 다운로드 시 'yarn add react-to-print' 를 통해 라이브러리 설치
// 