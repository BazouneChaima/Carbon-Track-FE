"use client";
import  React ,{useState,useEffect} from 'react'; 
import Typography from '@mui/material/Typography'; 
import { MuiButton } from '@/styles/theme/components/button';
import Stack from '@mui/material/Stack';  
import {Grid,Button,Card,Container} from '@mui/material';
import {Box,Drawer,TextField,IconButton } from '@mui/material';
import {PlusIcon,ExportIcon} from '@/icons';
import { UsersTable } from './users-table';
import dayjs from 'dayjs'; 
import Slide from '@mui/material/Slide';
import {header,body,HeaderBody,FooterBody,FooterBox} from '@/styles/theme/Bottom-drawer';
import CloseIcon from '@mui/icons-material/Close';
import NewUser from "./NewUser"
import UserDrawer from './UserDrawer';
import { useDispatch,useSelector } from 'react-redux';
import UserDrawer from './UserDrawer';
import { useDispatch,useSelector } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { setUsers } from '@/lib/store/reducer/userSlice';
import {userApis} from '@/lib/user/userApis';
import {User} from '@/types/user';
import { roleApis } from '@/lib/role/roleApis';
import {setRoles} from '@/lib/store/reducer/useRole';
import { setUsers } from '@/lib/store/reducer/userSlice';
import {userApis} from '@/lib/user/userApis';
import {User} from '@/types/user';
import { roleApis } from '@/lib/role/roleApis';
import {setRoles} from '@/lib/store/reducer/useRole';
interface UsersProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

 
function convertToCSV(data) {
  const csvRows = [];
  
  // Get headers
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(','));

  // Loop through rows
  for (const row of data) {
    const values = headers.map(header => {
      const escaped = ('' + row[header]).replace(/"/g, '\\"'); // Escape double quotes
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

function downloadCSV(data, filename = 'data.csv') {
  const csv = convertToCSV(data);
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}



export   function Users() { 
  const [isNewUser,setIsNewUser]=useState(false)
  const dispatch=useDispatch();
  const [user, setUser] = useState<User>({});
   
  const rowsPerPage = 5;
  const [pages,setPages]=useState(1);
  const [page, setPage] = useState(1);
  const [paginatedUser, setPaginatedUser] = useState<User[]>([]);
const {roles}=useSelector((state:any)=>state.role)
  const { users } = useSelector((state: any) => state.user);
  const dispatch=useDispatch();
  const [user, setUser] = useState<User>({});
  const page = 0;
  const rowsPerPage = 3;
  const [paginatedUser, setPaginatedUser] = useState<User[]>([]);
const {roles}=useSelector((state:any)=>state.role)
  const { users } = useSelector((state: any) => state.user);
  const dispatch=useDispatch();
  const [user, setUser] = useState<User>({});
  const page = 0;
  const rowsPerPage = 3;
  const [paginatedUser, setPaginatedUser] = useState<User[]>([]);
const {roles}=useSelector((state:any)=>state.role)
  const { users } = useSelector((state: any) => state.user);
  const handleNewUser=()=>{
    setIsNewUser(!isNewUser); 
    getRoles();
    getRoles();
   }
  const [newUser, setNewUser] = useState('');
const [value,setValue]=useState('');
  const handleCreateUser = () => {
    
    setNewUser('');
    handleClose();
  };
  const handleExportClick = () => {
    downloadCSV(users, 'users.csv');
  };
 
console.log("usersusersusersusers",users)

/*    dispatch(setTargets(res));
    setPaginatedTarget(applyPagination(res, page, rowsPerPage));
    setTarget(res);
  }, [page, rowsPerPage]); */

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




  const handleChangePage = ( newPage ) => {
    console.log("handle change page",page)
    setPage(newPage); 
  };


const getUsers= React.useCallback(async (): Promise<void> => {
  console.log("get users from user")
  try {
    const { res } = await userApis.getUsers();
    dispatch(setUsers(res)); 
    setUser(res);
    setPages(Math.ceil(res.length / rowsPerPage))
    console.log("rrrrrrrrr",res.length,rowsPerPage)
  } catch (error) {
    console.error('Error fetching users:', error); 
  }
 
    
      }, 
[page, rowsPerPage]); 

useEffect(() => {
  getUsers();
}, [getUsers]);

const handleClose=()=>{setIsNewUser(false);}
  
  
  return (
    <Stack spacing={6} sx={{ height: '80vh', overflowY: 'auto' }}>
     <Grid container alignItems="center" >
      <Grid item xs={6}>
        <Typography variant="h5"   sx={{ color: 'var(--Gray-900, #101828)' }}>
        Users list
        </Typography>
      </Grid> 
      <Grid item xs={6} container justifyContent="flex-end"
         sx={{display: 'flex',
         alignItems: 'flex-start',
         gap: 'var(--12, 12px)',
         }}
        >
    
    <Button 
      btnType="Primary"
      sx={{ ...MuiButton.styleOverrides.sizeSmall,
            borderRadius: "6px",
            border: '1px solid var(--Grey-grey-200, #B3B8C2)',
            background: 'var(--Colors-Base-00, #FFF)',
            justifyContent: 'flex-end',
            
        }}
        onClick={handleExportClick}
      startIcon={<ExportIcon fontSize="var(--icon-fontSize-sm)" />}  
        >
    <Typography variant="h7" sx={{ color: "var(--Grey-grey-600, #606977)" }}>
        Export
      </Typography>
    </Button>

     
     
    <Button
      btnType="Primary"
      sx={{
        ...MuiButton.styleOverrides.sizeSmall,
        borderRadius: "6px",
        justifyContent: 'flex-end',
        background: "var(--Green-green-500, #16B364)",
      }}

      onClick={handleNewUser}
      startIcon={<PlusIcon fontSize="var(--icon-fontSize-sm)" />}  
    >
      <Typography variant="h7" 
      sx={{ color: "var(--Colors-Base-00, #FFF)" }}
      >
        Add User
      </Typography>
    </Button>
  </Grid>
  <Grid>
  <Typography variant="bodyP3" sx={{color: "var(--Gray-600, #475467)"}}>
  Manage users and their account permissions here.
    </Typography>
    </Grid>
</Grid>
 
   
      <UsersTable
          count={paginatedUser.length}
          count={paginatedUser.length}
          page={page}
          rows={users}
          rows={users}
          rowsPerPage={rowsPerPage}
        />
 
        
     

{isNewUser  && (
<UserDrawer
 
        
     

{isNewUser  && (
<UserDrawer

open={isNewUser} handleCancelUser={handleClose} userUpdate={user} roles={roles} headerName="Add User" isUpdate={false}

 

/>
  )}
open={isNewUser} handleCancelUser={handleClose} userUpdate={user} roles={roles} headerName="Add User" isUpdate={false}

 

/>
  )}
    </Stack>
  );
}
function applyPagination(rows: any[], page: number, rowsPerPage: number): User[] {
function applyPagination(rows: any[], page: number, rowsPerPage: number): User[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}