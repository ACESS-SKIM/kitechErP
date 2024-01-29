import React, { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs, getFirestore } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';

export default function CRMsTable2({ productID, handleWeights }) {
  const [totalWeight, setTotalWeight] = useState(0);
  const [productWeight, setProductWeight] = useState(0);
  const db = getFirestore();

  useEffect(() => {
    const fetchData = async () => {
      let weightSum = 0;

      // Fetch the weight from the product document
      const productRef = doc(db, 'products', productID);
      const productDoc = await getDoc(productRef);
      setProductWeight(productDoc.data().weight);

      // 모든 substnacemass 값 가져와 합치기
      const partsRef = collection(db, `products/${productID}/parts`);
      const partsSnap = await getDocs(partsRef);

      for (const part of partsSnap.docs) {
        const materialsRef = collection(db, `products/${productID}/parts/${part.id}/materials`);
        const materialsSnap = await getDocs(materialsRef);

        for (const material of materialsSnap.docs) {
          const substancesRef = collection(db, `products/${productID}/parts/${part.id}/materials/${material.id}/substances`);
          const substancesSnap = await getDocs(substancesRef);

          for (const substance of substancesSnap.docs) {
            weightSum += substance.data().substancemass;
          }
        }
      }

      setTotalWeight(weightSum);
      handleWeights(weightSum, productWeight);
    };

    fetchData();
  }, [db, productID, handleWeights]);

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
        <TableBody>
          <TableRow sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #111111' } }}>
            <TableCell {...tableCellStyles1}>CRMs Total Weight (g)</TableCell>
            <TableCell align="center">{totalWeight}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell align="center" sx={{ minWidth: '50px', backgroundColor: '#6F6F6F', fontWeight: 'bold', color: '#FFFFFF', fontSize: '1rem', }}>Product Weight (g)</TableCell>
            <TableCell align="center" sx={{ borderLeft: '1px solid #111111' }}>{productWeight}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};