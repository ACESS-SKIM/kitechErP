import { Close } from '@mui/icons-material';
import { Box, Button, Grid, IconButton, MenuItem, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { db } from '../../api/firebase';
import { collection, getDocs, setDoc, doc, updateDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import './CSS/sweetalert2.css';

export default function EditPartSubstance({ closeEvent, currentPartID, currentMaterialID, editSubstance }) {
  const [partsubstancename, setPartSubstanceName] = useState(() => editSubstance?.substancename || '');
  const [partcasnumber, setPartCASNumber] = useState(() => editSubstance?.casnumber || '');
  const [partsubstancemass, setPartSubstanceMass] = useState(() => editSubstance?.substancemass || '');
  const [substanceNames, setSubstanceNames] = useState([]);
  const substanceNamesRef = collection(db, 'substances');

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

  const fetchSubstanceNames = async () => {
    const substanceNamesSnapshot = await getDocs(substanceNamesRef);
    const substanceNamesData = substanceNamesSnapshot.docs.map((doc) => doc.data());
    setSubstanceNames(substanceNamesData);
  };

  useEffect(() => {
    fetchSubstanceNames();
  }, []);

  const handlePartCASNumber = (e) => {
    setPartCASNumber(e.target.value);
  };

  const updateSubstance = async () => {
    try {
      const partDocRef = doc(db, 'parts', currentPartID);
      const materialDocRef = doc(partDocRef, 'materials', currentMaterialID);
      const substanceDocRef = doc(materialDocRef, 'substances', editSubstance.id);

      const updatedSubstance = {
        substancename: partsubstancename,
        casnumber: partcasnumber,
        substancemass: Number(partsubstancemass),
      };

      await updateDoc(substanceDocRef, updatedSubstance);

      closeEvent();
      Swal.fire({
        title: 'Updated!',
        text: 'Your file has been updated.',
        icon: 'success',
        confirmButtonClass: 'sweetalert-confirm-button',
        customClass: {
          container: 'sweetalert-container',
        },
      });
    } catch (error) {
      console.error('Error updating material:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update the file.',
        icon: 'error',
        confirmButtonClass: 'sweetalert-confirm-button',
        customClass: {
          container: 'sweetalert-container',
        },
      });
    }
  };

  return (
    <>
      <Box sx={{ m: 2 }} />
      <Typography variant="h4" align='center' sx={{ mb: 4 }}>
        Edit Substance
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
            label="Select a Name"
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
            label="Enter Mass"
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
              onClick={updateSubstance}
              sx={{ minWidth: '50%', maxWidth: '50%', m: 'auto', display: 'flex' }}
            >
              Edit
            </Button>
          </Typography>
        </Grid>
      </Grid>
    </>
  );
}