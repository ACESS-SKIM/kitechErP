import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import { Close, ControlPointOutlined } from '@mui/icons-material';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import { IconButton, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Modal from '@mui/material/Modal';
import ListAltIcon from '@mui/icons-material/ListAlt';
import '../CSS/sweetalert2.css';
import { useAppStore } from '../../appStore';
import { db } from '../../../api/firebase';
import AddProductMaterial from './AddProductMaterial';
import EditProductMaterial from './EditProductMaterial';
import ProductSubstanceList from './ProductSubstanceList';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1200,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ProductMaterialList({ closeEvent, initialPartID }) {
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPartID, setCurrentPartID] = useState(initialPartID);
  const [currentMaterialId, setCurrentMaterialId] = useState(null);
  const [open, setOpen] = useState(false);
  const [editPartMaterialOpen, setEditPartMaterialOpen] = useState(false);
  const [editMaterial, setEditMaterial] = useState(null);
  const [partSubstanceListOpen, setPartSubstanceListOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleEditPartMaterialOpen = () => setEditPartMaterialOpen(true);
  const handleEditPartMaterialClose = () => setEditPartMaterialOpen(false);
  const { setSelectedMaterialId } = useAppStore();

  useEffect(() => {
    if (currentPartID) {
      console.log(currentPartID)
      const unsubscribe = getMaterials();
      return () => unsubscribe();  // cleanup on unmount
    }
  }, [currentPartID]);

  useEffect(() => {
    if (currentPartID) {
      getMaterials();
    }
  }, [currentPartID]);

  // Firestore의 'parts' 컬렉션과 'materials' 하위 컬렉션의 문서 정보를 가져오기 (getMaterials함수)
  const getMaterials = () => {
    const materialCollectionRef = collection(db, 'productparts', currentPartID, 'materials');
    return onSnapshot(materialCollectionRef, (snapshot) => {
      setRows(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const deleteMaterial = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      customClass: {
        container: 'sweetalert-container',
      },
    }).then((result) => {
      if (result.value) {
        deleteApi(id);
      }
    });
  };

  const deleteApi = async (id) => {
    const userDoc = doc(db, 'productparts', currentPartID, 'materials', id);
    await deleteDoc(userDoc);
    Swal.fire({
      title: 'Deleted!',
      text: 'Your file has been deleted.',
      icon: 'success',
      customClass: {
        container: 'sweetalert-container',
      },
    });
    getMaterials();
  };

  const filterData = (v) => {
    if (v) {
      setRows(rows.filter((row) => row.materialname.includes(v.materialname)));
    } else {
      getMaterials();
    }
  };

  const editMaterialData = (id, partmaterialgroup, partmaterialname, partrecycledcontent, partrecyclingcontent, partrecycledtype, partmaterialmass) => {
    const data = {
      id: id,
      materialgroup: partmaterialgroup,
      materialname: partmaterialname,
      recycledcontent: partrecycledcontent,
      recyclingcontent: partrecyclingcontent,
      materialmass: partmaterialmass,
      recycledtype: partrecycledtype,
    };
    setEditMaterial(data);
    handleEditPartMaterialOpen();
  };

  const viewSubstancesData = (id) => {
    setCurrentMaterialId(id);
    setCurrentPartID(currentPartID);
    setSelectedMaterialId(id); // 상태 업데이트
    setPartSubstanceListOpen(true);
  };

  const tableHeadCellStyle = {
    align: 'center',
    style: { minWidth: '50px', borderRight: '1px solid #111111', backgroundColor: '#6F6F6F', fontWeight: 'bold', color: '#FFFFFF', fontSize: '1rem' },
  };

  const tableBodyStyle = {
    align: 'center',
    style: { minWidth: '50px', borderRight: '1px solid #111111', borderBottom: '1px solid #111111' },
  };

  return (
    <>
      <div>
        <IconButton style={{ position: 'absolute', top: 0, right: 0 }} onClick={closeEvent}>
          <Close />
        </IconButton>
        <Box height={10} />
        <Stack direction="row" spacing={2} className="my-2 mb-2">
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={rows}
            sx={{ width: 300 }}
            onChange={(e, v) => filterData(v)}
            getOptionLabel={(option) => option.materialname || ''}
            getOptionKey={(option, index) => index}
            renderInput={(params) => <TextField {...params} size="small" label="소재명 검색" />}
          />

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}></Typography>
          <Button variant="contained" endIcon={<ControlPointOutlined />} onClick={handleOpen}>
            소재등록
          </Button>
        </Stack>
        <Box height={10} />
      </div>

      <div>
        <Modal open={open} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
          <Box sx={style}>
            <AddProductMaterial closeEvent={handleClose} currentPartID={currentPartID} />
          </Box>
        </Modal>

        {/* Substance 리스트 모달창 오픈 */}
        <Modal
          open={partSubstanceListOpen}
          onClose={() => setPartSubstanceListOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <ProductSubstanceList
              closeEvent={() => setPartSubstanceListOpen(false)}
              initialPartID={currentPartID}
              initialMaterialID={currentMaterialId}
            />
          </Box>
        </Modal>

        {/* Material 정보 수정 모달창 */}
        <Modal
          open={editPartMaterialOpen}
          onClose={handleEditPartMaterialClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <EditProductMaterial
              closeEvent={handleEditPartMaterialClose}
              currentPartID={currentPartID}
              editMaterial={editMaterial}
              refreshMaterials={getMaterials}
            />
          </Box>
        </Modal>
      </div>
      <div>
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <Typography gutterBottom variant="h5" component="div" sx={{ padding: '20px' }}>
            등록소재 리스트
          </Typography>

          <Divider sx={{ mt: 2 }} />

          <TableContainer sx={{ maxHeight: 700, maxWidth: 1600 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell {...tableHeadCellStyle}>
                    Material Group
                  </TableCell>
                  <TableCell {...tableHeadCellStyle}>
                    Material Name
                  </TableCell>
                  <TableCell {...tableHeadCellStyle}>
                    Recycled Contents
                  </TableCell>
                  <TableCell {...tableHeadCellStyle}>
                    Recycle Type
                  </TableCell>
                  <TableCell {...tableHeadCellStyle}>
                    Mass(g)
                  </TableCell>
                  <TableCell align="center" sx={{ minWidth: '50px', backgroundColor: '#6F6F6F', fontWeight: 'bold', color: '#FFFFFF', fontSize: '1rem', }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length > 0 ? (
                  rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} key={row.id} sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #111111' } }}>
                        <TableCell {...tableBodyStyle}>{row.materialgroup}</TableCell>
                        <TableCell {...tableBodyStyle}>{row.materialname}</TableCell>
                        <TableCell {...tableBodyStyle}>{row.recycledcontent}</TableCell>
                        <TableCell {...tableBodyStyle}>{row.recycledtype}</TableCell>
                        <TableCell {...tableBodyStyle}>{row.materialmass}</TableCell>
                        <TableCell {...tableBodyStyle}>
                          <Stack spacing={2} direction="row" justifyContent="center">
                            <ListAltIcon
                              style={{
                                fontSize: "20px",
                                color: "blue",
                                cursor: "pointer",
                              }}
                              className="cursor-pointer"
                              onClick={() => {
                                viewSubstancesData(row.id);
                              }}
                            />
                            <EditIcon
                              style={{ fontSize: '20px', color: 'blue', cursor: 'pointer' }}
                              className="cursor-pointer"
                              onClick={() => {
                                editMaterialData(
                                  row.id,
                                  row.materialgroup,
                                  row.materialname,
                                  row.recycledcontent,
                                  row.recyclingcontent,
                                  row.recycledtype,
                                  row.materialmass
                                );
                              }}
                            />
                            <DeleteIcon
                              style={{ fontSize: '20px', color: 'darkred', cursor: 'pointer' }}
                              onClick={() => {
                                deleteMaterial(row.id);
                              }}
                            />
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell align="center" colSpan={8}>
                      No data available.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20, 50]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    </>
  );
}
