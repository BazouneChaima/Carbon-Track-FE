import React,{useState,useCallback} from 'react';
import { DeleteIcon, ExportIcon, LocalizationHeadIcon, LocalizationIcon, ModifyIcon, PlusIcon } from '@/icons';
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
import { styled } from '@mui/material/styles';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { palette } from '@/styles/theme/colors';
import DeleteConfirmation from '@/components/commun/Alerts/DeleteConfirmation';
 
import { MuiButton } from '@/styles/theme/components/button';
import { boxFilterDropDown, Filter, outlinedInput } from '@/styles/theme/Filter';
import {CheckIcon,GreneIcon} from '@/icons';
 

 import { useDispatch, useSelector } from 'react-redux';
 import { userApis } from '@/lib/user/userApis';
 import {User} from '@/types/user';
 import {Role} from '@/types/role';
import { set } from 'react-hook-form';

import { setRoles } from '@/lib/store/reducer/useRole';
import { roleApis } from '@/lib/role/roleApis';

import RoleDrawer from './RoleDrawer';
import { setOpenToast } from '@/lib/store/reducer/useGlobalActions';
interface ListRolesProps {
roles:any;
roleToDelete:Role;

}
const ListRoles:  React.FC<ListRolesProps>  = ({roles}) => {
  const [open,setIsOpen]=useState(false);
  const [isDelete,setIsDelete]=useState(false);
  const [users, setUsers] = useState<User>({});
  const [newRole, setNewRole] = useState<Role>({});  
  const [roleToDelete,setRoleToDelete] = useState<Role | null>(null);
 
  const { user } = useSelector((state: any) => state.user); 
  const dispatch = useDispatch();
  const handleModify = async (role: Role) => {
    console.log("rooooole", role);
    await handleUsers();
    setNewRole(role);
    setIsOpen(!open);
    console.log("is open", open);
  };

const handleDelete= (role:Role) => {
  
  setIsDelete(!isDelete);setRoleToDelete(role);
};

   const onUpdateRole=()=>{

   }
   const handleUsers= React.useCallback(async (): Promise<void> => {
  
    try {
      const { res } = await userApis.getUsers();
      
      //dispatch(setUsers(res));
     setUsers(res)   
      
    } catch (error) {
      console.error('Error fetching users:', error); 
    }
   
      
        }, 
  [dispatch]);

  const handleDeleteRole = useCallback(async (): Promise<void> => {
    if (!roleToDelete) return;
    console.log("handle delete role===>", roleToDelete,user);

    const { error } = await roleApis.deleteRole(roleToDelete._id,user);
    if (error) {
      dispatch(setOpenToast({ message: error, type: 'error' }));
      return;
    }
    dispatch(setOpenToast({ message: 'Data Added Successfully', type: 'success' }));
    const newRoles = roles.filter((role) => role._id !== roleToDelete._id);

     dispatch(setRoles(newRoles));
    setIsDelete(false);
    setRoleToDelete(null);
  }, [dispatch,roleToDelete, roles]);





  const handleCancelRole=()=>{
    setIsOpen(false);
  }
  return (
    <Grid container spacing={2}>
      {roles.map((role) => (
        <Grid item key={role._id} xs={12} md={4}>
          <Paper variant="outlined">
            <List>
              <ListItem
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  flex: '1 0 0',
                }}
              >

                <ListItemText
                  primary={role.name}  
                  primaryTypographyProps={{ variant: 'h5', color: 'var(--Green-green-700, #4F5662)' }}
                />

{/* <ListItemIcon>
    <Box sx={{background: 'var(--Green-green-500, #16B364)', borderRadius: '22px',  display: 'flex',
    width: '16px',
    height: '16px',
    padding: '2px',
    justifyContent: 'center',
    alignItems: 'center',}}>
<CheckIcon  />
</Box>
<ListItemText
primary={location?.all}  
primaryTypographyProps={{ variant: 'bodyP3', color: 'var(--Green-green-500, #727C8D)' }}
/>
</ListItemIcon> */}
  {role?.permissions && role.permissions.map((permission) => (
                  <ListItemIcon> 
                  <Box sx={{background: 'var(--Green-green-500, #16B364)', borderRadius: '22px',  display: 'flex',
                width: '16px',
                height: '16px',
                padding: '2px',
                justifyContent: 'center',
                alignItems: 'center',}}>
                  <CheckIcon  />
                  </Box>

                
                    
                   <ListItemText
                     primary={permission?.replace(/_/g, ' ')}
                     primaryTypographyProps={{ variant: 'bodyP3', color: 'var(--Green-green-500, #727C8D)' }}
                   />
                
             
            
          </ListItemIcon>
  ))}
          







          {role?.users && role.users.map((user) => (
                  <ListItemIcon> 
                  <Box sx={{background: 'var(--Green-green-500, #16B364)', borderRadius: '22px',  display: 'flex',
                width: '16px',
                height: '16px',
                padding: '2px',
                justifyContent: 'center',
                alignItems: 'center',}}>
                  <GreneIcon  />
                  </Box>

                
                    
                   <ListItemText
                     primary={user?.username}
                     primaryTypographyProps={{ variant: 'bodyP3', color: 'var(--Green-green-500, #727C8D)' }}
                   />
                
             
            
          </ListItemIcon>
  ))}
             <ListItemSecondaryAction sx={{ justifyContent: 'flex-end', display: 'flex', top: '14%' }}>
  <Button aria-label="modify" sx={{ display: 'contents' }} onClick={()=>handleModify(role)}>
    <ModifyIcon />
  </Button>
 
  {/* Add spacing between buttons */}
  <Box sx={{ width: '10px' }} />  {/* Adjust width as needed */}

  <Button aria-label="delete" sx={{ display: 'contents', paddingRight: '15%' }}  onClick={()=>handleDelete(role)} >
    <DeleteIcon />
  </Button>
</ListItemSecondaryAction>

              </ListItem>
            </List>
           
                     
            
                 
          </Paper>
        </Grid>
      ))}
   

 {open  && (
<RoleDrawer

open={open} handleCancelRole={handleCancelRole} users={users} role={newRole} headerName="Edits Roles" isUpdate={true}

 

/>
  )}

      {isDelete && roleToDelete!=null && (
          <DeleteConfirmation
            open={isDelete}
            handleDelete={handleDeleteRole}
            setOpen={setIsDelete}
            title="Do you want to delete this role?"
            subtitle="Are you sure you want to delete this role."
            primary="Delete"
            secondary="Cancel"
            
          primaryColor={{ backgroundColor: palette.danger[500] }}
          />
      )}

       
    </Grid>
  );
};

export default ListRoles;
