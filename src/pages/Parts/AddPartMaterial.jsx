import { Close } from '@mui/icons-material';
import { Box, Button, Checkbox, FormControl, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { db } from '../../api/firebase';
import { collection, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import './CSS/sweetalert2.css';

export default function AddPartMaterials({ closeEvent, currentPartID }) {
  const [partmaterialgroup, setPartMaterialGroup] = useState('');
  const [partmaterialname, setPartMaterialName] = useState('');
  const [partmaterialmass, setPartMaterialMass] = useState('');
  const [partselectrecycledcontent, setSelectRecycledContent] = useState('No');
  const [partrecycledcontents, setPartRecycledContents] = useState('');
  const [partrecycledtype, setPartRecycledType] = useState('');
  const materialGroupsRef = collection(db, 'materials');
  const [materialGroups, setMaterialGroups] = useState([]);
  const [materialNames, setMaterialNames] = useState([]);
  const [serialName, setSerialName] = useState('');
  const [partMass, setPartMass] = useState('');

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

  // substancename 필드의 값을 가진 문서의 실제 ID를 알아내는 과정 적용
  const fetchMaterialGroups = async () => {
    try {
      const materialGroupsSnapshot = await getDocs(materialGroupsRef);
      const materialGroupsData = materialGroupsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })).sort((a, b) => a.MaterialGroup.localeCompare(b.MaterialGroup));
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
  // 선택된 Material Group에 해당하는 Material Name 목록을 가져와 materialNames state에 저장 후 MaterialName 드롭박스를 채우는데 사용
  // materialGroup 인수를 문서ID로 바꿔줌
  // 이는 handlePartMaterialGroupChange 함수에서 선택된 MaterialGroup의 실제 ID를 전달해줄 것이기 때문
  const fetchMaterialNames = async (materialGroupId) => {
    try {
      const materialGroupRef = doc(materialGroupsRef, materialGroupId);
      const materialNamesSnapshot = await getDocs(collection(materialGroupRef, 'materialnames'));
      const materialNamesData = materialNamesSnapshot.docs.map((doc) => doc.data());
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

  // Material Group 선택 시 함수 호출 -> 선택된 Material Group에 해당되는 Material Name목록을 가져오는 fetchMaterialName 함수 호출
  const handlePartMaterialGroupChange = (e) => {
    const selectedMaterialGroup = materialGroups.find((group) => group.MaterialGroup === e.target.value);
    setPartMaterialGroup(selectedMaterialGroup.MaterialGroup);
    if (selectedMaterialGroup) {
      fetchMaterialNames(selectedMaterialGroup.id);
    } else {
      setMaterialNames([]); // Material Group이 선택되지 않은 경우, 빈 배열로 초기화
    }
  };

  const handlePartMaterialName = (e) => {
    setPartMaterialName(e.target.value);
  };

  const handlePartMaterialMass = (e) => {
    setPartMaterialMass(e.target.value);
  };

  const handlePartRecycledContents = (e) => {
    setPartRecycledContents(e.target.value);
  };
  const handleSelectPartRecycledContent = (e) => {
    setSelectRecycledContent(e.target.checked ? 'Yes' : 'No'); // 체크박스
  }
  const handlePartRecycledType = (e) => {
    setPartRecycledType(e.target.value);
  };

  const createMaterial = async () => {
    try {
      const partDocRef = doc(db, 'parts', currentPartID);
      const materialsCollectionRef = collection(partDocRef, 'materials');
      const newMaterial = {
        materialgroup: partmaterialgroup,
        materialname: partmaterialname.MaterialName,
        CleanerAllother: partmaterialname.CleanerAllother,
        CleanerBattery: partmaterialname.CleanerBattery,
        CleanerElecCable: partmaterialname.CleanerElecCable,
        CleanerPCBAssa: partmaterialname.CleanerPCBAssa,
        CleanerPretreatment: partmaterialname.CleanerPretreatment,
        PhoneBattery: partmaterialname.PhoneBattery,
        PhoneMonoM: partmaterialname.PhoneMonoM,
        PhoneOtherparts: partmaterialname.PhoneOtherparts,
        recycledcontent: partselectrecycledcontent === 'Yes' ? 'Yes' : 'No',
        recyclingcontent: Number(partrecycledcontents),
        recycledtype: partrecycledtype,
        materialmass: Number(partmaterialmass),
      };

      // 문서를 생성하고 생성된 문서의 ID를 받아옵니다.
      await addDoc(materialsCollectionRef, newMaterial);

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
      console.error('Error creating material:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to submit the file.',
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
        Add Material
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
            Serial Name
          </Typography>
          <TextField id="outlined-basic" label="Part Serial Name" variant="outlined" size='small' sx={{
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
            <InputLabel id="select-material-group-label">Select a Group</InputLabel>
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
            <InputLabel id="select-material-name-label">Select a Name</InputLabel>
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
                <MenuItem key={option.MaterialName} value={option}>
                  {option.MaterialName}
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

        {/* Recycling Contents */}
        <Grid item xs={4}>
          <Typography variant="subtitle1" mb={1}>
            Recycling Contents (%)
          </Typography>
          <TextField
            id="outlined-basic"
            label="Enter Recycling Content "
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

        {/* Recycled Type */}
        <Grid item xs={4}>
          <Typography variant="subtitle1" mb={1}>
            Recycled Type
          </Typography>
          <TextField
            id="outlined-basic"
            label="Select an Option"
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
            label="Part Mass"
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
            <Button variant="contained" onClick={createMaterial} >
              Submit
            </Button>
          </Typography>
        </Grid>
      </Grid>
      <Box sx={{ m: 4 }} />
    </>
  );
}

// 위의 코드에서 `materialNames` 상태와 `handlePartMaterialGroupChange` 함수가 추가되었습니다.
// `materialNames`는 Material Group에 따른 Material Name 옵션을 저장하기 위한 상태이고,
// `handlePartMaterialGroupChange` 함수는 Material Group이 변경될 때 해당 Material Group에 속하는 subcollection에서 Material Name을 가져와 `materialNames` 상태를 업데이트합니다.
// Material Group이 선택되면 subcollection에서 데이터를 가져오고 Material Name 옵션을 업데이트합니다.
// 이제 Material Group을 선택하면 해당 Material Group에 속하는 subcollection에서 Material Name이 동적으로 로드되고,
// Material Name 항목은 dropbox로 선택된 데이터에 포함된 subcollection의 name 필드를 dropbox 폼으로 나타내게 됩니다.