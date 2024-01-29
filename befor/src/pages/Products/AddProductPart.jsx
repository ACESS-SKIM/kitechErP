import { Close } from '@mui/icons-material';
import { Box, Button, Grid, IconButton, MenuItem, Stack, TablePagination, Typography } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import ListAltIcon from '@mui/icons-material/ListAlt';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Divider from '@mui/material/Divider';
import React, { useCallback, useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { db } from '../../api/firebase';
import { collection, getDocs, addDoc, doc, query, where, deleteDoc, onSnapshot, getDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import './CSS/sweetalert2.css';
import ViewMaterialListInProduct from './ViewMaterialList';
import Modal from '@mui/material/Modal';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function AddProductPart({ closeEvent, initialPartID }) {
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [productPartName, setProductPartName] = useState('');
  const [partSerialName, setPartMaterialName] = useState('');
  const [partQuantity, setPartQuantity] = useState('');
  const [materialNames, setMaterialNames] = useState([]);
  const [partWeight, setWeight] = useState("");
  const [partReused, setReused] = useState("");
  const [partMemo, setMemo] = useState("");
  const partsRef = collection(db, 'parts');
  const productPartsRef = collection(db, 'productparts');
  const [partNames, setPartNames] = useState([]);
  const [partsInProduct, setPartsInProduct] = useState([]);
  const [openMaterialModal, setOpenMaterialModal] = useState(false);
  const [productId, setProductId] = useState(initialPartID);
  const [currentPartId, setCurrentPartId] = useState(null);
  const [totalWeightInTable, setTotalWeightInTable] = useState(0);
  const [totalWeightInProduct, setTotalWeightInProduct] = useState(0);
  const [currentUserUid, setCurrentUserUid] = useState(null);

  useEffect(() => {
    if (currentUserUid) {
      fetchPartNames();
    }
  }, [currentUserUid]);

  useEffect(() => {
    if (productId) {
      const productDocRef = doc(db, 'products', productId);
      const unsubscribe = onSnapshot(collection(productDocRef, 'parts'), (snapshot) => {
        const newPartsInProduct = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPartsInProduct(newPartsInProduct);
        setRows(newPartsInProduct);
      });
      return () => unsubscribe();
    }
  }, [productId]);


  useEffect(() => {
    calculateTotalWeightInTable();
  }, [partsInProduct]);

  useEffect(() => {
    if (initialPartID) {
      fetchTotalWeightInProduct(initialPartID);
    }
  }, [initialPartID]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUserUid(user.uid);
        console.log("Logged-in user's UID:", user.uid);
      } else {
        // No user is signed in.
        setCurrentUserUid(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Part Name 드롭박스 (중복은 1번만 표기)
  const fetchPartNames = async () => {
    try {
      // 'parts' 컬렉션에서 데이터 가져오기
      const q1 = query(partsRef, where('allowuid', 'array-contains', currentUserUid));
      const partsSnapshot = await getDocs(q1);
      const partsDataFromParts = partsSnapshot.docs.map((doc) => doc.data().name);

      // 'productparts' 컬렉션에서 데이터 가져오기
      const q2 = query(productPartsRef, where('allowuid', '==', currentUserUid));
      const productPartsSnapshot = await getDocs(q2);
      const partsDataFromProductParts = productPartsSnapshot.docs.map((doc) => doc.data().name);

      // 두 데이터를 병합하고 중복 제거
      const combinedData = [...new Set([...partsDataFromParts, ...partsDataFromProductParts])];
      combinedData.sort();
      setPartNames(combinedData);

    } catch (error) {
      console.error('Error fetching parts names:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to fetch the parts names.',
        icon: 'error',
        customClass: {
          container: 'sweetalert-container',
        },
      });
    }
  };

  // 모든 Serial Name 항목 불러오기
  const fetchSerialNames = async (partName) => {
    try {
      const partsSnapshot = await getDocs(partsRef);
      const productPartsSnapshot = await getDocs(productPartsRef);

      const selectedPartDataFromParts = partsSnapshot.docs.filter((doc) => doc.data().name === partName);
      const selectedPartDataFromProductParts = productPartsSnapshot.docs.filter((doc) => doc.data().name === partName);

      const serialNamesFromParts = selectedPartDataFromParts.map((doc) => doc.data().serialname);
      const serialNamesFromProductParts = selectedPartDataFromProductParts.map((doc) => doc.data().serialname);

      // 두 리스트를 합치고 중복을 제거
      const combinedSerialNames = [...new Set([...serialNamesFromParts, ...serialNamesFromProductParts])];
      if (combinedSerialNames.length > 0) {
        setMaterialNames(combinedSerialNames);
      } else {
        console.error('No matching part found.');
      }
    } catch (error) {
      console.error('Error fetching serial names:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to fetch the serial names.',
        icon: 'error',
        customClass: {
          container: 'sweetalert-container',
        },
      });
    }
  };

  // parts, productparts 컬렉션에서 데이터 가져오기
  const fetchPartData = async (partName, partSerialName) => {
    try {
      // 우선 'parts' 컬렉션에서 데이터를 찾아보기
      let q = query(collection(db, 'parts'), where('name', '==', partName), where('serialname', '==', partSerialName));
      let partDocSnapshot = await getDocs(q);

      // 'parts'에서 데이터를 찾지 못했을 경우 'productparts'에서 시도
      if (partDocSnapshot.empty) {
        q = query(collection(db, 'productparts'), where('name', '==', partName), where('serialname', '==', partSerialName));
        partDocSnapshot = await getDocs(q);
        if (partDocSnapshot.empty) {
          console.error('No matching part found in both collections.');
          return null;
        }
      }

      const partDocData = partDocSnapshot.docs[0].data();
      const partDocId = partDocSnapshot.docs[0].id;
      const collectionName = partDocSnapshot.metadata.fromCache ? 'productparts' : 'parts';

      const materialsSnapshot = await getDocs(collection(db, `${collectionName}/${partDocId}/materials`));
      const materialsData = await Promise.all(materialsSnapshot.docs.map(async (doc) => {
        const materialData = doc.data();
        const materialId = doc.id;
        const substancesSnapshot = await getDocs(collection(db, `${collectionName}/${partDocId}/materials/${materialId}/substances`));
        const substancesData = substancesSnapshot.docs.map((doc) => doc.data());

        return { ...materialData, substances: substancesData };
      }));

      return { ...partDocData, materials: materialsData };
    } catch (error) {
      console.error('Error fetching part data:', error);
      return null;
    }
  };


  const fetchTotalWeightInProduct = async (productId) => {
    try {
      const productDoc = doc(db, 'products', productId);
      const productSnapshot = await getDoc(productDoc);

      if (productSnapshot.exists()) {
        const totalWeight = productSnapshot.data().weight;
        if (totalWeight) {
          setTotalWeightInProduct(totalWeight);
        }
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };


  // products에 데이터 추가
  const addPartDataToProduct = async (productId, partData) => {
    try {
      const productDocRef = doc(db, 'products', productId);
      const partsCollectionRef = collection(productDocRef, 'parts');
      const newPartDocRef = await addDoc(partsCollectionRef, partData);
      for (const material of partData.materials) {
        const materialsCollectionRef = collection(newPartDocRef, 'materials');
        const newMaterialDocRef = await addDoc(materialsCollectionRef, material);
        for (const substance of material.substances) {
          const substancesCollectionRef = collection(newMaterialDocRef, 'substances');
          await addDoc(substancesCollectionRef, substance);
        }
      }
    } catch (error) {
      console.error('Error adding part data to product:', error);
    }
  };

  const handlePartChange = useCallback((e) => {
    setProductPartName(e.target.value);
    fetchSerialNames(e.target.value);
  }, []);

  const handlePartSerialName = (e) => {
    setPartMaterialName(e.target.value);
  };

  const handlePartQuantity = (e) => {
    const quantity = e.target.value;
    // If the input is not a number, don't update the state
    if (isNaN(quantity)) {
      return;
    }
    // Otherwise, update the state with the new quantity
    setPartQuantity(quantity);
  };

  // 'weight', 'reused', 'memo' 조회
  const handleFetchInfo = async () => {
    try {
      const q1 = query(partsRef, where('name', '==', productPartName), where('serialname', '==', partSerialName));
      const q2 = query(productPartsRef, where('name', '==', productPartName), where('serialname', '==', partSerialName));

      const partsSnapshot = await getDocs(q1);
      const productPartsSnapshot = await getDocs(q2);

      let fetchedData;
      if (partsSnapshot.docs.length > 0) {
        fetchedData = partsSnapshot.docs[0].data();
      } else if (productPartsSnapshot.docs.length > 0) {
        fetchedData = productPartsSnapshot.docs[0].data();
      } else {
        console.error('No matching part found.');
        return;
      }

      setWeight(fetchedData.weight);
      setReused(fetchedData.reused);
      setMemo(fetchedData.memo);
    } catch (error) {
      console.error('Error fetching additional information:', error);
    }
  };

  // "부품등록" 버튼 클릭 이벤트 처리기
  const handleAddPart = async () => {
    const partData = await fetchPartData(productPartName, partSerialName); // 부품데이터 가져오기
    partData.quantity = partQuantity; // parts 하위컬렉션에 quantity 추가
    partData.totalWeight = partData.weight * partQuantity; // 무게 계산
    // 총 무게 체크 (partData.totalWeight : 'totalWeightInTable' + 추가할 무게 고려)
    if (totalWeightInTable + partData.totalWeight > totalWeightInProduct) {
      alert("부품의 총 무게가 제품 무게를 초과하였습니다.");
      return;
    }

    // Existing logic to add to 'products'
    await addPartDataToProduct(productId, partData);

    // Update the local state with the new part
    setPartsInProduct((prevParts) => [...prevParts, { ...partData, id: productId }])
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleOpenMaterialModal = (partId) => {
    setCurrentPartId(partId);
    setOpenMaterialModal(true);
  };

  const handleCloseMaterialModal = () => {
    setOpenMaterialModal(false);
  };

  const deletePart = (productId, partId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      customClass: {
        container: 'sweetalert-container',
      },
    }).then((result) => {
      if (result.value) {
        deleteApi(productId, partId);
      }
    });
  };

  const deleteApi = async (productId, partId) => {
    const partDoc = doc(db, "products", productId, "parts", partId);
    await deleteDoc(partDoc);
    Swal.fire({
      title: "Deleted!",
      text: "Your file has been deleted.",
      icon: "success",
      customClass: {
        container: 'sweetalert-container',
      },
    });
  };

  const calculateTotalWeightInTable = () => {
    const totalWeight = partsInProduct.reduce((sum, part) => sum + part.totalWeight, 0);
    setTotalWeightInTable(totalWeight);
  };

  const tableCellStyles = {
    align: 'center',
    style: { minWidth: '50px' },
    sx: { background: '#6F6F6F', color: 'Black', borderRight: '1px solid #111111', fontWeight: 'bold', color: '#FFFFFF', fontSize: '1rem' }
  };

  const tableCellStyles2 = {
    align: 'center',
    style: { minWidth: '50px', borderRight: '1px solid #111111', borderBottom: '1px solid #111111' },
  };

  return (
    <>
      {/* 제품 내 부품등록 팝업 제목부 */}
      <Box sx={{ m: 2 }} />
      <Typography variant="h4" align="center" sx={{ mb: 4 }}>
        Add Parts In Product
      </Typography>
      {/* 제품 내 부품 등록 팝업 우측 상단 닫기 아이콘 */}
      <IconButton
        style={{ position: "absolute", top: '0', right: '0' }}
        onClick={closeEvent}
      >
        <Close />
      </IconButton>
      <Box height={20} />
      <Grid container spacing={2}>
        {/* 'parts' 컬렉션의 모든 문서에 대한 부품명 불러오기 */}
        <Grid item xs={3}>
          <Typography variant="subtitle1" mb={1}>
            Part Name
          </Typography>
          <TextField
            label="Select a Part Name"
            select
            variant="outlined"
            size="small"
            onChange={handlePartChange}
            value={productPartName}
            sx={{ minWidth: '100%', maxWidth: '100%', mb: 2 }}
            className="override-input-styles" // MUI TextField 컴포넌트에 SweetAlert2스타일을 오버라이딩하기 위한 클래스 추가
          >
            {partNames.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* Serial Name 항목 */}
        <Grid item xs={3}>
          <Typography variant="subtitle1" mb={1}>
            Part Code
          </Typography>
          <TextField
            label="Select a Part Code"
            select
            variant="outlined"
            size="small"
            onChange={handlePartSerialName}
            value={partSerialName}
            sx={{ minWidth: '100%', maxWidth: '100%', mb: 2 }}
          >
            {materialNames.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* 부품 수량 항목 */}
        <Grid item xs={3}>
          <Typography variant="subtitle1" mb={1}>
            Part Quantity
          </Typography>
          <TextField
            type="number"
            label="Enter Part Quantity"
            variant="outlined"
            size="small"
            onChange={handlePartQuantity}
            value={partQuantity}
            sx={{ minWidth: '100%', mb: 2 }}
          />
        </Grid>

        {/* "조회" 버튼 */}
        <Grid item xs={3}>
          <Button variant="contained" onClick={handleFetchInfo} sx={{ mt: 4.5 }}>
            조회
          </Button>
        </Grid>

        {/* 무게항목 추가 */}
        <Grid item xs={3}>
          <Typography variant="subtitle1" mb={1}>
            Weight (g)
          </Typography>
          <TextField
            variant="outlined"
            size="small"
            value={partWeight}
            InputProps={{
              readOnly: true,
            }}
            sx={{ minWidth: '100%', mb: 2, bgcolor: 'lightgray' }}
          />
        </Grid>

        {/* Reused 항목 추가 */}
        <Grid item xs={3}>
          <Typography variant="subtitle1" mb={1}>
            Reused
          </Typography>
          <TextField
            variant="outlined"
            size="small"
            value={partReused}
            InputProps={{
              readOnly: true,
            }}
            sx={{ minWidth: '100%', mb: 2, bgcolor: 'lightgray' }}
          />
        </Grid>

        {/* Memo 항목 추가 */}
        <Grid item xs={3}>
          <Typography variant="subtitle1" mb={1}>
            Memo
          </Typography>
          <TextField
            variant="outlined"
            size="small"
            value={partMemo}
            InputProps={{
              readOnly: true,
            }}
            sx={{ minWidth: '100%', mb: 2, bgcolor: 'lightgray' }}
          />
        </Grid>

        {/* 부품등록 버튼 */}
        <Grid item xs>
          <Button variant="contained" onClick={handleAddPart} sx={{ mt: 4.5, mr: 2 }}>
            부품등록
          </Button>
        </Grid>
      </Grid>
      <Box sx={{ m: 3 }} />
      <Divider sx={{ mt: 2 }} />

      {/* Material View Open */}
      {openMaterialModal && (
        <Modal
          open={openMaterialModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <ViewMaterialListInProduct
              open={openMaterialModal}
              closeEvent={handleCloseMaterialModal}
              productId={productId}
              partId={currentPartId}
            />
          </Box>
        </Modal>
      )}

      {/* 무게 정보 표시 */}
      <Box position="relative" sx={{ maxHeight: 700, maxWidth: 1600 }}>
        <Typography variant="h10" position="absolute" right={0} top={-25}>
          {totalWeightInProduct !== undefined ? `무게정보 : ${totalWeightInTable} / ${totalWeightInProduct}` : "Loading..."}
        </Typography>

        {/* 테이블 헤더 */}
        <TableContainer sx={{ maxHeight: 700, maxWidth: 1600 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell {...tableCellStyles}>
                  Part Name
                </TableCell>
                <TableCell {...tableCellStyles}>
                  Serial Name
                </TableCell>
                <TableCell {...tableCellStyles}>
                  Reused Part
                </TableCell>
                <TableCell {...tableCellStyles}>
                  Weight | Total(g)
                </TableCell>
                <TableCell {...tableCellStyles}>
                  Quantity
                </TableCell>
                <TableCell {...tableCellStyles}>
                  Registrated Date
                </TableCell>
                <TableCell {...tableCellStyles}>
                  Memo
                </TableCell>
                <TableCell align="center" sx={{ minWidth: '50px', backgroundColor: '#6F6F6F', fontWeight: 'bold', color: '#FFFFFF', fontSize: '1rem', }}>
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length > 0 ? (
                rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((part, index) => (
                  <TableRow key={index}>
                    <TableCell {...tableCellStyles2}>{part.name}</TableCell>
                    <TableCell {...tableCellStyles2}>{part.serialname}</TableCell>
                    <TableCell {...tableCellStyles2}>{part.reused}</TableCell>
                    <TableCell {...tableCellStyles2}>{`${part.weight} | ${part.totalWeight}`}</TableCell>
                    <TableCell {...tableCellStyles2}>{part.quantity}</TableCell>
                    <TableCell {...tableCellStyles2}>
                      {new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date(part.date))}
                    </TableCell>
                    <TableCell {...tableCellStyles2}>{part.memo}</TableCell>
                    <TableCell align="center" sx={{ borderBottom: '1px solid #111111' }}>
                      <Stack spacing={2} direction="row" justifyContent="center">
                        <ListAltIcon
                          style={{
                            fontSize: "20px",
                            color: "blue",
                            cursor: "pointer",
                          }}
                          className="cursor-pointer"
                          onClick={() => handleOpenMaterialModal(part.id)}
                        />
                        <DeleteIcon
                          style={{
                            fontSize: "20px",
                            color: "darkred",
                            cursor: "pointer",
                          }}
                          onClick={() => deletePart(productId, part.id)}
                        />
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No data available.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20, 50]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
}