import { Close } from '@mui/icons-material'
import { Box, Button, Checkbox, FormControlLabel, Grid, IconButton, MenuItem, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import { db } from '../../api/firebase';
import { collection, updateDoc, getDocs, doc, getDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { useAppStore } from '../appStore';

export default function EditPart({ fid, closeEvent }) {
  const [weightError, setWeightError] = useState(false); // Part Weight 필드의 입력값 에러 상태 저장
  const [preprocessingOptions, setPreprocessingOptions] = useState([]); // 사전처리 옵션 저장
  const [partreused, setPartReused] = useState('');
  const [partData, setPartData] = useState({
    partname: '',
    partserialname: '',
    managementCode: '',
    partreused: '',
    partweight: '',
    partpreprocessing: '',
    partmemo: '',
  });
  const setRows = useAppStore((state) => state.setRows);
  const partCollectionRef = collection(db, "parts");

  useEffect(() => {
    const preprocessingRef = doc(db, "preprocessing", "mpz3PsM2M9plJdjONrly");
    const getOptions = async () => {
      const docSnap = await getDoc(preprocessingRef);
      if (docSnap.exists()) {
        setPreprocessingOptions([
          { value: docSnap.data().option1, label: docSnap.data().option1 },
          { value: docSnap.data().option2, label: docSnap.data().option2 },
          { value: docSnap.data().option3, label: docSnap.data().option3 },
          { value: docSnap.data().option4, label: docSnap.data().option4 },
          { value: docSnap.data().option5, label: docSnap.data().option5 },
          { value: docSnap.data().option6, label: docSnap.data().option6 },
        ]);
      } else {
        console.log("No such document!");
      }
    };
    getOptions();
  }, []);

  useEffect(() => {
    setPartData({
      partname: fid.name || '',
      partserialname: fid.serialname || '',
      managementCode: fid.managementCode || '',
      partreused: fid.reused || '',
      partweight: fid.weight || '',
      partpreprocessing: preprocessingOptions.find(option => option.value === fid.preprocess)?.label || '',
      partmemo: fid.memo || '',
    });
    setPartReused(fid.reused === 'Yes' ? true : false);
  }, [fid, preprocessingOptions]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPartData(prevState => ({ ...prevState, [name]: value }));
  };

  const handlePartReusedChange = (e) => {
    setPartReused(e.target.checked);
  };

  const handleManagementCodeChange = (e) => {
    setPartData(prevState => ({ ...prevState, managementCode: e.target.value }));
  };

  const handlePartWeightChange = (e) => {
    if (e.target.value < 0) {
      setWeightError(true);
    } else {
      setWeightError(false);
      handleInputChange(e);
    }
  };

  const updatePart = async () => {
    const userDoc = doc(db, 'parts', fid.id);
    const newFields = {
      name: partData.partname,
      reused: partreused ? 'Yes' : 'No', // partreused는 Boolean이므로 Yes/No 문자열로 변경
      serialname: partData.partserialname,
      managementCode: partData.managementCode, // 데이터 업데이트에 관리코드 추가
      weight: Number(partData.partweight),
      preprocess: partData.partpreprocessing, // 데이터 업데이트에 사전처리 추가
      memo: partData.partmemo,
      date: String(new Date()),
    };
    await updateDoc(userDoc, newFields);

    closeEvent();
    Swal.fire("Submitted!", "Your file has been updated.", "success");
    getParts();
  };

  const getParts = async () => {
    const data = await getDocs(partCollectionRef);
    setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };


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
        {/* 부품명 */}
        <Grid item xs={3}>
          <Typography variant="subtitle1" mb={1}>
            Part Name
          </Typography>
          <TextField id="outlined-basic" label="Enter Part Name" variant="outlined" size='small' onChange={handleInputChange} value={partData.partname} name='partname' sx={{ minWidth: '100%', mb: 2 }} />
        </Grid>
        {/* 고유번호 */}
        <Grid item xs={3}>
          <Typography variant="subtitle1" mb={1}>
            Part Code
          </Typography>
          <TextField id="outlined-basic" label="Enter Part Code" variant="outlined" size='small' onChange={handleInputChange} value={partData.partserialname} name='partserialname' sx={{ minWidth: '100%', mb: 2 }} />
        </Grid>
        {/* 관리코드 */}
        <Grid item xs={3}>
          <Typography variant="subtitle1" mb={1}>
            Management Code
          </Typography>
          <TextField id="outlined-basic" label="Enter Management Code" variant="outlined" size='small' onChange={handleManagementCodeChange} value={partData.managementCode} sx={{ minWidth: '100%', mb: 2 }} />
        </Grid>
        {/* Part Weight */}
        <Grid item xs={3}>
          <Typography variant="subtitle1" mb={1}>
            Weight
          </Typography>
          <TextField
            error={weightError}
            helperText={weightError ? "0 이상의 숫자만 입력할 수 있습니다." : " "}
            id="outlined-basic"
            label="Enter Weight(g)"
            variant="outlined"
            type='number'
            size='small'
            onChange={handlePartWeightChange}
            name='partweight'
            value={partData.partweight}
            sx={{ minWidth: '100%', mb: 2 }}
          />
        </Grid>
        {/* Reused Part */}
        <Grid item xs={3}>
          <Typography variant="subtitle1" mb={1}>
            Reused Part
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={partreused}
                onChange={handlePartReusedChange}
              />
            }
            label="재사용부품 여부"
          />
        </Grid>
        {/* 사전처리 */}
        <Grid item xs={3}>
          <Typography variant="subtitle1" mb={1}>
            EoL Scenario
          </Typography>
          <TextField
            id="outlined-basic"
            label="Select EoL Scenario"
            select
            variant="outlined"
            size='small'
            onChange={handleInputChange}
            value={partData.partpreprocessing}
            name='partpreprocessing'
            sx={{ minWidth: '100%', maxWidth: '100%', mb: 2 }}
          >
            {preprocessingOptions.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        {/* Memo 항목 */}
        <Grid item xs={6}>
          <Typography variant="subtitle1" mb={1}>
            Memo
          </Typography>
          <TextField id="outlined-basic" label="Enter Memo" variant="outlined" size='small' onChange={handleInputChange} value={partData.partmemo} name='partmemo' sx={{ minWidth: '100%', mb: 2 }} />
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