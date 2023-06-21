import { Close } from '@mui/icons-material'
import { Box, Button, Grid, IconButton, MenuItem, Typography } from '@mui/material'
import React, { useState } from 'react'
import TextField from '@mui/material/TextField';
import { db } from '../../api/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { useAppStore } from '../appStore';

export default function AddPart({ closeEvent }) {
  const [partname, setPartName] = useState('');
  const [partserialname, setPartSerialName] = useState('');
  const [partreused, setPartReused] = useState('');
  const [partweight, setPartWeight] = useState('');
  const [partmemo, setPartMemo] = useState('');
  const setRows = useAppStore((state) => state.setRows);
  const partCollectionRef = collection(db, "parts");

  const handlePartNameChange = (e) => {
    setPartName(e.target.value);
  }

  const handlePartSerialNameChange = (e) => {
    setPartSerialName(e.target.value);
  }

  const handlePartReusedChange = (e) => {
    setPartReused(e.target.value);
  }

  const handlePartWeightChange = (e) => {
    setPartWeight(e.target.value);
  }

  const handlePartMemoChange = (e) => {
    setPartMemo(e.target.value);
  }

  const createParts = async () => {
    await addDoc(partCollectionRef, {
      name: partname,
      reused: partreused,
      serialname: partserialname,
      weight: Number(partweight),
      memo: partmemo,
      date: String(new Date()),
    });
    await getParts();
    closeEvent();
    Swal.fire("Submitted!", "Your file has been submitted.", "success");

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
        Add Parts
      </Typography>
      {/* 부품 등록 팝업 우측 상단 닫기 아이콘 */}
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
          <TextField id="outlined-basic" label="Part Name" variant="outlined" size='small' onChange={handlePartNameChange} value={partname} sx={{ minWidth: '100%', mb: 2 }} />
        </Grid>
        {/* Reused Part 항목 */}
        <Grid item xs={6}>
          <Typography variant="subtitle1" mb={1}>
            Reused Part
          </Typography>
          <TextField id="outlined-basic" label="Yes or No" select variant="outlined" size='small' onChange={handlePartReusedChange} value={partreused} sx={{ minWidth: '100%', maxWidth: '100%', mb: 2 }}>
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
          <TextField id="outlined-basic" label="Part Serial Name" variant="outlined" size='small' onChange={handlePartSerialNameChange} value={partserialname} sx={{ minWidth: '100%', mb: 2 }} />
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
            onChange={handlePartWeightChange}
            value={partweight}
            sx={{ minWidth: '100%', mb: 2 }} />
        </Grid>


        {/* Ragistrated Date 항목 */}

        {/* Memo 항목 */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" mb={1}>
            Memo
          </Typography>
          <TextField id="outlined-basic" label="Part Memo" variant="outlined" size='small' onChange={handlePartMemoChange} value={partmemo} sx={{ minWidth: '100%', mb: 2 }} />
        </Grid>


        {/* Submit 버튼 */}
        <Grid item xs={12}>
          <Typography variant='h5' align='center'>
            <Button variant='contained' onClick={createParts}>
              Submit
            </Button>
          </Typography>
        </Grid>
      </Grid >
      <Box sx={{ m: 4 }} />
    </>
  )
}