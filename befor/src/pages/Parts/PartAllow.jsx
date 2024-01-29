import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Paper, Checkbox } from '@mui/material';
import { Close } from '@mui/icons-material';
import { collection, query, where, getDocs, doc, updateDoc, deleteField, getDoc } from 'firebase/firestore';
import { db } from '../../api/firebase';

export default function PartAllow({ closeEvent, partDocId }) {
  const [users, setUsers] = useState([]);
  const [checkedUsers, setCheckedUsers] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      const userCollection = collection(db, 'users');
      const q = query(userCollection, where('authority', '==', '제품제조사'));
      const querySnapshot = await getDocs(q);
      const fetchedUsers = querySnapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id }));
      setUsers(fetchedUsers);
    };

    fetchUsers();
  }, []);

  // useEffect를 사용하여 checkbox 상태가 Firestore에 저장된 상태와 동기화 -> 체크 후 모달창 닫고 다시 열었을 떄 체크상태 유지
  // user상태가 변경될때마다 Firestore에서 allowuid 배열을 가져온 후 해당 배열을 사용하여 체크된 사용자를 설정
  // 구동 원리
  // 1. PartAllow 컴포넌트가 마운트될 때 Firestore에서 allowuid 배열 가져옴
  // 2. 가져온 allowuid 배열을 사용하여 checkedUsers 상태 설정
  useEffect(() => {
    const fetchAllowedUids = async () => {
      const partDocRef = doc(db, 'parts', partDocId);
      const docData = (await getDoc(partDocRef)).data();
      const allowedUids = docData.allowuid || [];

      // allowedUids를 사용하여 checkedUsers 상태를 설정합니다.
      const checkedState = {};
      for (const user of users) {
        checkedState[user.email] = allowedUids.includes(user.uid);
      }

      setCheckedUsers(checkedState);
    };

    if (users.length) {
      fetchAllowedUids();
    }
  }, [users, partDocId]);

  const handleCheckboxChange = async (user) => {
    const currentChecked = checkedUsers[user.email] || false;
    setCheckedUsers(prevState => ({
      ...prevState,
      [user.email]: !currentChecked
    }));

    // Firestore 업데이트 로직
    const partDocRef = doc(db, 'parts', partDocId); // prop으로 받은 partDocId를 사용

    // 현재 문서의 allowuid 배열 가져오기 (2개 이상 체크 반영)
    const docData = (await getDoc(partDocRef)).data();
    const currentUids = docData.allowuid || [];

    if (!currentChecked) {
      // 체크박스를 체크한 경우
      // 배열에 uid 추가
      if (!currentUids.includes(user.uid)) {
        currentUids.push(user.uid);
      }
    } else {
      // 체크박스를 해제한 경우
      // 배열에서 uid 제거
      const index = currentUids.indexOf(user.uid);
      if (index > -1) {
        currentUids.splice(index, 1);
      }
    }

    // 배열 업데이트
    await updateDoc(partDocRef, {
      allowuid: currentUids
    });
  };

  const tableCellStyles1 = {
    align: 'center',
    style: { minWidth: '50px', borderRight: '1px solid #111111', backgroundColor: '#6F6F6F', fontWeight: 'bold', color: '#FFFFFF', fontSize: '1rem' },
  };

  const tableCellStyles2 = {
    align: 'center',
    style: { minWidth: '50px', borderRight: '1px solid #111111', borderBottom: '1px solid #111111' },
  };

  return (
    <>
      <Box sx={{ m: 2 }} />
      <Typography variant="h4" align='center' sx={{ mb: 4 }}>
        Allowed Users
      </Typography>
      <IconButton
        style={{ position: "absolute", top: '0', right: '0' }}
        onClick={closeEvent}
      >
        <Close />
      </IconButton>

      <Paper sx={{ width: '100%', overflow: 'auto' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell {...tableCellStyles1}>구분</TableCell>
              <TableCell {...tableCellStyles1}>회사명</TableCell>
              <TableCell {...tableCellStyles1}>연락처</TableCell>
              <TableCell {...tableCellStyles1}>부서</TableCell>
              <TableCell {...tableCellStyles1}>이메일</TableCell>
              <TableCell {...tableCellStyles1}>담당자명</TableCell>
              <TableCell align="center" sx={{ minWidth: '50px', backgroundColor: '#6F6F6F', fontWeight: 'bold', color: '#FFFFFF', fontSize: '1rem', }}>공유여부</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.email} sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #111111' } }}>
                <TableCell {...tableCellStyles2}>{user.authority}</TableCell>
                <TableCell {...tableCellStyles2}>{user.company}</TableCell>
                <TableCell {...tableCellStyles2}>{user.contact}</TableCell>
                <TableCell {...tableCellStyles2}>{user.department}</TableCell>
                <TableCell {...tableCellStyles2}>{user.email}</TableCell>
                <TableCell {...tableCellStyles2}>{user.name}</TableCell>
                <TableCell align="center">
                  <Checkbox
                    checked={checkedUsers[user.email] || false}
                    onChange={() => handleCheckboxChange(user)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  )
}
