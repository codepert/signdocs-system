import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import isEqual from 'lodash/isEqual';

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { makeStyles } from '@material-ui/styles';

import ListItemText from '@mui/material/ListItemText';

import { fetchUsers } from '../../../../actions/user';
import { getAllUsers } from '../../../../reducers/selectors';

const useStyles = makeStyles({
  m10: {
    margin: 10,
  },
});

const columns = [
  { id: 'email', label: 'Email', minWidth: 170 },
  { id: 'firstName', label: 'Fist Name', minWidth: 100 },
  {
    id: 'lastName',
    label: 'Last Name',
    minWidth: 170,
  },
  {
    id: 'action',
    label: '',
    width: 50,
    align: 'right',
  },
];
export default function EmployeeIndexTable() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const classes = useStyles();

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const onChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const onChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const employees = useSelector(getAllUsers, isEqual);
  const employeeArray =
    employees && Object.keys(employees) ? Object.values(employees) : [];

  useEffect(() => {
    (async function getUsers() {
      setLoading(true);
      dispatch(fetchUsers()).done(() => setLoading(false));
    })();
  }, []);

  return (
    <Paper sx={{ width: '98%', overflow: 'hidden', margin: 'auto' }}>
      <Stack spacing={2} direction="row" className={classes.m10}>
        <Button variant="contained">
          <Link to="/employees/create">Add New</Link>
        </Button>
      </Stack>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {employeeArray
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover key={row.id}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id == 'action' ? (
                            <Link
                              to={`/employees/${row['id']}/edit`}
                              style={{
                                color: '#737373',
                              }}
                            >
                              <ListItemText>Edit</ListItemText>
                            </Link>
                          ) : (
                            value
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={employeeArray.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
      />
    </Paper>
  );
}
