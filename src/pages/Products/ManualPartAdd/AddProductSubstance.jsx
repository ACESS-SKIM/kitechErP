import { Close } from '@mui/icons-material';
import { Box, Button, Grid, IconButton, MenuItem, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { db } from '../../../api/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { useAppStore } from '../../appStore';

export default function AddProductSubstance({ closeEvent, currentPartID, currentMaterialID }) {
  const [partsubstancename, setPartSubstanceName] = useState('');
  const [partcasnumber, setPartCASNumber] = useState('');
  const [partsubstancemass, setPartSubstanceMass] = useState('');
  const setRows = useAppStore((state) => state.setRows);
  const partCollectionRef = collection(db, 'productparts');
  const substanceNamesRef = collection(db, 'substances');
  const [substanceNames, setSubstanceNames] = useState([]);

  useEffect(() => {
    fetchSubstanceNames();
  }, []);

  const fetchSubstanceNames = async () => {
    const substanceNamesSnapshot = await getDocs(substanceNamesRef);
    const substanceNamesData = substanceNamesSnapshot.docs.map((doc) => doc.data());
    setSubstanceNames(substanceNamesData);
  };

  const handlePartSubstanceName = (e) => {
    const selectedSubstanceName = e.target.value;
    setPartSubstanceName(selectedSubstanceName);

    const selectedSubstance = substanceNames.find(substance => substance.substancename === selectedSubstanceName);
    if (selectedSubstance) {
      setPartCASNumber(selectedSubstance.casnumber);
    }
  };

  const handlePartSubstanceMass = (e) => {
    setPartSubstanceMass(Number(e.target.value));
  };

  const handlePartCASNumber = (e) => {
    setPartCASNumber(e.target.value);
  };

  const createSubstance = async () => {
    try {
      const substancesCollectionRef = collection(db, 'productparts', currentPartID, 'materials', currentMaterialID, 'substances');
      await addDoc(substancesCollectionRef, {
        substancename: partsubstancename,
        casnumber: partcasnumber,
        substancemass: Number(partsubstancemass),
        date: String(new Date()),
      });
      getUsers();
      closeEvent();
      Swal.fire({
        title: 'Submitted!',
        text: 'Your file has been submitted.',
        icon: 'success',
        confirmButtonClass: 'sweetalert-confirm-button',  // 팝업창의 OK버튼 스타일링
        customClass: {
          container: 'sweetalert-container', // 팝업창의 zindex값 변경 (mui 기본 zindex : 1300, sweetalert2 : 1060)
        },
      });
    } catch (error) {
      console.error("Error creating substance: ", error);
    }
  };

  const getUsers = async () => {
    const data = await getDocs(partCollectionRef);
    setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  return (
    <>
      <Box sx={{ m: 2 }} />
      <Typography variant="h4" align='center' sx={{ mb: 4 }}>
        Add Substance
      </Typography>
      <IconButton
        style={{ position: "absolute", top: '0', right: '0' }}
        onClick={closeEvent}
      >
        <Close />
      </IconButton>
      <Box height={20} />
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Typography variant="subtitle1" mb={1}>
            Substance Name
          </Typography>
          <TextField
            id="outlined-basic"
            label="Select a Substance Name"
            select
            variant="outlined"
            size='small'
            onChange={handlePartSubstanceName}
            value={partsubstancename}
            sx={{ minWidth: '100%', maxWidth: '100%', mb: 2 }}
          >
            {substanceNames.map((option) => (
              <MenuItem key={option.substancename} value={option.substancename}>
                {option.substancename}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="subtitle1" mb={1}>
            CAS Number
          </Typography>
          <TextField
            id="outlined-basic"
            label="CAS Number"
            variant="outlined"
            size='small'
            disabled={true}
            onChange={handlePartCASNumber}
            value={partcasnumber}
            sx={{ minWidth: '100%', mb: 2, backgroundColor: 'rgba(0,0,0, 0.09)' }}
          />
        </Grid>

        <Grid item xs={6}>
          <Typography variant="subtitle1" mb={1}>
            Substance Mass (g)
          </Typography>
          <TextField
            id="outlined-basic"
            label="Enter Substance Mass (g)"
            variant="outlined"
            size='small'
            onChange={handlePartSubstanceMass}
            value={partsubstancemass}
            sx={{ minWidth: '100%', mb: 2 }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant='h5' align='center'>
            <Button
              variant="contained"
              color="primary"
              onClick={createSubstance}
              sx={{ minWidth: '50%', maxWidth: '50%', m: 'auto', display: 'flex' }}
            >
              Submit
            </Button>
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}