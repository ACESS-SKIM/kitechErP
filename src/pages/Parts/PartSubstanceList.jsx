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
import { collection, doc, deleteDoc, onSnapshot } from 'firebase/firestore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';
import { IconButton, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Modal from '@mui/material/Modal';
import { db } from '../../api/firebase';
import './CSS/sweetalert2.css';
import AddPartSubstance from './AddPartSubstance';
import EditPartSubstance from './EditPartSubstance';

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
// currentPartID : 'parts'최상위 컬렉션의 선택된 문서 ID
// currentMaterialID : 'materials'하위컬렉션의 선택된 문서 ID
export default function PartSubstanceList({ closeEvent, initialPartID, initialMaterialID }) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [currentPartID, setCurrentPartID] = useState(initialPartID);
  const [currentMaterialID, setCurrentMaterialID] = useState(initialMaterialID);
  useEffect(() => {
  }, [currentMaterialID]);
  const [editPartSubstanceOpen, setEditPartSubstanceOpen] = useState(false);
  const [editSubstance, setEditSubstance] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleEditPartSubstanceOpen = () => setEditPartSubstanceOpen(true);
  const handleEditPartSubstanceClose = () => setEditPartSubstanceOpen(false);

  useEffect(() => {
    setCurrentPartID(initialPartID);
    setCurrentMaterialID(initialMaterialID);
  }, [initialPartID, initialMaterialID]);

  useEffect(() => {
    if (currentPartID && currentMaterialID) {
      const unsubscribe = getSubstances();
      return () => unsubscribe();  // cleanup on unmount
    }
  }, [currentPartID, currentMaterialID]);

  const getSubstances = () => {
    const substanceCollectionRef = collection(db, 'parts', currentPartID, 'materials', currentMaterialID, 'substances');
    return onSnapshot(substanceCollectionRef, (snapshot) => {
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

  const deleteUser = (id) => {
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
    const substanceDoc = doc(db, 'parts', currentPartID, 'materials', currentMaterialID, 'substances', id);
    await deleteDoc(substanceDoc);
    Swal.fire({
      title: 'Deleted!',
      text: 'Your Substance information has been deleted.',
      icon: 'success',
      customClass: {
        container: 'sweetalert-container',
      },
    });
    getSubstances();
  };

  const filterData = (v) => {
    if (v) {
      setRows(rows.filter((row) => row.substancename.includes(v.substancename)));
    } else {
      getSubstances();
    }
  };

  const editSubstacneData = (id, partsubstnacename, partcasnumber, partsubstancemass) => {
    const data = {
      id: id,
      substancename: partsubstnacename,
      casnumber: partcasnumber,
      substancemass: partsubstancemass,
    };
    setEditSubstance(data);
    handleEditPartSubstanceOpen();
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
            getOptionLabel={(rows) => rows.substancename || ''}
            renderInput={(params) => <TextField {...params} size="small" label="물질명 검색" />}
          />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}></Typography>
          <Button variant="contained" endIcon={<ControlPointOutlined />} onClick={handleOpen}>
            물질등록
          </Button>
        </Stack>
        <Box height={10} />
      </div>

      <div>
        <Modal open={open} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
          <Box sx={style}>
            <AddPartSubstance closeEvent={handleClose} currentPartID={currentPartID} currentMaterialID={currentMaterialID} />
          </Box>
        </Modal>
        <Modal open={editPartSubstanceOpen} onClose={handleEditPartSubstanceClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
          <Box sx={style}>
            <EditPartSubstance
              closeEvent={handleEditPartSubstanceClose}
              currentPartID={currentPartID}
              currentMaterialID={currentMaterialID}
              editSubstance={editSubstance}
              refreshMaterials={getSubstances}
            />
          </Box>
        </Modal>
      </div>

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <Typography gutterBottom variant="h5" component="div" sx={{ padding: '20px' }}>
          등록물질 리스트
        </Typography>

        <Divider sx={{ mt: 2 }} />

        <TableContainer sx={{ maxHeight: 700, maxWidth: 1600 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell {...tableHeadCellStyle}>
                  Substance Name
                </TableCell>
                <TableCell {...tableHeadCellStyle}>
                  CAS Number
                </TableCell>
                <TableCell {...tableHeadCellStyle}>
                  Substance Mass(g)
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
                      <TableCell {...tableBodyStyle}>{row.substancename}</TableCell>
                      <TableCell {...tableBodyStyle}>{row.casnumber}</TableCell>
                      <TableCell {...tableBodyStyle}>{row.substancemass}</TableCell>
                      <TableCell align="center">
                        <Stack spacing={2} direction="row" justifyContent="center">
                          <EditIcon
                            style={{ fontSize: '20px', color: 'blue', cursor: 'pointer' }}
                            className="cursor-pointer"
                            onClick={() => {
                              editSubstacneData(
                                row.id,
                                row.substancename,
                                row.casnumber,
                                row.substancemass,
                              );
                            }}
                          />
                          <DeleteIcon
                            style={{ fontSize: '20px', color: 'darkred', cursor: 'pointer' }}
                            onClick={() => {
                              deleteUser(row.id);
                            }}
                          />
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={4}>
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

      {/* {rows.length === 0 && (
        <>
          <Paper sx={{ width: '98%', overflow: 'hidden', padding: '12px' }}>
            <Box height={20} />
            <Skeleton variant="rectangular" width={'100%'} height={30} />
            <Box height={40} />
            <Skeleton variant="rectangular" width={'100%'} height={60} />
            <Box height={20} />
            <Skeleton variant="rectangular" width={'100%'} height={60} />
            <Box height={20} />
            <Skeleton variant="rectangular" width={'100%'} height={60} />
            <Box height={20} />
            <Skeleton variant="rectangular" width={'100%'} height={60} />
            <Box height={20} />
            <Skeleton variant="rectangular" width={'100%'} height={60} />
            <Box height={20} />
          </Paper>
        </>
      )} */}
    </>
  );
}
