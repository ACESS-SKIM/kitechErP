import { Close } from '@mui/icons-material';
import { Box, Button, Grid, IconButton, MenuItem, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { db } from '../../api/firebase';
import { collection, getDocs, addDoc, doc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import './CSS/sweetalert2.css';

export default function AddPartMaterials({ closeEvent, currentPartID }) {
  const [partmaterialgroup, setPartMaterialGroup] = useState('');
  const [partmaterialname, setPartMaterialName] = useState('');
  const [partmaterialmass, setPartMaterialMass] = useState('');
  const [partrecycledcontents, setPartRecycledContents] = useState('');
  const [partrecycledtype, setPartRecycledType] = useState('');
  const materialGroupsRef = collection(db, 'materials');
  const [materialGroups, setMaterialGroups] = useState([]);
  const [materialNames, setMaterialNames] = useState([]);

  useEffect(() => {
    fetchMaterialGroups();
  }, []);

  // substancename 필드의 값을 가진 문서의 실제 ID를 알아내는 과정 적용
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

  const handlePartRecycledType = (e) => {
    setPartRecycledType(e.target.value);
  };

  const createMaterial = async () => {
    try {
      const partDocRef = doc(db, 'parts', currentPartID);
      const materialsCollectionRef = collection(partDocRef, 'materials');
      const newMaterial = {
        materialgroup: partmaterialgroup,
        materialname: partmaterialname,
        recycledcontent: Number(partrecycledcontents),
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
    { value: 'Pre & Post Consumer', label: 'Pre & Post Consumer' },
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

        {/* Material Group 항목 */}
        <Grid item xs={6}>
          <Typography variant="subtitle1" mb={1}>
            Material Group
          </Typography>
          <TextField
            id="outlined-basic"
            label="Select a Name"
            select
            variant="outlined"
            size="small"
            onChange={handlePartMaterialGroupChange}
            value={partmaterialgroup}
            sx={{ minWidth: '100%', maxWidth: '100%', mb: 2 }}
            className="override-input-styles" // MUI TextField 컴포넌트에 SweetAlert2스타일을 오버라이딩하기 위한 클래스 추가
          >
            {materialGroups.map((option) => (
              <MenuItem key={option.MaterialGroup} value={option.MaterialGroup}>
                {option.MaterialGroup}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Recycled Contents 항목 */}
        <Grid item xs={6}>
          <Typography variant="subtitle1" mb={1}>
            Recycled Contents (%)
          </Typography>
          <TextField
            id="outlined-basic"
            label="Select an Group"
            variant="outlined"
            size="small"
            onChange={handlePartRecycledContents}
            value={partrecycledcontents}
            sx={{ minWidth: '100%', mb: 2 }}
          />
        </Grid>

        {/* Material Name 항목 */}
        <Grid item xs={6}>
          <Typography variant="subtitle1" mb={1}>
            Material Name
          </Typography>
          <TextField
            id="outlined-basic"
            label="Select a Name"
            select
            variant="outlined"
            size="small"
            onChange={handlePartMaterialName}
            value={partmaterialname}
            sx={{ minWidth: '100%', maxWidth: '100%', mb: 2 }}
          >
            {materialNames.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Recycled Type 항목 */}
        <Grid item xs={6}>
          <Typography variant="subtitle1" mb={1}>
            Recycled Type
          </Typography>
          <TextField
            id="outlined-basic"
            label="Select an Name"
            select
            variant="outlined"
            size="small"
            onChange={handlePartRecycledType}
            value={partrecycledtype}
            sx={{ minWidth: '100%', maxWidth: '100%', mb: 2 }}
          >
            {recycledtype.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Material Mass(g) 항목 */}
        <Grid item xs={6}>
          <Typography variant="subtitle1" mb={1}>
            Material Mass (g)
          </Typography>
          <TextField
            id="outlined-basic"
            label="Select an Group"
            variant="outlined"
            size="small"
            onChange={handlePartMaterialMass}
            value={partmaterialmass}
            sx={{ minWidth: '100%', mb: 2 }}
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