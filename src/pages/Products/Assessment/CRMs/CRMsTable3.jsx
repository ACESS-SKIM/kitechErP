import React, { useEffect, useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer } from '@mui/material';
import { collection, getDocs, getFirestore } from 'firebase/firestore';

export default function CRMsTable3({ productID, productWeight }) {
  const [data, setData] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    const fetchData = async () => {
      let result = [];

      const partsRef = collection(db, 'products', productID, 'parts');
      const partsSnap = await getDocs(partsRef);

      for (const partDoc of partsSnap.docs) {
        const partData = partDoc.data();

        const materialsRef = collection(db, 'products', productID, 'parts', partDoc.id, 'materials');
        const materialsSnap = await getDocs(materialsRef);

        for (const materialDoc of materialsSnap.docs) {
          const materialData = materialDoc.data();

          const substancesRef = collection(db, 'products', productID, 'parts', partDoc.id, 'materials', materialDoc.id, 'substances');
          const substancesSnap = await getDocs(substancesRef);

          for (const substanceDoc of substancesSnap.docs) {
            const substanceData = substanceDoc.data();
            result.push({
              partName: partData.name,
              partMass: partData.weight,
              materialName: materialData.materialname,
              materialMass: materialData.materialmass,
              CRMName: substanceData.substancename,
              CASNo: substanceData.casnumber,
              CRMMass: substanceData.substancemass,
            });
          }
        }
      }

      setData(result);
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
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell {...tableCellStyles1}>Part Name</TableCell>
            <TableCell {...tableCellStyles1}>Part Mass(g)</TableCell>
            <TableCell {...tableCellStyles1}>Material Name</TableCell>
            <TableCell {...tableCellStyles1}>Material Mass(g)</TableCell>
            <TableCell {...tableCellStyles1}>CRMs Name</TableCell>
            <TableCell {...tableCellStyles1}>CAS No.</TableCell>
            <TableCell {...tableCellStyles1}>CRM Mass(g)</TableCell>
            <TableCell align="center" sx={{ minWidth: '50px', backgroundColor: '#6F6F6F', fontWeight: 'bold', color: '#FFFFFF', fontSize: '1rem', }}>CRM Mass(%)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index} sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #111111' } }}>
              <TableCell {...tableCellStyles2} component="th" scope="row">{row.partName}</TableCell>
              <TableCell {...tableCellStyles2}>{row.partMass}</TableCell>
              <TableCell {...tableCellStyles2}>{row.materialName}</TableCell>
              <TableCell {...tableCellStyles2}>{row.materialMass}</TableCell>
              <TableCell {...tableCellStyles2}>{row.CRMName}</TableCell>
              <TableCell {...tableCellStyles2}>{row.CASNo}</TableCell>
              <TableCell {...tableCellStyles2}>{row.CRMMass}</TableCell>
              <TableCell align="center">{productWeight > 0 ? ((row.CRMMass / productWeight) * 100).toFixed(2) + '%' : 'N/A'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}