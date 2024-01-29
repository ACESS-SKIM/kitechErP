import React, { useEffect, useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer } from '@mui/material';
import { collection, getDocs, getFirestore } from 'firebase/firestore';

export default function RecycledTable2({ productID }) {
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

          const recycledContent = (materialData.materialmass * (materialData.recyclingcontent || 0) * 0.01) || 0; // Recycled Content 계산

          result.push({
            partName: partData.name,
            partMass: partData.weight,
            partReused: partData.reused,
            recycledType: materialData.recycledtype || "",
            materialName: materialData.materialname,
            materialMass: materialData.materialmass,
            recyclingContent: materialData.recyclingcontent || "",
            recycledContent: recycledContent
          });
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
            <TableCell {...tableCellStyles1}>Recycled Type</TableCell>
            <TableCell {...tableCellStyles1}>Reused Part</TableCell>
            <TableCell {...tableCellStyles1}>Material Name</TableCell>
            <TableCell {...tableCellStyles1}>Material Mass(g)</TableCell>
            <TableCell {...tableCellStyles1}>Recycling Contents</TableCell>
            <TableCell align="center" sx={{ minWidth: '50px', backgroundColor: '#6F6F6F', fontWeight: 'bold', color: '#FFFFFF', fontSize: '1rem', }}>Recycled Content</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index} sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #111111' } }}>
              <TableCell {...tableCellStyles2} component="th" scope="row">{row.partName}</TableCell>
              <TableCell {...tableCellStyles2}>{row.recycledType}</TableCell>
              <TableCell {...tableCellStyles2}>{row.partReused}</TableCell>
              <TableCell {...tableCellStyles2}>{row.materialName}</TableCell>
              <TableCell {...tableCellStyles2}>{row.materialMass}</TableCell>
              <TableCell {...tableCellStyles2}>{row.recyclingContent}</TableCell>
              <TableCell align="center">{row.recycledContent}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}