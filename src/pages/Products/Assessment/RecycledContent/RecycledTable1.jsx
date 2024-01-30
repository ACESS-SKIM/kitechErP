import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { collection, doc, getDoc, getDocs, getFirestore } from 'firebase/firestore';

export default function RecycledTable1({ productID, handleWeights }) {
  const [preConsumerValue, setPreConsumerValue] = useState(0);
  const [postConsumerValue, setPostConsumerValue] = useState(0);
  const [unspecifiedValue, setUnspecifiedValue] = useState(0);
  const [preConsumerRatio, setPreConsumerRatio] = useState(0);
  const [postConsumerRatio, setPostConsumerRatio] = useState(0);
  const [unSpecifiedRatio, setUnSpecifiedRatio] = useState(0);
  const [productWeight, setProductWeight] = useState(1); // 초기값 1로 설정하여 0으로 나누는 것을 방지

  const db = getFirestore();

  // 제품의 무게를 가져오는 useEffect
  useEffect(() => {
    const fetchProductData = async () => {
      const productRef = doc(db, 'products', productID);
      const productDoc = await getDoc(productRef);

      if (productDoc.exists()) {
        setProductWeight(productDoc.data().weight || 1); // 만약 weight 값이 없으면 기본값 1로 설정
        console.log("RecycledTable1 - productWeight:", productDoc.data().weight || 1);
      } else {
        console.error("No such document!");
      }
    };

    fetchProductData();
  }, [db, productID]);

  // 비율을 계산하는 useEffect
  useEffect(() => {
    const fetchData = async () => {
      let preSum = 0;
      let postSum = 0;
      let unspecifiedSum = 0;

      const partsRef = collection(db, `products/${productID}/parts`);
      const partsSnap = await getDocs(partsRef);

      for (const part of partsSnap.docs) {
        const materialsRef = collection(db, `products/${productID}/parts/${part.id}/materials`);
        const materialsSnap = await getDocs(materialsRef);

        for (const material of materialsSnap.docs) {
          const recycledType = material.data().recycledtype;
          const value = (material.data().materialmass * material.data().recyclingcontent) / 100;

          if (recycledType === 'Pre Consumer') {
            preSum += value;
          } else if (recycledType === 'Post Consumer') {
            postSum += value;
          } else if (recycledType === 'Unspecified') {
            unspecifiedSum += value;
          }
        }
      }

      // 함유량 설정
      setPreConsumerValue(preSum);
      setPostConsumerValue(postSum);
      setUnspecifiedValue(unspecifiedSum);
      handleWeights({
        preConsumerValue,
        postConsumerValue,
        unspecifiedValue,
        preConsumerRatio,
        postConsumerRatio,
        unSpecifiedRatio,
        productWeight
      });

      // 함유율 계산
      const preConsumerRatioValue = ((preSum / productWeight) * 100).toFixed(2);
      const postConsumerRatioValue = ((postSum / productWeight) * 100).toFixed(2);
      const unSpecifiedRatioValue = ((unspecifiedSum / productWeight) * 100).toFixed(2);

      // 상태 업데이트
      setPreConsumerValue(preSum);
      setPostConsumerValue(postSum);
      setUnspecifiedValue(unspecifiedSum);
      setPreConsumerRatio(parseFloat(preConsumerRatioValue));
      setPostConsumerRatio(parseFloat(postConsumerRatioValue));
      setUnSpecifiedRatio(parseFloat(unSpecifiedRatioValue));

      // 계산된 값들을 바로 handleWeights에 전달
      handleWeights({
        preConsumerValue: preSum,
        postConsumerValue: postSum,
        unspecifiedValue: unspecifiedSum,
        preConsumerRatio: parseFloat(preConsumerRatioValue),
        postConsumerRatio: parseFloat(postConsumerRatioValue),
        unSpecifiedRatio: parseFloat(unSpecifiedRatioValue),
        productWeight
      });
    };

    fetchData();
  }, [db, productID, productWeight]); // productWeight를 의존성 배열에 추가

  const tableCellStyles1 = {
    align: 'center',
    style: { minWidth: '10px', borderRight: '1px solid #111111', backgroundColor: '#6F6F6F', fontWeight: 'bold', color: '#FFFFFF', fontSize: '0.9rem' },
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
            <TableCell {...tableCellStyles1}>Recycled Type</TableCell>
            <TableCell {...tableCellStyles1}>재생소재 함유량</TableCell>
            <TableCell align="center" sx={{ minWidth: '10px', backgroundColor: '#6F6F6F', fontWeight: 'bold', color: '#FFFFFF', fontSize: '0.9rem', }}>재생소재 함유율</TableCell>
          </TableRow>
          <TableRow sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #111111' } }}>
            <TableCell {...tableCellStyles1}>Pre Consumer</TableCell>
            <TableCell {...tableCellStyles2}>{preConsumerValue}</TableCell>
            <TableCell align="center">{preConsumerRatio}</TableCell>
          </TableRow>
          <TableRow sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #111111' } }}>
            <TableCell {...tableCellStyles1}>Post Consumer</TableCell>
            <TableCell align="center" style={{ border: '1px solid black' }}>{postConsumerValue}</TableCell>
            <TableCell align="center">{postConsumerRatio}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell {...tableCellStyles1}>Unspecified</TableCell>
            <TableCell align="center" sx={{ borderRight: '1px solid #111111' }}>{unspecifiedValue}</TableCell>
            <TableCell align="center">{unSpecifiedRatio}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

