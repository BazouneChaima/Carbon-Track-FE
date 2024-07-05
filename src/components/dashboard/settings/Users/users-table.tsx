'use client';

import React,{useState,useCallback} from 'react';
import Avatar from '@mui/material/Avatar'; 
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider'; 

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead'; 
import TableRow from '@mui/material/TableRow'; 
import dayjs from 'dayjs';
import { useSelection } from '@/hooks/use-selection'; 
import DropdownTableCell from '@/components/DropDown/DropdownTableCell';

import { roleApis } from '@/lib/role/roleApis';
import {setRoles} from '@/lib/store/reducer/useRole';

import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { setUsers } from '@/lib/store/reducer/userSlice';
 
import DeleteConfirmation from '@/components/commun/Alerts/DeleteConfirmation';
import { palette } from '@/styles/theme/colors';
import { useDispatch,useSelector } from 'react-redux';
import { Pagination } from '@/components/commun/Pagination/Pagination';
import usePagination from '@/hooks/use-pagination';

import {
  Box,
  Button,
  Grid,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  OutlinedInput,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
 
import {ModifyIcon,DeleteIcon} from "@/icons";
import {User} from '@/types/user';
import {Role} from '@/types/role';
import UserDrawer from './UserDrawer';
import { userApis } from '@/lib/user/userApis';
function noop(): void {
  // do nothing
}

 

interface UsersTableProps {
  count?: number;
  page?: number;
  pages:number,
  rows?: User[];
  handleChangePage:any;
  rowsPerPage?: number;
}

export function UsersTable({   rows = [], rowsPerPage = 5, handleChangePage,pages }: UsersTableProps): React.JSX.Element {
  const rowIds = React.useMemo(() => {
    return rows.map((user) => user.id);
  }, [rows]);
const [page,setPage]=useState(1)
  const [isDelete,setIsDelete]=useState(false);
  const dispatch=useDispatch();
  const [isChecked, setIsChecked] = useState(false); 

  const [userToDelete,setUserToDelete] = useState<User | null>(null);
  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);
  const {roles}=useSelector((state:any)=>state.role)
  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;
  const [open,setIsOpen]=useState(false);
 
  const [newUser, setNewUser] = useState<User>({}); 
  const paginatedRows = usePagination({ rows, page, pageSize: rowsPerPage });

  
  const handleDelete= (user:User) => {
  
    setIsDelete(!isDelete);setUserToDelete(user);
  };
 
  const updateChangePage = (event: any, newPage: any) => {
    console.log("update change data",newPage)
    setPage(newPage);
    handleChangePage(newPage);
  };

  const handleDeleteUser = useCallback(async (): Promise<void> => {
    if (!userToDelete) return;
    console.log("handle delete user===>", rows);

    const { error } = await userApis.deleteUser(userToDelete._id);
    if (error) {
      console.log("error",error)
      return;
    }
    const newUsers = rows.filter((user) => user._id !== userToDelete._id);
console.log("after filter",newUsers)
     dispatch(setUsers(newUsers));
    setIsDelete(false);
    setUserToDelete(null);
  }, [dispatch,userToDelete,rows]);
  const getRoles = React.useCallback(async (): Promise<void> => {
    try {
      const { error, res } = await roleApis.getRoles();
       
      
      if (error) {
        return;
      }
       
     
  
      dispatch(setRoles(res));
      setRoles(res);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, [dispatch]);

const handleClose=()=>{setIsOpen(false);}

  const handleModify = async (user: User) => {
    console.log("rooooole", user);
    await getRoles();
    setNewUser(user);
    setIsOpen(!open);
    console.log("is open", open);
  };





  const handleStatusChange = useCallback(async (userId: any, newStatus: boolean) => {
    try {
      const { error } = await userApis.updateUserStatus(userId); // Replace with your API call
      if (error) {
        console.error('Error updating user status:', error);
        // Handle error (e.g., display notification)
        return;
      }

      // Update local state if successful
      setIsChecked(newStatus);

      // Update user data in redux store (optional, if using redux)
      dispatch(setUsers(updatedUsers)); // Replace with actual update logic based on your redux setup
    } catch (error) {
      console.error('Error updating user status:', error);
      // Handle error (e.g., display notification)
    }
  }, [dispatch]); // Include dispatch if updating redux store















  return (
    <Card>
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
                <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Joined Date </TableCell>
              <TableCell>  </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows && paginatedRows.map((row) => {
              const isSelected = selected?.has(row.id);

              return (
                <TableRow hover key={row.id} selected={isSelected}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row.id);
                        } else {
                          deselectOne(row.id);
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>
                  <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                      <Avatar src={row.avatar} />
                      <Typography variant="bodyB3" sx={{olor:"var(--Grey-grey-600, #606977)"}}>{row.username} </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                  <Typography variant="bodyB3">{row.status}
                  {row.status=="active" ?(
                  <FormControlLabel
                  control={<Switch  color='primary' variant="solid" checked={row.status=="active" ? true : false} 
                  onChange={(event) => handleStatusChange(row._id, event.target.checked)} />} // Pass user ID and new status
                  label="Status"
                  color='white'
                />)
                :
                (
                  <FormControlLabel
                  control={<Switch  variant="solid" checked={row.status=="active" ? true : false} 
                  onChange={(event) => handleStatusChange(row._id, event.target.checked)} />} // Pass user ID and new status
                  label="Status"
                  color='green'
                />
                )
              }
                     </Typography>
                  </TableCell>
                  <TableCell>
                  <Stack sx={{ alignItems: 'flex-start',color:"var(--Green-green-500, #16B364)" }} direction="column" spacing={2}>
                      
                      <Typography variant="bodyP3" >{row.email} </Typography>
                          <Typography variant="bodyP3">{row.phone} </Typography>
                        </Stack>
                  </TableCell>
                  <TableCell> 
                  
                  <Typography variant="bodyP3" sx={{color:"var(--Grey-grey-400, #88909F)"}}> {row?.isAdmin ? 'true' :"no admin"} {row.role ? row.role.name : 'No role'}</Typography>
                       
                  </TableCell>
                  <TableCell> 
                  <Typography variant="bodyP3" sx={{color:"var(--Grey-grey-400, #88909F)"}}>{dayjs(row.joinedAt).format('MMM D, YYYY')} </Typography>
                  
                  </TableCell>
                  <TableCell>
                    <Stack  sx={{display: 'flex',alignItems: 'flex-end',gap: "var(--12, 12px), "}} direction="row">
                    <Button aria-label="modify" sx={{ display: 'contents' }} onClick={()=>handleModify(row)}>
    <ModifyIcon />
  </Button>
 
  <Button aria-label="modify" sx={{ display: 'contents' }}   onClick={()=>handleDelete(row)}>

                    <DeleteIcon/>
                    </Button>
                  
                    </Stack>
                     </TableCell>
                
                 
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {open  && (
<UserDrawer

open={open} handleCancelUser={handleClose} userUpdate={newUser} roles={roles} headerName="Edits Roles" isUpdate={true}

 
 


/>
  )}

{isDelete && userToDelete!=null && (
          <DeleteConfirmation
            open={isDelete}
            handleDelete={handleDeleteUser}
            setOpen={setIsDelete}
            title="Do you want to delete this user?"
            subtitle="Are you sure you want to delete this user."
            primary="Delete"
            secondary="Cancel"
            
          primaryColor={{ backgroundColor: palette.danger[500] }}
          />
      )}


        {open  && (
<UserDrawer

open={open} handleCancelUser={handleClose} userUpdate={newUser} roles={roles} headerName="Edits Roles" isUpdate={true}

 
 


/>
  )}

{isDelete && userToDelete!=null && (
          <DeleteConfirmation
            open={isDelete}
            handleDelete={handleDeleteUser}
            setOpen={setIsDelete}
            title="Do you want to delete this user?"
            subtitle="Are you sure you want to delete this user."
            primary="Delete"
            secondary="Cancel"
            
          primaryColor={{ backgroundColor: palette.danger[500] }}
          />
      )}

      </Box>
      <Divider />
      
      <Box style={{ display: 'flex', justifyContent: 'center' }}>
      <Pagination
          paginatioType="gray"
          // color='gray'
          //count={pages} // Total number of pages
          count={pages}
          page={page}
          onChange={updateChangePage}
          size="small"
          showFirstButton
          showLastButton
          shape="rounded"
        />
      </Box>


    </Card>
  );
}
