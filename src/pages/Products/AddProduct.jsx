import { Close } from '@mui/icons-material'
import { Box, Button, Grid, IconButton, MenuItem, Typography } from '@mui/material'
import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import { db } from '../../api/firebase';
import { collection, getDocs, addDoc, query, where } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { useAppStore } from '../appStore';
import { UserAuth } from '../../context/AuthContext';

export default function AddProduct({ closeEvent }) {
  const [productcategory, setProductCategory] = useState('');
  const [productname, setProductName] = useState('');
  const [productweight, setProductWeight] = useState('');
  const [productmodelname, setProductModelName] = useState('');
  const [productmemo, setProductMemo] = useState('');
  const setRows = useAppStore((state) => state.setRows);
  const empCollectionRef = collection(db, "products");
  const { user } = UserAuth();

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
      uid: user.uid,
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
    const q = query(empCollectionRef, where("uid", "==", user.uid));
    const data = await getDocs(q);
    setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };


  const currencies = [
    { value: '스마트폰', label: '스마트폰', },
    { value: '무선청소기', label: '무선청소기', },
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
          <TextField id="outlined-basic" label="Select Product Category" select variant="outlined" size='small' onChange={handleProductCategoryChange} value={productcategory} sx={{ minWidth: '100%', maxWidth: '100%', mb: 2 }}>
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
            label="Enter Product Weight"
            variant="outlined"
            type='number'
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
          <TextField id="outlined-basic" label="Enter Product Name" variant="outlined" size='small' onChange={handleProductNameChange} value={productname} sx={{ minWidth: '100%', mb: 2 }} />
        </Grid>
        {/* Product Image 항목 */}

        {/* Product Model Name 항목 */}
        <Grid item xs={6}>
          <Typography variant="subtitle1" mb={1}>
            Model Name
          </Typography>
          <TextField id="outlined-basic" label="Enter Product Model Name" variant="outlined" size='small' onChange={handleProductModelNameChange} value={productmodelname} sx={{ minWidth: '100%', mb: 2 }} />
        </Grid>
        {/* Ragistrated Date 항목 */}

        {/* Memo 항목 */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" mb={1}>
            Memo
          </Typography>
          <TextField id="outlined-basic" label="Enter Product Memo" variant="outlined" size='small' onChange={handleProductMemoChange} value={productmemo} sx={{ minWidth: '100%', mb: 2 }} />
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