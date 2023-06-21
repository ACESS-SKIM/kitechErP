import { Close } from '@mui/icons-material'
import { Box, Button, Grid, IconButton, MenuItem, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import { db } from '../../api/firebase';
import { collection, updateDoc, getDocs, doc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { useAppStore } from '../appStore';

export default function EditPart({ fid, closeEvent }) {
  const [partData, setPartData] = useState({
    partname: '',
    partserialname: '',
    partreused: '',
    partweight: '',
    partmemo: '',
  });
  const setRows = useAppStore((state) => state.setRows);
  const partCollectionRef = collection(db, "parts");


  useEffect(() => {
    console.log("FID: " + fid.id);
    setPartData({
      partname: fid.name,
      partserialname: fid.serialname,
      partreused: fid.reused,
      partweight: fid.weight,
      partmemo: fid.memo,
    });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPartData(prevState => ({ ...prevState, [name]: value }));
  };

  const updatePart = async () => {
    const userDoc = doc(db, 'parts', fid.id);
    const newFields = {
      name: partData.partname,
      reused: partData.partreused,
      serialname: partData.partserialname,
      weight: Number(partData.partweight),
      memo: partData.partmemo,
      date: String(new Date()),
    };
    await updateDoc(userDoc, newFields);
    getParts();
    closeEvent();
    Swal.fire("Submitted!", "Your file has been updated.", "success");
  };

  const getParts = async () => {
    const data = await getDocs(partCollectionRef);
    setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const currencies = [
    { value: 'Yes', label: 'Yes', },
    { value: 'No', label: 'No', },
  ];

  return (
    <>
      {/* 부품등록 팝업 제목부 */}
      <Box sx={{ m: 2 }} />
      <Typography variant="h4" align='center' sx={{ mb: 4 }}>
        Edit Parts
      </Typography>
      {/* 부품등록 팝업 우측 상단 닫기 아이콘 */}
      <IconButton
        style={{ position: "absolute", top: '0', right: '0' }}
        onClick={closeEvent}
      >
        <Close />
      </IconButton>
      <Box height={20} />
      <Grid container spacing={2}>
        {/* Part Name 항목 */}
        <Grid item xs={6}>
          <Typography variant="subtitle1" mb={1}>
            Name
          </Typography>
          <TextField id="outlined-basic" label="Part Name" variant="outlined" size='small' onChange={handleInputChange} value={partData.partname} name='partname' sx={{ minWidth: '100%', mb: 2 }} />
        </Grid>
        {/* Reused Part 항목 */}
        <Grid item xs={6}>
          <Typography variant="subtitle1" mb={1}>
            Reused Part
          </Typography>
          <TextField id="outlined-basic" label="Yes or No" select variant="outlined" size='small' onChange={handleInputChange} value={partData.partreused} name='partreused' sx={{ minWidth: '100%', maxWidth: '100%', mb: 2 }}>
            {currencies.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        {/* Serial Name 항목 */}
        <Grid item xs={6}>
          <Typography variant="subtitle1" mb={1}>
            Serial Name
          </Typography>
          <TextField id="outlined-basic" label="Part Serial Name" variant="outlined" size='small' onChange={handleInputChange} value={partData.partserialname} name='partserialname' sx={{ minWidth: '100%', mb: 2 }} />
        </Grid>
        {/* Part Weight 항목 */}
        <Grid item xs={6}>
          <Typography variant="subtitle1" mb={1}>
            Weight
          </Typography>
          <TextField
            id="outlined-basic"
            label="Part Weight(g)"
            variant="outlined"
            type='number'
            size='small'
            onChange={handleInputChange}
            name='partweight'
            value={partData.partweight}
            sx={{ minWidth: '100%', mb: 2 }} />
        </Grid>


        {/* Ragistrated Date 항목 */}

        {/* Memo 항목 */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" mb={1}>
            Memo
          </Typography>
          <TextField id="outlined-basic" label="Part Memo" variant="outlined" size='small' onChange={handleInputChange} value={partData.partmemo} name='partmemo' sx={{ minWidth: '100%', mb: 2 }} />
        </Grid>


        {/* Submit 버튼 */}
        <Grid item xs={12}>
          <Typography variant='h5' align='center'>
            <Button variant='contained' onClick={updatePart}>
              Submit
            </Button>
          </Typography>
        </Grid>
      </Grid >
      <Box sx={{ m: 4 }} />
    </>
  )
}