import { Close } from '@mui/icons-material'
import { Box, Button, Checkbox, FormControlLabel, Grid, IconButton, MenuItem, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import TextField from '@mui/material/TextField';
import { collection, getDocs, addDoc, doc, getDoc, query, where } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { useAppStore } from '../../appStore';
import { UserAuth } from '../../../context/AuthContext';
import { db } from '../../../api/firebase';

export default function AddPartProduct({ closeEvent }) {
  const [partname, setPartName] = useState('');
  const [partserialname, setPartSerialName] = useState('');
  const [partreused, setPartReused] = useState('');
  const [partweight, setPartWeight] = useState('');
  const [partmemo, setPartMemo] = useState('');
  const [managementCode, setManagementCode] = useState('');
  const [preprocess, setPreprocess] = useState('');
  const [preprocessOptions, setPreprocessOptions] = useState([]);
  const [weightError, setWeightError] = useState(false);
  const setRows = useAppStore((state) => state.setRows);
  const partCollectionRef = collection(db, "productparts");
  const { user } = UserAuth();

  useEffect(() => {
    const preprocessingRef = doc(db, "preprocessing", "mpz3PsM2M9plJdjONrly");
    const getOptions = async () => {
      const docSnap = await getDoc(preprocessingRef);
      if (docSnap.exists()) {
        setPreprocessOptions([
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

  const handlePartNameChange = (e) => {
    setPartName(e.target.value);
  }

  const handlePartSerialNameChange = (e) => {
    setPartSerialName(e.target.value);
  }

  const handlePartReusedChange = (e) => {
    setPartReused(e.target.checked ? 'Yes' : 'No'); // 체크박스
  }

  const handlePartWeightChange = (e) => {
    if (e.target.value < 0) {
      setWeightError(true); // 0 미만의 값이 입력되면 에러 상태를 true로 설정
      return;
    }
    setWeightError(false); // 그 외의 경우 에러 상태를 false로 설정
    setPartWeight(e.target.value);
  }

  const handleManagementCodeChange = (e) => {
    setManagementCode(e.target.value);
  }

  const handlePreprocessChange = (e) => {
    setPreprocess(e.target.value);
  }

  const handlePartMemoChange = (e) => {
    setPartMemo(e.target.value);
  }

  const createParts = async () => {
    await addDoc(partCollectionRef, {
      allowuid: user.uid,
      uid: user.uid,
      name: partname,
      reused: partreused ? 'Yes' : 'No',
      serialname: partserialname,
      weight: Number(partweight),
      memo: partmemo,
      date: String(new Date()),
      managementCode: managementCode,
      preprocess: preprocess
    });
    await getParts();
    closeEvent();
    Swal.fire("Submitted!", "Your file has been submitted.", "success");
  };

  const getParts = async () => {
    const q = query(partCollectionRef, where("uid", "==", user.uid));  // 사용자의 uid를 기반으로 부품을 쿼리합니다.
    const data = await getDocs(q);
    setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

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
        {/* 부품명 */}
        <Grid item xs={3}>
          <Typography variant="subtitle1" mb={1}>
            Part Name
          </Typography>
          <TextField id="outlined-basic" label="Part Name" variant="outlined" size='small' onChange={handlePartNameChange} value={partname} sx={{ minWidth: '100%', mb: 2 }} />
        </Grid>
        {/* 고유번호 */}
        <Grid item xs={3}>
          <Typography variant="subtitle1" mb={1}>
            Serial Name
          </Typography>
          <TextField id="outlined-basic" label="Part Serial Name" variant="outlined" size='small' onChange={handlePartSerialNameChange} value={partserialname} sx={{ minWidth: '100%', mb: 2 }} />
        </Grid>
        {/* 관리코드 */}
        <Grid item xs={3}>
          <Typography variant="subtitle1" mb={1}>
            Management Code
          </Typography>
          <TextField id="outlined-basic" label="Management Code" variant="outlined" size='small' onChange={handleManagementCodeChange} value={managementCode} sx={{ minWidth: '100%', mb: 2 }} />
        </Grid>
        {/* Part Weight 항목 */}
        <Grid item xs={3}>
          <Typography variant="subtitle1" mb={1}>
            Weight
          </Typography>
          <TextField
            error={weightError} // 에러 상태에 따라 에러 스타일 적용
            helperText={weightError ? "0 이상의 숫자만 입력할 수 있습니다." : " "} // 에러 상태에 따라 helperText 설정
            id="outlined-basic"
            label="Part Weight(g)"
            variant="outlined"
            type='number'
            size='small'
            onChange={handlePartWeightChange}
            value={partweight}
            sx={{ minWidth: '100%', mb: 2 }}
          />
        </Grid>
        {/* Reused Part 항목 */}
        <Grid item xs={3}>
          <Typography variant="subtitle1" mb={1}>
            Reused Part
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={partreused === 'Yes'}
                onChange={handlePartReusedChange}
              />
            }
            label="재사용부품 여부"
          />
        </Grid>
        {/* EoL Scenario */}
        <Grid item xs={3}>
          <Typography variant="subtitle1" mb={1}>
            EoL Scenario
          </Typography>
          <TextField id="outlined-basic" label="EoL Scenario" select variant="outlined" size='small' onChange={handlePreprocessChange} value={preprocess} sx={{ minWidth: '100%', mb: 2 }}>
            {preprocessOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
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