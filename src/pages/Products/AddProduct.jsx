import { Close } from '@mui/icons-material'
import { Box, Button, Grid, IconButton, MenuItem, Typography } from '@mui/material'
import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import { db } from '../../api/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { useAppStore } from '../appStore';

export default function AddProduct({ closeEvent }) {
  const [productcategory, setProductCategory] = useState('');
  const [productname, setProductName] = useState('');
  const [productweight, setProductWeight] = useState('');
  const [productmodelname, setProductModelName] = useState('');
  const [productmemo, setProductMemo] = useState('');
  const setRows = useAppStore((state) => state.setRows);
  const empCollectionRef = collection(db, "products");

  const handleProductCategoryChange = (e) => {
    setProductCategory(e.target.value);
  }

  const handleProductNameChange = (e) => {
    setProductName(e.target.value);
  }

  const handleProductWeightChange = (e) => {
    setProductWeight(e.target.value);
  }

  const handleProductModelNameChange = (e) => {
    setProductModelName(e.target.value);
  }

  const handleProductMemoChange = (e) => {
    setProductMemo(e.target.value);
  }

  const createUser = async () => {
    await addDoc(empCollectionRef, {
      category: productcategory,
      weight: Number(productweight),
      name: productname,
      modelname: productmodelname,
      memo: productmemo,
      date: String(new Date()),
    });
    getUsers();
    closeEvent();
    Swal.fire("Submitted!", "Your file has been submitted.", "success");
  };

  const getUsers = async () => {
    const data = await getDocs(empCollectionRef);
    setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };


  const currencies = [
    { value: '에어컨', label: '에어컨', },
    { value: '가정용 오븐 및 레인지후드', label: '가정용 오븐 및 레인지후드', },
    { value: '전기램프 및 등 조명기기', label: '전기램프 및 등 조명기기', },
    { value: '가정용 식기세척기', label: '가정용 식기세척기', },
    { value: '가정용 냉장고', label: '가정용 냉장고', },
    { value: '가정용 드럼 건조기', label: '가정용 드럼 건조기', },
    { value: '가정용 세탁기 및 세탁기겸 건조기', label: '가정용 세탁기 및 세탁기겸 건조기', },
    { value: '로컬 스페이스 히터', label: '로컬 스페이스 히터', },
    { value: '전문가용 냉장용 보관 캐비닛', label: '전문가용 냉장용 보관 캐비닛', },
    { value: '주거용 환기 장치', label: '주거용 환기 장치', },
    { value: '고체연료 보일러 및 고체 연료 보일러 패키지, 보조히터, 온도제어 및 태양광 장치', label: '고체연료 보일러 및 고체 연료 보일러 패키지, 보조히터, 온도제어 및 태양광 장치', },
    { value: '콤비네이션 히터, 공간 히터 패키지', label: '콤비네이션 히터, 공간 히터 패키지', },
    { value: '전자 디스플레이 및 텔레비젼', label: '전자 디스플레이 및 텔레비젼', },
    { value: '청소기', label: '청소기', },
    { value: '온수기, 온수 저장 탱크, 온수기 및 태양광 장치 패키지', label: '온수기, 온수 저장 탱크, 온수기 및 태양광 장치 패키지', },
    { value: '공기 가열 제품, 냉각 제품, 고온 공정 냉각기 및 팬 코일 장치', label: '공기 가열 제품, 냉각 제품, 고온 공정 냉각기 및 팬 코일 장치', },
    { value: '서큘레이터', label: '서큘레이터', },
    { value: '컴퓨터 및 컴퓨터 서버', label: '컴퓨터 및 컴퓨터 서버', },
    { value: '전동기', label: '전동기', },
    { value: '외부 전원 공급 장치', label: '외부 전원 공급 장치', },
    { value: '125W~500W 전기 모터로 구동되는 팬', label: '125W~500W 전기 모터로 구동되는 팬', },
    { value: '심플 셋톱 박스', label: '심플 셋톱 박스', },
    { value: '소형, 중형 및 대형 전력 변압기', label: '소형, 중형 및 대형 전력 변압기', },
    { value: '전기전자 가정 및 사무기기의 대기/오프모드 전력소비', label: '전기전자 가정 및 사무기기의 대기/오프모드 전력소비', },
    { value: '양수펌프', label: '양수펌프', },
    { value: '용접기기', label: '용접기기', },
    { value: '직판 냉장기기', label: '직판 냉장기기', },
    { value: '이동전화', label: '이동전화', },
    { value: '스마트폰', label: '스마트폰', },
    { value: '태블릿', label: '태블릿', },
    { value: 'Others', label: 'Others', },
  ];

  return (
    <>
      {/* 제품등록 팝업 제목부 */}
      <Box sx={{ m: 2 }} />
      <Typography variant="h4" align='center' sx={{ mb: 4 }}>
        Add Products
      </Typography>
      {/* 제품등록 팝업 우측 상단 닫기 아이콘 */}
      <IconButton
        style={{ position: "absolute", top: '0', right: '0' }}
        onClick={closeEvent}
      >
        <Close />
      </IconButton>
      <Box height={20} />
      <Grid container spacing={2}>
        {/* Product Category 항목 */}
        <Grid item xs={6}>
          <Typography variant="subtitle1" mb={1}>
            Category
          </Typography>
          <TextField id="outlined-basic" label="Product Category" select variant="outlined" size='small' onChange={handleProductCategoryChange} value={productcategory} sx={{ minWidth: '100%', maxWidth: '100%', mb: 2 }}>
            {currencies.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        {/* Product Weight 항목 */}
        <Grid item xs={6}>
          <Typography variant="subtitle1" mb={1}>
            Weight
          </Typography>
          <TextField
            id="outlined-basic"
            label="Product Weight"
            variant="outlined"
            type='number'
            // InputProps={{
            //   startAdornment: (
            //     <InputAdornment position="start">
            //       <AccountCircle />
            //     </InputAdornment>
            //   ),
            // }}

            size='small'
            onChange={handleProductWeightChange}
            value={productweight}
            sx={{ minWidth: '100%', mb: 2 }} />
        </Grid>
        {/* Product Name 항목 */}
        <Grid item xs={6}>
          <Typography variant="subtitle1" mb={1}>
            Name
          </Typography>
          <TextField id="outlined-basic" label="Product Name" variant="outlined" size='small' onChange={handleProductNameChange} value={productname} sx={{ minWidth: '100%', mb: 2 }} />
        </Grid>
        {/* Product Image 항목 */}

        {/* Product Model Name 항목 */}
        <Grid item xs={6}>
          <Typography variant="subtitle1" mb={1}>
            Model Name
          </Typography>
          <TextField id="outlined-basic" label="Product Model Name" variant="outlined" size='small' onChange={handleProductModelNameChange} value={productmodelname} sx={{ minWidth: '100%', mb: 2 }} />
        </Grid>
        {/* Ragistrated Date 항목 */}

        {/* Memo 항목 */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" mb={1}>
            Memo
          </Typography>
          <TextField id="outlined-basic" label="Product Memo" variant="outlined" size='small' onChange={handleProductMemoChange} value={productmemo} sx={{ minWidth: '100%', mb: 2 }} />
        </Grid>


        {/* Submit 버튼 */}
        <Grid item xs={12}>
          <Typography variant='h5' align='center'>
            <Button variant='contained' onClick={createUser}>
              Submit
            </Button>
          </Typography>
        </Grid>
      </Grid >
      <Box sx={{ m: 4 }} />
    </>
  )
}