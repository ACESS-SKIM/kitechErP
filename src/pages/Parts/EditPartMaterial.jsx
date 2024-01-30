import { Close } from '@mui/icons-material';
import { Box, Button, Checkbox, FormControl, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { db } from '../../api/firebase';
import { collection, getDocs, setDoc, doc, getDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import './CSS/sweetalert2.css';
import { useAppStore } from '../appStore';

export default function EditPartMaterial({ closeEvent, currentPartID, editMaterial }) {
  const [partmaterialgroup, setPartMaterialGroup] = useState(() => editMaterial?.materialgroup || '');
  const [partmaterialname, setPartMaterialName] = useState(() => editMaterial?.materialname || '');
  const [partmaterialmass, setPartMaterialMass] = useState(() => editMaterial?.materialmass || '');
  const [partselectrecycledcontent, setSelectRecycledContent] = useState(() => editMaterial?.recycledcontent || '');
  const [partrecycledcontents, setPartRecycledContents] = useState(() => Number(editMaterial?.recyclingcontent || ''));
  const [partrecycledtype, setPartRecycledType] = useState(() => editMaterial?.recycledtype || '');
  const [serialName, setSerialName] = useState('');
  const [partMass, setPartMass] = useState('');
  const setRows = useAppStore((state) => state.setRows);
  const rows = useAppStore((state) => state.rows);

  useEffect(() => {
    const fetchPartSerialName = async () => {
      const partDocRef = doc(db, 'parts', currentPartID);
      const partDocSnapshot = await getDoc(partDocRef);
      if (partDocSnapshot.exists()) {
        setSerialName(partDocSnapshot.data().serialname);
      } else {
        console.log("No such document!");
      }
    };

    fetchPartSerialName();
    fetchMaterialGroups();
  }, []);

  const handleEdit = (e, fieldName) => {
    const newRows = rows.map(row => {
      if (row.id === editMaterial.id) {
        return {
          ...row,
          [fieldName]: e.target.value,
        };
      }
      return row;
    });

    setRows(newRows);
  };

  useEffect(() => {
    const fetchPartMass = async () => {
      const partDocRef = doc(db, 'parts', currentPartID);
      const partDocSnapshot = await getDoc(partDocRef);
      if (partDocSnapshot.exists()) {
        setPartMass(partDocSnapshot.data().weight);
      } else {
        console.log("No such document!");
      }
    };

    fetchPartMass();  // 'weight' 값을 가져옴
  }, []);

  const materialGroupsRef = collection(db, 'materials');
  const [materialGroups, setMaterialGroups] = useState([]);
  const [materialNames, setMaterialNames] = useState([]);

  useEffect(() => {
    console.log(editMaterial);
  }, []);

  useEffect(() => {
    fetchMaterialGroups();
    // editMaterial이나 materialGroups가 변경될 때마다 실행되므로 Material Group이 선택되어 Material Names을 가져올 수 있도록 함.
    if (editMaterial && materialGroups.length > 0) {
      const currentGroup = materialGroups.find((group) => group.MaterialGroup === editMaterial.materialgroup);
      if (currentGroup) {
        fetchMaterialNames(currentGroup.id);
      }
    }
  }, [editMaterial, materialGroups]);

  // MaterialGroup 필드의 값을 가진 문서의 실제 ID를 알아내는 과정 적용
  const fetchMaterialGroups = async () => {
    try {
      const materialGroupsSnapshot = await getDocs(materialGroupsRef);
      const materialGroupsData = materialGroupsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })).sort((a, b) => b.MaterialGroup.localeCompare(a.MaterialGroup));
      setMaterialGroups(materialGroupsData);
    } catch (error) {
      console.error('Error fetching material groups:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to fetch the material groups.',
        icon: 'error',
        customClass: {
          container: 'sweetalert-container',
        },
      });
    }
  };
  // fetchMaterialNames 함수에서는 materialGroup 인수를 문서ID로 바꿔줌
  // 이는 handlePartMaterialGroupChange 함수에서 선택된 MaterialGroup의 실제 ID를 전달해줄 것이기 때문
  const fetchMaterialNames = async (materialGroupId) => {
    try {
      const materialGroupRef = doc(materialGroupsRef, materialGroupId);
      const materialNamesSnapshot = await getDocs(collection(materialGroupRef, 'materialnames'));
      const materialNamesData = materialNamesSnapshot.docs.map((doc) => doc.data().MaterialName);
      materialNamesData.sort();
      setMaterialNames(materialNamesData);
    } catch (error) {
      console.error('Error fetching material names:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to fetch the material names.',
        icon: 'error',
        customClass: {
          container: 'sweetalert-container',
        },
      });
    }
  };

  // 이 과정을 거치면 Material Group 선택 시 해당 문서의 ID를 기반으로 materialnames 하위 컬렉션을 불러오게 됨.
  const handlePartMaterialGroupChange = (e) => {
    const selectedMaterialGroup = materialGroups.find((group) => group.MaterialGroup === e.target.value);
    setPartMaterialGroup(selectedMaterialGroup.MaterialGroup);
    if (selectedMaterialGroup) {
      fetchMaterialNames(selectedMaterialGroup.id);
      setPartMaterialName("");
    } else {
      setMaterialNames([]); // Material Group이 선택되지 않은 경우, 빈 배열로 초기화
    }
  };

  const handlePartRecycledContents = (e) => {
    setPartRecycledContents(e.target.value);
    handleEdit(e.target.value, 'recyclingcontent');
  };

  const handlePartMaterialName = (e) => {
    setPartMaterialName(e.target.value);
    handleEdit(e.target.value, 'materialname');
  };

  const handleSelectPartRecycledContent = (e) => {
    setSelectRecycledContent(e.target.checked ? 'Yes' : 'No'); // 체크박스
  }

  const handlePartRecycledType = (e) => {
    setPartRecycledType(e.target.value);
    handleEdit(e.target.value, 'recycledtype');
  };

  const handlePartMaterialMass = (e) => {
    setPartMaterialMass(e.target.value);
    handleEdit(e.target.value, 'materialmass');
  };



  const updateMaterial = async () => {
    try {
      const partDocRef = doc(db, 'parts', currentPartID);
      const materialDocRef = doc(partDocRef, 'materials', editMaterial.id);
      const updatedMaterial = {
        materialgroup: partmaterialgroup,
        materialname: partmaterialname,
        recycledcontent: partselectrecycledcontent ? 'Yes' : 'No',
        recyclingcontent: Number(partrecycledcontents),
        recycledtype: partrecycledtype,
        materialmass: Number(partmaterialmass),
      };

      await setDoc(materialDocRef, updatedMaterial);

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

  const recycledtype = [
    { value: 'Pre Consumer', label: 'Pre Consumer' },
    { value: 'Post Consumer', label: 'Post Consumer' },
    { value: 'Unspecified', label: 'Unspecified' },
  ];

  return (
    <>
      {/* 소재등록 팝업 제목부 */}
      <Box sx={{ m: 2 }} />
      <Typography variant="h4" align="center" sx={{ mb: 4 }}>
        Edit Material
      </Typography>
      {/* 소재 등록 팝업 우측 상단 닫기 아이콘 */}
      <IconButton
        style={{ position: "absolute", top: '0', right: '0' }}
        onClick={closeEvent}
      >
        <Close />
      </IconButton>
      <Box height={20} />
      <Grid container spacing={2}>
        {/* 고유번호 */}
        <Grid item xs={4}>
          <Typography variant="subtitle1" mb={1}>
            Part Code
          </Typography>
          <TextField id="outlined-basic" label="Part Code" variant="outlined" size='small' sx={{
            minWidth: '100%', mb: 2, color: 'black', backgroundColor: '#d3d3d3', '& .Mui-disabled': { // disabled 상태 스타일 오버라이드
              color: 'black', // 비활성 상태에서 텍스트 색상 설정
              '-webkit-text-fill-color': 'black', // Webkit 브라우저에서 텍스트 색상 설정
              opacity: 1,
            }
          }} value={serialName} disabled />
        </Grid>
        {/* Material Group 항목 */}
        <Grid item xs={4}>
          <Typography variant="subtitle1" mb={1}>
            Material Group
          </Typography>
          <FormControl variant="outlined" size="small" sx={{ minWidth: '100%', maxWidth: '100%', mb: 2 }}>
            <InputLabel id="select-material-group-label">Select a Material Group</InputLabel>
            <Select
              labelId="select-material-group-label"
              id="select-material-group"
              value={partmaterialgroup}
              onChange={handlePartMaterialGroupChange}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 48 * 4.5,
                    width: '20ch',
                  },
                },
              }}
            >
              {materialGroups.map((option) => (
                <MenuItem key={option.MaterialGroup} value={option.MaterialGroup}>
                  {option.MaterialGroup}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Material Name 항목 */}
        <Grid item xs={4}>
          <Typography variant="subtitle1" mb={1}>
            Material Name
          </Typography>
          <FormControl variant="outlined" size="small" sx={{ minWidth: '100%', maxWidth: '100%', mb: 2 }}>
            <InputLabel id="select-material-name-label">Select a Material Name</InputLabel>
            <Select
              labelId="select-material-name-label"
              id="select-material-name"
              onChange={handlePartMaterialName}
              value={partmaterialname}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 48 * 4.5,
                    width: '20ch',
                  },
                },
              }}
            >
              {materialNames.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Recycled Content */}
        <Grid item xs={4}>
          <Typography variant="subtitle1" mb={1}>
            Recycled Content
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={partselectrecycledcontent === 'Yes'}
                onChange={handleSelectPartRecycledContent}
              />
            }
            label="재활용재질함량 여부"
          />
        </Grid>

        {/* Recycling Contents 항목 */}
        <Grid item xs={4}>
          <Typography variant="subtitle1" mb={1}>
            Recycling Contents (%)
          </Typography>
          <TextField
            id="outlined-basic"
            label="Enter Recycling Content"
            variant="outlined"
            size="small"
            onChange={handlePartRecycledContents}
            value={partrecycledcontents}
            sx={{
              minWidth: '100%',
              mb: 2,
              backgroundColor: partselectrecycledcontent === 'No' ? '#d3d3d3' : ''
            }}
            disabled={partselectrecycledcontent === 'No'} // if No, it's disabled
          />
        </Grid>
        {/* Recycled Type 항목 */}
        <Grid item xs={4}>
          <Typography variant="subtitle1" mb={1}>
            Recycled Type
          </Typography>
          <TextField
            id="outlined-basic"
            label="Select a Type"
            select
            variant="outlined"
            size="small"
            onChange={handlePartRecycledType}
            value={partrecycledtype}
            sx={{
              minWidth: '100%',
              mb: 2,
              backgroundColor: partselectrecycledcontent === 'No' ? '#d3d3d3' : ''
            }}
            disabled={partselectrecycledcontent === 'No'} // if No, it's disabled
          >
            {recycledtype.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Material Mass(g) 항목 */}
        <Grid item xs={4}>
          <Typography variant="subtitle1" mb={1}>
            Material Mass (g)
          </Typography>
          <TextField
            id="outlined-basic"
            label="Enter Material Mass (g)"
            variant="outlined"
            size="small"
            onChange={handlePartMaterialMass}
            value={partmaterialmass}
            sx={{ minWidth: '100%', mb: 2 }}
          />
        </Grid>
        {/* Part Mass(g) 항목 */}
        <Grid item xs={4}>
          <Typography variant="subtitle1" mb={1}>
            Part Mass (g)
          </Typography>
          <TextField
            id="outlined-basic"
            label="Part Mass (g)"
            variant="outlined"
            size="small"
            value={partMass}
            sx={{
              minWidth: '100%', mb: 2, color: 'black', backgroundColor: '#d3d3d3', '& .Mui-disabled': {
                color: 'black',
                '-webkit-text-fill-color': 'black',
                opacity: 1,
              }
            }}
            disabled
          />
        </Grid>

        {/* Submit 버튼 */}
        <Grid item xs={12}>
          <Typography variant="h5" align="center">
            <Button variant="contained" onClick={updateMaterial} >
              Edit
            </Button>
          </Typography>
        </Grid>
      </Grid>
      <Box sx={{ m: 4 }} />
    </>
  );
}