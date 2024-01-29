import React, { useEffect, useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, Paper, TableContainer } from '@mui/material';
import { collection, doc, getDoc, getDocs, getFirestore } from 'firebase/firestore';

export default function RecyclabilityTable2({ productID }) {
  const [data, setData] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    const fetchData = async () => {
      let result = [];

      // 먼저 'products' 컬렉션에서 'category' 필드 확인
      const productRef = doc(db, 'products', productID);
      const productSnap = await getDoc(productRef);
      const category = productSnap.exists() ? productSnap.data().category : null;

      const partsRef = collection(db, 'products', productID, 'parts');
      const partsSnap = await getDocs(partsRef);

      for (const partDoc of partsSnap.docs) {
        const partData = partDoc.data();

        const fieldMapping = {
          'Other parts': 'PhoneOtherparts',
          'Pre-treatment materials': 'PhoneMonoM',
          'Battery': 'PhoneBattery'
        };

        const materialsRef = collection(db, 'products', productID, 'parts', partDoc.id, 'materials');
        const materialsSnap = await getDocs(materialsRef);

        for (const materialDoc of materialsSnap.docs) {
          const materialData = materialDoc.data();

          let recyclabilityRate = 0;

          if (category === '스마트폰') {
            // 'preprocess' 필드에 따라 다른 필드 값을 사용합니다.
            const field = fieldMapping[partData.preprocess];
            if (field && materialData[field]) {
              recyclabilityRate = materialData[field];
            }
          } else {
            if (partData.preprocess === "Other parts") {
              recyclabilityRate = materialData.CleanerAllother || 0;
            } else if (partData.preprocess === "Pre-treatment materials") {
              recyclabilityRate = materialData.CleanerPretreatment || 0;
            } else if (partData.preprocess === "Battery") {
              recyclabilityRate = materialData.CleanerBattery || 0;
            } else if (partData.preprocess === "PCB Assembly") {
              recyclabilityRate = materialData.CleanerPCBAssa || 0;
            } else if (partData.preprocess === "External electric cables") {
              recyclabilityRate = materialData.CleanerElecCable || 0;
            }
          }


          // reused 필드가 'Yes'인 경우, recyclabilityRate를 100으로 설정
          if (partData.reused === 'Yes') {
            recyclabilityRate = 100;
          }

          const recyclabilityMass = (materialData.materialmass * recyclabilityRate * 0.01) || 0;

          result.push({
            partName: partData.name,
            partMass: partData.weight,
            partReused: partData.reused,
            EoLScenario: partData.preprocess,
            materialName: materialData.materialname,
            materialMass: materialData.materialmass,
            recyclabilityRate: recyclabilityRate,
            recyclabilityMass: recyclabilityMass
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
            <TableCell {...tableCellStyles1}>Part Mass(g)</TableCell>
            <TableCell {...tableCellStyles1}>Reused Part</TableCell>
            <TableCell {...tableCellStyles1}>EoL Scenario</TableCell>
            <TableCell {...tableCellStyles1}>Material Name</TableCell>
            <TableCell {...tableCellStyles1}>Material Mass(g)</TableCell>
            <TableCell {...tableCellStyles1}>Recyclability Rate</TableCell>
            <TableCell align="center" sx={{ minWidth: '50px', backgroundColor: '#6F6F6F', fontWeight: 'bold', color: '#FFFFFF', fontSize: '1rem', }}>Recyclability Mass</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index} sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #111111' } }}>
              <TableCell {...tableCellStyles2} component="th" scope="row">{row.partName}</TableCell>
              <TableCell {...tableCellStyles2}>{row.partMass}</TableCell>
              <TableCell {...tableCellStyles2}>{row.partReused}</TableCell>
              <TableCell {...tableCellStyles2}>{row.EoLScenario}</TableCell>
              <TableCell {...tableCellStyles2}>{row.materialName}</TableCell>
              <TableCell {...tableCellStyles2}>{row.materialMass}</TableCell>
              <TableCell {...tableCellStyles2}>{row.recyclabilityRate}</TableCell>
              <TableCell align="center">{row.recyclabilityMass}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}