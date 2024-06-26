import React, { useState, useEffect } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  FormControl,
  OutlinedInput,
  Drawer,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Slide,
  Divider,
  TextField,
  Typography,
  Checkbox,
} from '@mui/material';
import { userApis } from '@/lib/user/userApis';
import { SelectChangeEvent } from '@mui/material/Select';
import { useDispatch, useSelector } from 'react-redux';
import { setUsers } from '@/lib/store/reducer/useUser';
import { body, FooterBody, FooterBox, header } from '@/styles/theme/Bottom-drawer';
import { User } from '@/types/user';
import { EnvelopeIcon, LineIcon, LocKeyIcon } from '@/icons';
import {   InputAdornment } from '@mui/material';

import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { setOpenToast } from '@/lib/store/reducer/useGlobalActions';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

interface UserDrawerProps {
  open: boolean;
  handleCancelUser: () => void;
  
  roles:any;
   
  headerName: string;
  isUpdate: boolean;
   
  userUpdate:User | null;
}

const UserDrawer: React.FC<UserDrawerProps> = ({ open, handleCancelUser, userUpdate, roles, headerName, isUpdate }) => {
console.log("user rollles",roles)
  const [permissions, setPermissions] = useState({
    read_user_management: false,
    write_user_management: false,
    create_user_management: false,
    read_emission_tracking: false,
    write_emission_tracking: false,
    create_emission_tracking: false,
    read_task: false,
    write_task: false,
    create_task: false,
    read_targets: false,
    write_targets: false,
    create_targets: false,
    read_reports: false,
    write_reports: false,
    create_reports: false,
  });
 
  const [currentUser, setCurrentUser] = useState<User>(userUpdate || { username: '',email:'',password:''  });
  const dispatch = useDispatch(); 
  const {user}=useSelector((state:any)=>state.user)

  const [showPassword, setShowPassword] = React.useState<boolean>();
  console.log("user draweer",user.id)
  const handleSaveUser = async () => {
    
      console.log("setuccc",currentUser)
  

    if (isUpdate) {
      const newUserData = {
     
        // Exclude password property using destructuring assignment with rest syntax
        ...(Object.fromEntries(Object.entries(currentUser).filter(([key]) => key !== 'password'))),
      };
      
  
      setCurrentUser(newUserData);
      console.log("is update",Object.keys(newUserData))
      
      console.log("newUserData",newUserData,currentUser)
      const { error } = await userApis.updateUser(newUserData);
      if (error) {
        dispatch(setOpenToast({ message: error, type: 'error' }));
        return;
      }
      dispatch(setOpenToast({ message: 'User Updated Successfully', type: 'success' }));
      const updatedUsers = roles.map((r) => (r._id === newUserData._id ? newUserData : r));
      dispatch(setUsers(updatedUsers));
    } else {

      const { res, error } = await userApis.createUser(currentUser);
      if (error) {
        dispatch(setOpenToast({ message: error, type: 'error' }));
        return;
      }
      dispatch(setOpenToast({ message: 'User Added Successfully', type: 'success' }));
      dispatch(setUsers([...roles, res]));
    }

    handleCancelUser();
  };

  const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>, name: string) => {
    const value = event.target.value as string | string[];
     console.log("handle select change",name,value)
    handleChange(name, value);
  };

  

  const handleChange = (name: string, value: any) => {
    console.log("handle change",name,value)
    setCurrentUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSaveUser}>
    
  
    <Drawer anchor="bottom" open={open} onClose={handleCancelUser}>
      <Slide direction="up" in={open} mountOnEnter unmountOnExit>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={header}>
            <Typography
              variant="h4"
              sx={{
                color: 'var(--Foundation-Grey-grey-700, #121417)',
                fontFeatureSettings: '"cv04" on, "cv03" on, "cv02" on, "cv11" on, "clig" off, "liga" off',
              }}
            >
              {' '}
              Add User{' '}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="help">need help?</Typography>
              <IconButton onClick={handleCancelUser} sx={{ marginLeft: 8 }}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          <Box sx={body}>
               
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '0.5rem',
                alignSelf: 'stretch',
              }}
            >
              <Typography variant="h5" sx={{color:'var(--Grey-grey-900, #1A1D21)'}}>{headerName}</Typography> 
              
            </Box>
 


<Grid container spacing={2} display="flex" flexDirection="row">
      {/* Grid items */}

      <Grid item xs={12} >
      <Grid container spacing={2} alignItems="center">
           
         
      <Typography variant='subtitle3'>User Name *</Typography>
      <TextField
            
            value={currentUser.username}
            onChange={(e) => handleChange('username', e.target.value)}
            margin="normal"
            fullWidth
          />
      
        </Grid>
        </Grid>
        
  <Divider style={{ margin: "1rem 0", backgroundColor: "red" ,strokeWidt:"1px"}} />
      {/* Repeat the same structure for other grid items */}
      <Grid item xs={12}  >
      <Grid container spacing={2} alignItems="center">
          
      <Typography variant='subtitle3'>User Email * </Typography>
       <TextField
           
            value={currentUser.email}
            onChange={(e) => handleChange('email', e.target.value)}
            margin="normal"
            fullWidth
          />
      
      </Grid>

      </Grid>
      <Grid item xs={12}  >
      <Grid container spacing={2} alignItems="center">
         
              
      <Typography variant='subtitle3'>User Password *</Typography>
       
          <FormControl fullWidth margin='normal'>
                <OutlinedInput
                
                     
                value={currentUser.password}
                onChange={(e) => handleChange('password', e.target.value)}
                  endAdornment={
                    showPassword ? (
                      <EyeIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setShowPassword(false);
                        }}
                      />
                    ) : (
                      <EyeSlashIcon
                        cursor="pointer"
                        fontSize="var(--icon-fontSize-md)"
                        onClick={(): void => {
                          setShowPassword(true);
                        }}
                      />
                    )
                  }
                  placeholder="Password"
                  type={showPassword ? 'text' : 'password'}
                />
               </FormControl>

          </Grid>
      </Grid>
      
      <Grid item xs={12}  >
      <Grid container spacing={2} alignItems="center">
            
      <Typography variant='subtitle3'>Phone</Typography>
      <TextField
                  
                  value={currentUser.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  margin="normal"
                  fullWidth
                />


        
         </Grid>
      </Grid>


      <Grid item xs={12}  >
      <Grid container spacing={2} alignItems="center">
            
      <Typography variant='subtitle3'>Role</Typography>
      <FormControl fullWidth>
                <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={currentUser.role || ''}
                onChange={(e) => handleSelectChange(e, 'role')}
                label="Select"
                >
                    {roles && Array.isArray(roles) ? (
                      roles.map((role) => (
                        <MenuItem key={role._id} value={role._id}>
                          {role.name}
                        </MenuItem>
                      ))
                    ) : (
                      <Typography variant="body2" sx={{ color: 'var(--Grey-grey-600, #606977)' }}>
                        {roles === undefined ? 'Loading users...' : 'No roles available'}
                      </Typography>
                    )}
                  </Select>
                </FormControl>


        
         </Grid>
      </Grid>
 
</Grid>

          </Box>
          <Divider sx={{ mt: 2,color:"black" }} />
          <Grid sx={FooterBox}>
            <Grid sx={FooterBody}>
              <Button
                variant="contained"
                btnType="secondaryGray"
                onClick={handleCancelUser}
                sx={{
                  borderRadius: '0.375rem',
                  background: 'var(--Colors-Base-00, #FFF)',

                  border: '1px solid var(--Grey-grey-200, #B3B8C2)',
                }}
              >
                <Typography variant="subtitle3" sx={{ color: 'var(--Grey-grey-600, #606977)' }}>
                  Cancel
                </Typography>
              </Button>

              <Button
                variant="contained"
                btnType="primary"
                onClick={handleSaveUser}
                sx={{
                  borderRadius: '0.375rem',
                  background: 'var(--Green-green-500, #16B364)',
                }}
              >
              

              <Typography variant="subtitle3" sx={{ color: 'var(--Colors-Base-00, #FFF)' }}>
                  Confirm
                </Typography>


              </Button>
            </Grid>
          </Grid> 
        </Box>
      </Slide>
    </Drawer>
    </form>
  );
};

export default UserDrawer;
