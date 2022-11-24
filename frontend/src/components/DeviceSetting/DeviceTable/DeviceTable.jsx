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
import { getCall } from '../../../Api/helpers'
import _ from "lodash";
import DeviceUpdate from "./DeviceUpdate"

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
        id: 'controllername',
        numeric: false,
        disablePadding: true,
        label: 'Controller Name',
    },
    {
        id: 'customername',
        numeric: false,
        disablePadding: true,
        label: 'Customer Name',
    },
    {
        id: 'lineName',
        numeric: false,
        disablePadding: false,
        label: 'LineName',
    },
    {
        id: 'fixturenumber',
        numeric: false,
        disablePadding: false,
        label: 'Fixture Number',
    },
    {
        id: 'gunservingmodel',
        numeric: false,
        disablePadding: false,
        label: 'Gun Serving Model',
    },

    {
        id: 'partname',
        numeric: false,
        disablePadding: false,
        label: 'Part Name ',
    },
    {
        id: 'spotcounterperjob',
        numeric: true,
        disablePadding: false,
        label: 'Spot Counter',
    },
    {
        id: 'tipchange',
        numeric: true,
        disablePadding: false,
        label: 'Tip Change ',
    },
    {
        id: 'tipdress',
        numeric: true,
        disablePadding: false,
        label: 'Tip Dress',
    },
    {
        id: 'isDeviceDeactivated',
        numeric: false,
        disablePadding: false,
        label: 'Is Device Deactivated ',
    },
    {
        id: 'deactivatedReason',
        numeric: false,
        disablePadding: false,
        label: 'Deactivated Reason ',
    },
];

function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
        props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead >
            <TableRow>
                <TableCell padding="checkbox">
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        sx={{ fontSize: 'small' }}
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

export default function DeviceTable({ deviceInfo , lineInfo }) {
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
            const newSelecteds = deviceInfo.map((n) => n.name);
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
        page > 0 ? Math.max(0, (1 + page) * rowsPerPage - deviceInfo.length) : 0;

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant='h6'  className="mb-2 pl-4" >Device Table</Typography>

            <Paper sx={{ width: '100%', mb: 2 }}>
                <TableContainer>
                    <Table
                        sx={{ minWidth: 500 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={deviceInfo.length}
                        />
                        <TableBody>

                            {stableSort(deviceInfo, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <StyledTableRow
                                            hover
                                            onClick={(event) => handleClick(event, row.controllername)}
                                            role="checkbox"
                                            tabIndex={-1}
                                            key={row.devicenumber}
                                        >
                                            <StyledTableCell padding="checkbox">
                                            </StyledTableCell>
                                            <StyledTableCell
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                paddingLeft="5px"
                                            >
                                                {row.controllername}
                                            </StyledTableCell>
                                            <StyledTableCell align="left">{row.customername}</StyledTableCell>
                                            <StyledTableCell align="left">{lineInfo.find(ob => ob.lineNo == row.lineNo).lineName}</StyledTableCell>
                                            <StyledTableCell align="left">{row.fixturenumber}</StyledTableCell>
                                            <StyledTableCell align="left">{row.gunservingmodel}</StyledTableCell>
                                            <StyledTableCell align="left">{row.partname}</StyledTableCell>
                                            <StyledTableCell align="right">{row.spotcounterperjob}</StyledTableCell>
                                            <StyledTableCell align="right">{row.tipchange}</StyledTableCell>
                                            <StyledTableCell align="right">{row.tipdress}</StyledTableCell>
                                            <StyledTableCell align="center">{'' + row.isDeviceDeactivated}</StyledTableCell>
                                            <StyledTableCell align="left">{row.deactivatedReason}</StyledTableCell>
                                            <StyledTableCell align="left"><DeviceUpdate LineData={lineInfo} DeviceData={row}></DeviceUpdate></StyledTableCell>


                                        </StyledTableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={deviceInfo.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}
