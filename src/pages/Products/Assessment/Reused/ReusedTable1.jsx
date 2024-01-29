import React, { useEffect, useState } from 'react';
import { collection, getDocs, getFirestore, query, where } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export default function ReusedTable1({ productID, handleParts }) {
  const [reusedCount, setReusedCount] = useState(0);
  const [totalParts, setTotalParts] = useState(0);
  const db = getFirestore();

  useEffect(() => {
    const fetchData = async () => {
      // 'parts' 하위 컬렉션에서 'reused' 필드의 값이 'YES'인 문서들을 조회
      const partsRef = collection(db, 'products', productID, 'parts');
      const reusedQuery = query(partsRef, where('reused', '==', 'Yes'));
      const reusedSnapshot = await getDocs(reusedQuery);

      // 조회된 문서의 수를 저장
      setReusedCount(reusedSnapshot.size);

      // 'parts' 하위 컬렉션의 모든 문서의 수를 조회
      const totalPartsSnapshot = await getDocs(partsRef);
      setTotalParts(totalPartsSnapshot.size);

      handleParts({
        reusedCount: reusedSnapshot.size,
        totalParts: totalPartsSnapshot.size
      });

    };

    fetchData();
  }, [db, productID]);

  const tableCellStyles1 = {
    align: 'center',
    style: { minWidth: '50px', borderRight: '1px solid #111111', backgroundColor: '#6F6F6F', fontWeight: 'bold', color: '#FFFFFF', fontSize: '1rem' },
  };

  const tableCellStyles2 = {
    align: 'center',
    style: { minWidth: '50px', borderRight: '1px solid #111111', borderBottom: '1px solid #111111' },
  };

  return (
    <TableContainer>
      <Table sx={{ minWidth: 300 }} size="small">
        <TableHead>
          <TableRow sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #111111' } }}>
            <TableCell {...tableCellStyles1}>구분</TableCell>
            <TableCell {...tableCellStyles1}>항목수</TableCell>
            <TableCell align="center" sx={{ minWidth: '50px', backgroundColor: '#6F6F6F', fontWeight: 'bold', color: '#FFFFFF', fontSize: '1rem', }}>비율</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #111111' } }}>
            <TableCell {...tableCellStyles1}>Reused</TableCell>
            <TableCell {...tableCellStyles2}>{reusedCount}</TableCell>
            <TableCell align="center">{totalParts > 0 ? ((reusedCount / totalParts) * 100).toFixed(2) : 0}%</TableCell>
          </TableRow>
          <TableRow>
            <TableCell {...tableCellStyles1}>Total Parts</TableCell>
            <TableCell align="center" sx={{ borderRight: '1px solid #111111' }}>{totalParts}</TableCell>
            <TableCell align="center">100%</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
