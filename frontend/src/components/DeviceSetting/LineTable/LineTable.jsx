import * as React from 'react';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import styled from '@emotion/styled';
import { ERROR_CODE_DATA } from "../../../Api/apiPath";
import { getCall } from '../../../Api/helpers'
import _ from "lodash";
import { Button } from '@mui/material';
// import { capitalize } from '@material-ui/core';
import LineUpdate from "./LineUpdate"

// capitalize(text)


function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

// Table head data
const headCells = [
  {
    id: 'lineName',
    numeric: false,
    disablePadding: true,
    label: 'Line Name',
  },
  //   {
  //     id: 'count',
  //     numeric: true,
  //     disablePadding: false,
  //     label: 'Error code Occurance',
  //   },
  //   {
  //     id: 'description',
  //     numeric: false,
  //     disablePadding: false,
  //     label: 'Description',
  //   },
  //   {
  //     id: 'causeofalarm',
  //     numeric: false,
  //     disablePadding: false,
  //     label: 'Cause of Alarm',
  //   },
  //   {
  //     id: 'recomoperation',
  //     numeric: false,
  //     disablePadding: false,
  //     label: 'Measures to be taken ',
  //   },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead className='py-2' he >
      <TableRow className='py-2'>
        <TableCell padding="checkbox">
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ fontSize: 'medium' }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default function ErrorTable({ lineInfo }) {
  const [ErrorCodeData, setErrorCodeData] = useState([]);
  // const [lineInfo, setGroupedErrorData] = useState([]);

  // const getDataFromAPI = async () => {

  //     let {
  //         isApiConnectionSucceess,
  //         data
  //     } = await getCall({ path: `${ERROR_CODE_DATA}` });
  //     setErrorCodeData(data.data)
  //     // setIsDataLoading(false)

  //     storeErrorData()
  // }

  const storeErrorData = async () => {

    const names = _.countBy(lineInfo, 'error_code');
    // setGroupedErrorData(Object.keys(names).map(x => ({ name: x, count: names[x] })));

  }

  useEffect(() => {
    // getDataFromAPI()
  }, [])

  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('count');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = lineInfo.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - lineInfo.length) : 0;

  return (
    <Box sx={{ width: 500,alignSelf:"center" }} >
      <Typography variant='h6' className="pl-5 mb-2">Line Data</Typography>

      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ maxWidth: 500 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
           
            <TableBody>

              {stableSort(lineInfo, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <StyledTableRow
                      hover
                      onClick={(event) => handleClick(event, row.lineName)}
                      role="checkbox"
                      tabIndex={-1}
                      key={row.LineName}
                    >
                      <StyledTableCell padding="checkbox">
                      </StyledTableCell>
                      <StyledTableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="none"
                      >
                        {row.lineName}
                      </StyledTableCell>
                      <StyledTableCell align="right"><LineUpdate lineInfo={row}></LineUpdate></StyledTableCell>

                    </StyledTableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          sx={{ maxWidth: 500 }}
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={lineInfo.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  );
}
