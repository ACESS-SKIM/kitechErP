import * as React from 'react';
import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import { ControlPointOutlined } from '@mui/icons-material';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { db } from '../../api/firebase';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from 'sweetalert2';
import { TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Modal from '@mui/material/Modal';
import AddProduct from './AddProduct';
import EditProduct from './EditProduct';
import { useAppStore } from '../appStore';
import Skeleton from '@mui/material/Skeleton';
import AddProductPart from './AddProductPart';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import AssessmentIcon from '@mui/icons-material/Assessment';

// 모달창 스타일
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function ProductList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const empCollectionRef = collection(db, "products");
  // 모달창 변수 설정
  const [formid, setFormid] = useState('');
  const [open, setOpen] = useState(false);
  const [editopen, setEditOpen] = useState(false);
  const [viewproductpartlistopen, setViewProductPartListOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleOpenAddProductPart = () => setViewProductPartListOpen(true);
  const handleEditOpen = () => setEditOpen(true);
  const handleClose = () => setOpen(false);
  const handleEditClose = () => setEditOpen(false);
  const handleViewProductPartListClose = () => setViewProductPartListOpen(false);
  const setRows = useAppStore((state) => state.setRows);
  const rows = useAppStore((state) => state.rows);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    const data = await getDocs(empCollectionRef);
    setRows(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(event.target.value);
    setPage(0);
  };

  const deleteUser = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        deleteApi(id);
      }
    });
  };

  const deleteApi = async (id) => {
    const userDoc = doc(db, "products", id);
    await deleteDoc(userDoc);
    Swal.fire("Deleted!", "Your file has been deleted.", "success");
    getUsers();
  };

  const filterData = (v) => {
    if (v) {
      setRows([v]);
    } else {
      setRows([]);
      getUsers();
    }
  };

  const editProductData = (id, productcategory, productname, productmodelname, productweight, productdate, memo) => {
    const data = {
      id: id,
      category: productcategory,
      name: productname,
      modelname: productmodelname,
      weight: productweight,
      date: productdate,
      memo: memo,
    };
    setFormid(data);
    handleEditOpen();
  };


  return (
    <>
      <div>
        {/* 검색창, 등록버튼 만들기 (여기서부터) */}
        <Box height={10} />
        <Stack direction="row" spacing={2} className="my-2 mb-2">
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={rows}
            sx={{ width: 300 }}
            onChange={(e, v) => filterData(v)}
            getOptionLabel={(rows) => rows.name || ""}
            renderInput={(params) => (
              <TextField {...params} size="small" label="제품명 검색" />
            )}
          />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
          ></Typography>
          <Button variant="contained" endIcon={<ControlPointOutlined />} onClick={handleOpen}>
            제품등록
          </Button>
        </Stack>
        <Box height={10} />
        {/* 검색창 만들기 (여기까지) */}
      </div>

      <div>
        {/* 제품등록 버튼 클릭 시 모달창 Open 구현 */}
        <Modal
          open={open}
          // onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <AddProduct closeEvent={handleClose} />
          </Box>
        </Modal>

        {/* Part View 버튼 클릭 시 모달창 Open 구현 */}
        <Modal
          open={viewproductpartlistopen}
          // onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <AddProductPart
              closeEvent={handleViewProductPartListClose}
              initialPartID={formid} />
          </Box>
        </Modal>

        {/* Edit 버튼 클릭 시 모달창 Open 구현 */}
        <Modal
          open={editopen}
          // onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <EditProduct closeEvent={handleEditClose} fid={formid} />
          </Box>
        </Modal>
      </div>
      {rows.length > 0 && (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>

          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ padding: "20px" }}
          >
          </Typography>


          <Divider sx={{ mt: 2 }} />

          <TableContainer sx={{ maxHeight: 700, maxWidth: 1600 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell align='left' style={{ minWidth: '100px' }}>
                    Category
                  </TableCell>
                  <TableCell align='left' style={{ minWidth: '100px' }}>
                    Name
                  </TableCell>
                  <TableCell align='left' style={{ minWidth: '100px' }}>
                    Model Name
                  </TableCell>
                  <TableCell align='left' style={{ minWidth: '100px' }}>
                    Weight(g)
                  </TableCell>
                  <TableCell align='left' style={{ minWidth: '100px' }}>
                    Registrated Date
                  </TableCell>
                  <TableCell align='left' style={{ minWidth: '100px' }}>
                    Memo
                  </TableCell>
                  <TableCell align='left' style={{ minWidth: '100px' }}>
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    return (
                      <TableRow hover role="checkbox" tabIndex={-1} >
                        <TableCell key={row.productid} align='left'>
                          {row.category}
                        </TableCell>
                        <TableCell key={row.productid} align='left'>
                          {row.name}
                        </TableCell>
                        <TableCell key={row.productid} align='left'>
                          {row.modelname}
                        </TableCell>
                        <TableCell key={row.productid} align='left'>
                          {row.weight}
                        </TableCell>
                        <TableCell key={row.productdate} align='left'>
                          {new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).format(new Date(row.date))}
                        </TableCell>
                        <TableCell key={row.productid} align='left'>
                          {row.memo}
                        </TableCell>
                        <TableCell align="left">
                          <Stack spacing={2} direction="row">
                            {/* Action 항목 내 소재 추가 아이콘 */}
                            <AddCircleOutlineOutlinedIcon
                              style={{
                                fontSize: "20px",
                                color: "blue",
                                cursor: "pointer",
                              }}
                              className="cursor-pointer"
                              onClick={() => {
                                setFormid(row.id);  // 추가한 부분: 현재 행의 ID를 저장
                                handleOpenAddProductPart();
                              }}
                            />

                            <AssessmentIcon
                              style={{
                                fontSize: "20px",
                                color: "blue",
                                cursor: "pointer",
                              }}
                              className="cursor-pointer"
                            // onClick={() => {
                            //   viewMaterialsData(row.id);
                            // }}
                            />

                            <EditIcon
                              style={{
                                fontSize: "20px",
                                color: "blue",
                                cursor: "pointer",
                              }}
                              className="cursor-pointer"
                              onClick={() => {
                                editProductData(row.id, row.category, row.name, row.modelname, row.weight, row.date, row.memo);
                              }}
                            />
                            <DeleteIcon
                              style={{
                                fontSize: "20px",
                                color: "darkred",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                deleteUser(row.id);
                              }}
                            />
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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
      )}
      {/* skeleton : 데이터를 로딩하는 동안 회색으로 콘텐츠를 표시해주는 기능 */}
      {rows.length == 0 && (
        <>
          <Paper sx={{ width: '98%', overflow: 'hidden', padding: '12px' }}>
            <Box height={20} />
            <Skeleton variant='rectangular' width={'100%'} height={30} />
            <Box height={40} />
            <Skeleton variant='rectangular' width={'100%'} height={60} />
            <Box height={20} />
            <Skeleton variant='rectangular' width={'100%'} height={60} />
            <Box height={20} />
            <Skeleton variant='rectangular' width={'100%'} height={60} />
            <Box height={20} />
            <Skeleton variant='rectangular' width={'100%'} height={60} />
            <Box height={20} />
            <Skeleton variant='rectangular' width={'100%'} height={60} />
            <Box height={20} />
          </Paper>
        </>
      )}
    </>
  );
}





// 참고영상 : https://www.youtube.com/watch?v=BzN7rpJ_n_Q&list=PLwP3cL-MKVkNM28X96Dhc3BLMhtUktiik&index=7
// 참고문서 :
// 1. 테이블 만들기 : https://mui.com/material-ui/react-table/#data-table
// 2. 검색창 만들기 :
// 3. 제품추가 버튼 만들기 : 