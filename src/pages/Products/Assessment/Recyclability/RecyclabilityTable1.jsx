import React, { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs, getFirestore } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

export default function RecyclabilityTable1({ productID, onResultsCalculated }) {
  const [otherPartValue, setOtherPartValue] = useState(0);
  const [preTreatmentValue, setPreTreatmentValue] = useState(0);
  const [batteryValue, setBatteryValue] = useState(0);
  const [pcbAssemblyValue, setPCBAssemblyValue] = useState(0);
  const [externalElecCableValue, setExternalElecCableValue] = useState(0);
  const [phoneOtherPartValue, setPhoneOtherPartValue] = useState(0);
  const [phoneMonoValue, setPhoenMonoValue] = useState(0);
  const [phoneBatteryValue, setPhoneBatteryValue] = useState(0);
  const [category, setCategory] = useState(null);

  const db = getFirestore();

  async function fetchMaterials(partRef, preprocessType, reuse) {
    const materialsCollection = collection(partRef, 'materials');
    const materialsSnapshot = await getDocs(materialsCollection);
    let total = 0;

    for (let material of materialsSnapshot.docs) {
      const data = material.data();
      // 'reused' 필드가 'Yes'인 경우, 'materialmass' 필드의 값만 사용합니다.
      if (reuse === 'Yes') {
        total += data.materialmass;
      } else {
        const attribute = preprocessType === 'Other parts' ? 'CleanerAllother' :
          preprocessType === 'Pre-treatment materials' ? 'CleanerPretreatment' :
            preprocessType === 'Battery' ? 'CleanerBattery' :
              preprocessType === 'PCB Assembly' ? 'CleanerPCBAssa' :
                preprocessType === 'External electric cables' ? 'CleanerElecCable' : null;

        // 'attribute'가 null이 아니면 계산을 수행합니다.
        if (attribute && data[attribute]) {
          total += (data.materialmass * data[attribute] * 0.01);
        }
      }
    }

    return total;
  }

  async function fetchData(category) {
    const partsCollection = collection(db, 'products', productID, 'parts');
    const partsSnapshot = await getDocs(partsCollection);

    let otherPartTotal = 0;
    let preTreatmentTotal = 0;
    let batteryTotal = 0;
    let pcbAsssTotal = 0;
    let externalElecCableTotal = 0;
    let phoneOtherPartTotal = 0;
    let phoneMonoMaterialsTotal = 0;
    let phoneBatteryTotal = 0;

    for (let part of partsSnapshot.docs) {
      const partData = part.data();
      const reuse = partData.reused || 'No'; // 'reused' 필드의 기본값을 'No'로 설정합니다.

      if (category === '무선청소기') {
        if (partData.preprocess === 'Other parts') {
          otherPartTotal += await fetchMaterials(part.ref, partData.preprocess, reuse);
        } else if (partData.preprocess === 'Pre-treatment materials') {
          preTreatmentTotal += await fetchMaterials(part.ref, partData.preprocess, reuse);
        } else if (partData.preprocess === 'Battery') {
          batteryTotal += await fetchMaterials(part.ref, partData.preprocess, reuse);
        } else if (partData.preprocess === 'PCB Assembly') {
          pcbAsssTotal += await fetchMaterials(part.ref, partData.preprocess, reuse);
        } else if (partData.preprocess === 'External electric cables') {
          externalElecCableTotal += await fetchMaterials(part.ref, partData.preprocess, reuse);
        }
      } else if (category === '스마트폰') {
        // 스마트폰 카테고리에 대한 처리
        if (partData.preprocess === 'Other Parts') {
          phoneOtherPartTotal += await fetchMaterials(part.ref, 'PhoneOtherparts', reuse);
        } else if (partData.preprocess === 'Mono-Materials') {
          phoneMonoMaterialsTotal += await fetchMaterials(part.ref, 'PhoneMonoM', reuse);
        } else if (partData.preprocess === 'Battery') {
          phoneBatteryTotal += await fetchMaterials(part.ref, 'PhoneBattery', reuse);
        }
      }
    }

    // 상태 업데이트
    setOtherPartValue(otherPartTotal);
    setPreTreatmentValue(preTreatmentTotal);
    setBatteryValue(batteryTotal);
    setPCBAssemblyValue(pcbAsssTotal);
    setExternalElecCableValue(externalElecCableTotal);
    setPhoneOtherPartValue(phoneOtherPartTotal);
    setPhoenMonoValue(phoneMonoMaterialsTotal);
    setPhoneBatteryValue(phoneBatteryTotal);

    // 계산결과 호출
    if (onResultsCalculated) {
      onResultsCalculated({
        otherPartValue: otherPartTotal,
        preTreatmentValue: preTreatmentTotal,
        batteryValue: batteryTotal,
        pcbAssemblyValue: pcbAsssTotal,
        externalElecCableValue: externalElecCableTotal,
        phoneOtherPartValue: phoneOtherPartTotal,
        phoneMonoValue: phoneMonoMaterialsTotal,
        phoneBatteryValue: phoneBatteryTotal,
      });
    }
  }

  useEffect(() => {
    async function fetchCategory() {
      const productRef = doc(db, 'products', productID);
      const productSnap = await getDoc(productRef);

      if (productSnap.exists()) {
        const category = productSnap.data().category;
        setCategory(category); // 상태 업데이트
        fetchData(category); // 카테고리에 따라 데이터 가져오기
      } else {
        console.log("No such product!");
      }
    }

    fetchCategory();
  }, [productID]);




  const tableCellStyles1 = {
    align: 'center',
    style: { minWidth: '50px', borderRight: '1px solid #111111', backgroundColor: '#6F6F6F', fontWeight: 'bold', color: '#FFFFFF', fontSize: '1rem' },
  };

  return (
    <TableContainer>
      <Table sx={{ minWidth: 300 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell {...tableCellStyles1}>EoL Scenario</TableCell>
            <TableCell align="center" sx={{ minWidth: '50px', backgroundColor: '#6F6F6F', fontWeight: 'bold', color: '#FFFFFF', fontSize: '1rem', }}>Value(g)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {category === '무선청소기' && (
            <React.Fragment>
              <TableRow sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #111111' } }}>
                <TableCell {...tableCellStyles1}>Other Part</TableCell>
                <TableCell align="center" >{otherPartValue.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #111111' } }}>
                <TableCell {...tableCellStyles1}>Pre-treatment materials</TableCell>
                <TableCell align="center" >{preTreatmentValue.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #111111' } }}>
                <TableCell {...tableCellStyles1}>Battery</TableCell>
                <TableCell align="center" >{batteryValue.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #111111' } }}>
                <TableCell {...tableCellStyles1}>PCB Assembly</TableCell>
                <TableCell align="center" >{pcbAssemblyValue.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #111111' } }}>
                <TableCell {...tableCellStyles1}>External electric cables</TableCell>
                <TableCell align="center" >{externalElecCableValue.toFixed(2)}</TableCell>
              </TableRow>
            </React.Fragment>
          )}
          {category === '스마트폰' && (
            <React.Fragment>
              <TableRow sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #111111' } }}>
                <TableCell {...tableCellStyles1}>Other Parts</TableCell>
                <TableCell align="center" >{phoneOtherPartValue.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #111111' } }}>
                <TableCell {...tableCellStyles1}>Mono-Materials</TableCell>
                <TableCell align="center" >{phoneMonoValue.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #111111' } }}>
                <TableCell {...tableCellStyles1}>Battery</TableCell>
                <TableCell align="center" >{phoneBatteryValue.toFixed(2)}</TableCell>
              </TableRow>
            </React.Fragment>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};