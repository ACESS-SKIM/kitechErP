import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../api/firebase';

export default function AssesProductInfo({ productID }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, 'products', productID);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProduct(docSnap.data());
      } else {
        console.log('No such document!');
      }
    };
    fetchData();
  }, [productID]);

  const tableCellStyles1 = {
    align: 'center',
    style: { minWidth: '50px', borderRight: '1px solid #111111', backgroundColor: '#6F6F6F', fontWeight: 'bold', color: '#FFFFFF', fontSize: '1rem' },
  };

  const tableCellStyles2 = {
    align: 'center',
    style: { minWidth: '50px', borderRight: '1px solid #111111', borderBottom: '1px solid #111111' },
  };

  return (
    product && (
      <TableContainer>
        <Table sx={{ minWidth: 300 }} size="small">
          <TableBody>
            <TableRow sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #111111' } }}>
              <TableCell {...tableCellStyles1}>Category</TableCell>
              <TableCell align="center" >{product.category}</TableCell>
            </TableRow>
            <TableRow sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #111111' } }}>
              <TableCell {...tableCellStyles1}>Name</TableCell>
              <TableCell align="center" >{product.name}</TableCell>
            </TableRow>
            <TableRow sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #111111' } }}>
              <TableCell {...tableCellStyles1}>Modal Name</TableCell>
              <TableCell align="center" >{product.modelname}</TableCell>
            </TableRow>
            <TableRow sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #111111' } }}>
              <TableCell {...tableCellStyles1}>Weight (g)</TableCell>
              <TableCell align="center" >{product.weight}</TableCell>
            </TableRow>
            <TableRow sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #111111' } }}>
              <TableCell {...tableCellStyles1}>Date</TableCell>
              <TableCell align="center" >{product.date}</TableCell>
            </TableRow>
            <TableRow >
              <TableCell align="center" sx={{ borderRight: '1px solid #111111', minWidth: '50px', backgroundColor: '#6F6F6F', fontWeight: 'bold', color: '#FFFFFF', fontSize: '1rem', }}>Memo</TableCell>
              <TableCell align="center">{product.memo}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    )
  );
}
