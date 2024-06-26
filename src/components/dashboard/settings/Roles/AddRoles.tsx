import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,FormControl,OutlinedInput,
   
  Drawer,
 
  Grid,
  IconButton,
  MenuItem,
  Select,
  Slide,Divider,
  TextField,
  Typography,Checkbox,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { roleApis } from '@/lib/role/roleApis';
import  { SelectChangeEvent } from '@mui/material/Select';
import { body, FooterBody, FooterBox, header, HeaderBody } from '@/styles/theme/Bottom-drawer';
import {Role} from '@/types/role'; 
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

interface NewRoleProps {
  open: boolean;
  handlenewRole: () => void; 
  handleCancelRole: () => void;
  users:any;
  newRole:any;
  setNewRole:any;
  newPermissions:any;
  headerName:any;
}
  
const NewRole: React.FC<NewRoleProps> = ({ open,handleCancelRole, users,newRole, setNewRole ,headerName  }) => {
   
  const [permissions, setPermissions] = useState({
    read_user_management: false,
    write_user_management: false,
    create_user_management: false,
    read_emission_tracking:false,
    write_emission_tracking:false,
    create_emission_tracking:false,
    read_task:false,
    write_task:false,
    create_task:false,
    read_targets:false,
    write_targets:false,
    create_targets:false,
    read_reports:false,
    write_reports:false,
    create_reports:false,
  });

  const [usersIds, setUsersIds] = React.useState<string[]>([]);
   

  const handleCreateRole =  async() => {
    console.log("handle create role")
    const selectedPermissions = Object.entries(permissions)
    .filter(([key, value]) => value) 
    .map(([key]) => key);  

   newRole = {
    ...newRole,
    permissions: selectedPermissions,  
    usersIds:usersIds
  };  
  setNewRole(newRole)
   
    const { res , error } = await roleApis.createRole(newRole);
    if (error) { 
      dispatch(setOpenToast({ message: error, type: 'error' }));
     return
   } 
   dispatch(setOpenToast({ message: 'Role Added Successfully', type: 'success' }));
    console.log('updated newRole with permissions:', newRole);
    handleCancelRole();
  };


   const handleCheckboxChange = (event) => {
    event.preventDefault();
    const { name, checked } = event.target;
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [name]: checked,
    }));

    const selectedPermissions = Object.entries(permissions)
    .filter(([key, value]) => value) // Filter only checked permissions (value is true)
    .map(([key]) => key); // Extract permission names

  const updatedNewRole = {
    ...newRole,
    permissions: selectedPermissions, // Update newRole with selected permissions
  };  
  setNewRole(updatedNewRole)
    
  };  


 /*  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setPermissions((prevPermissions) => {
      return checked && name === 'all'
        ? { ...prevPermissions, all: true } // Set only "all" to true
        : {
            ...prevPermissions,
            [name]: checked, // Update specific permission if not "all"
          };
    });
  }; */


  
    

  const handleMultiSelectChange = (event: SelectChangeEvent<typeof usersIds>) => {
    const {
      target: { value },
    } = event;
   /*  setUsersIds(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
 */
    /* const adjustedUsersIds = typeof updatedRole.usersIds === 'string'
    ? [updatedRole.usersIds] // Convert single user ID to array
    : updatedRole.usersIds; // Use array as is for multiple users
 */

    setUsersIds(
      typeof value === 'string' ? value.split(',') :value
    );
    
 
   setNewRole({ ...newRole, usersIds:   usersIds });

   

  };
  const handleChange = (name: string, event: Role) => {
   
    setNewRole({ ...newRole, [name]: event });
     
  };  
  
  const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>, name: string) => {
    const value = event.target.value as string | string[];
     console.log("handle select change",name,value)
    handleChange(name, value);
  };
  
  
 
 
  const handleCreateUser = () => {
    //onCreateUser(newRole);
    setNewRole('');
    handleCancelRole();
<<<<<<< HEAD
  };
  //this a async function to handle submit of roles
  const handleSubmit = async (event) => {
    event.preventDefault();
      const selectedPermissions = Object.entries(permissions)
      .filter(([key, value]) => value)
      .map(([key]) => key); // Extract selected permission keys

    dispatch(addRole({ name: roleName, permissions: selectedPermissions }));  
    // Handle success or error from the dispatched action
=======
>>>>>>> dac5812 (add assign task,add task ,add role,get all roles and start the update roles)
  };
  //this a async function to handle submit of roles
  const handleSubmit = async (event) => {
    event.preventDefault();
      const selectedPermissions = Object.entries(permissions)
      .filter(([key, value]) => value)
      .map(([key]) => key); // Extract selected permission keys

    dispatch(addRole({ name: roleName, permissions: selectedPermissions }));  
    // Handle success or error from the dispatched action
  };





  return (
<<<<<<< HEAD
<<<<<<< HEAD
    <form onSubmit={handleCreateRole}>
    
  
    <Drawer anchor="bottom" open={open} onClose={handleCancelRole}>
=======
    <form onSubmit={handleSubmit}>
    
  
    <Drawer anchor="bottom" open={open} onClose={onClose}>
>>>>>>> 1099567 (modify ui for add task,add modify drawer ,integration for some apis task)
=======
    <form onSubmit={handleCreateRole}>
    
  
    <Drawer anchor="bottom" open={open} onClose={handleCancelRole}>
>>>>>>> dac5812 (add assign task,add task ,add role,get all roles and start the update roles)
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
              {headerName}{' '}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="help">need help?</Typography>
              <IconButton onClick={handleCancelRole} sx={{ marginLeft: 8 }}>
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
              <Typography variant="subtitle3">Role Name *</Typography>
              <TextField
                label="Role Name *"
                value={newRole.name}
                
            onChange={(e) => handleChange('name', e.target.value)}
                margin="normal"
                fullWidth
              />
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '0.5rem',
                alignSelf: 'stretch',
              }}
            >
              <Typography variant="subtitle3">Assigned To</Typography>
              <FormControl  fullWidth> 
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          fullWidth
          value={usersIds}
          onChange={handleMultiSelectChange}
          input={<OutlinedInput label="Name" />}
          MenuProps={MenuProps}
        >
           {users && Array.isArray(users) ? ( // Check if users is an array and defined
            Object.entries(users).map(([key, value]) => (
              <MenuItem key={value._id} value={value._id}>
                {value.email}  
              </MenuItem>
              ))
        ) : (
          // Display a message while users are loading or unavailable
          <Typography variant="body2" sx={{ color: 'var(--Grey-grey-600, #606977)' }}>
            {users === undefined ? 'Loading targets...' : 'No targets available'}
          </Typography>
        )}
        </Select>
      </FormControl>
            </Box>

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: '0.5rem',
                alignSelf: 'stretch',
              }}
            >
              <Typography variant="h5" sx={{color:'var(--Grey-grey-900, #1A1D21)'}}>Role Permissions</Typography>
              <Typography variant="bodyP3" sx={{color:'var(--Grey-grey-400, #88909'}}>Customize role with specific permission to manage your software</Typography>
              
            </Box>
 

<Grid container spacing={2} display="flex" flexDirection="row">
      {/* Grid items */}

      <Grid item xs={12} >
      <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
          <Typography variant="bodyB2" color="var(--Grey-grey-700, #4F5662)" style={{ margin: "0" }}>Admin Access</Typography>
          </Grid>
          <Grid item xs={4}>
          <Box>
<<<<<<< HEAD
<<<<<<< HEAD
            <Checkbox name="all"   onChange={handleCheckboxChange} /> select all
=======
            <Checkbox   /> select all
>>>>>>> 1099567 (modify ui for add task,add modify drawer ,integration for some apis task)
=======
            <Checkbox name="all"   onChange={handleCheckboxChange} /> select all
>>>>>>> dac5812 (add assign task,add task ,add role,get all roles and start the update roles)
          </Box>
          </Grid>
          
      
        </Grid>
        </Grid>



      <Grid item xs={12} >
      <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
          <Typography variant="bodyB2" color="var(--Grey-grey-700, #4F5662)" style={{ margin: "0" }}>User Management</Typography>
          </Grid>
          <Grid item xs={2}>
          <Box>
<<<<<<< HEAD
<<<<<<< HEAD
            <Checkbox name="read_user_management"  onChange={handleCheckboxChange}   /> Read
=======
            <Checkbox name="userManagementRead"   /> Read
>>>>>>> 1099567 (modify ui for add task,add modify drawer ,integration for some apis task)
=======
            <Checkbox name="read_user_management"  onChange={handleCheckboxChange}   /> Read
>>>>>>> dac5812 (add assign task,add task ,add role,get all roles and start the update roles)
          </Box>
          </Grid>
          <Grid item xs={2}>
          <Box>
<<<<<<< HEAD
<<<<<<< HEAD
            <Checkbox name="write_user_management"  onChange={handleCheckboxChange}   /> Write
=======
            <Checkbox name="userManagementWrite"   /> Write
>>>>>>> 1099567 (modify ui for add task,add modify drawer ,integration for some apis task)
=======
            <Checkbox name="write_user_management"  onChange={handleCheckboxChange}   /> Write
>>>>>>> dac5812 (add assign task,add task ,add role,get all roles and start the update roles)
          </Box>
          </Grid>
          <Grid item xs={2}>
          <Box>
<<<<<<< HEAD
<<<<<<< HEAD
            <Checkbox name="create_user_management"  onChange={handleCheckboxChange}   /> Create
=======
            <Checkbox name="userManagementCreate"   /> Create
>>>>>>> 1099567 (modify ui for add task,add modify drawer ,integration for some apis task)
=======
            <Checkbox name="create_user_management"  onChange={handleCheckboxChange}   /> Create
>>>>>>> dac5812 (add assign task,add task ,add role,get all roles and start the update roles)
          </Box>
          </Grid>
      
        </Grid>
        </Grid>
        
  <Divider style={{ margin: "1rem 0", backgroundColor: "red" ,strokeWidt:"1px"}} />
      {/* Repeat the same structure for other grid items */}
      <Grid item xs={12}  >
      <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
          <Typography variant="bodyB2" color="var(--Grey-grey-700, #4F5662)" style={{ margin: "0" }}> Emission tracking</Typography>
          </Grid>
          <Grid item xs={2}>
          <Box>
<<<<<<< HEAD
<<<<<<< HEAD
            <Checkbox name="read_emission_tracking"  onChange={handleCheckboxChange}  /> Read
=======
            <Checkbox name="emissionTrackingRead"   /> Read
>>>>>>> 1099567 (modify ui for add task,add modify drawer ,integration for some apis task)
=======
            <Checkbox name="read_emission_tracking"  onChange={handleCheckboxChange}  /> Read
>>>>>>> dac5812 (add assign task,add task ,add role,get all roles and start the update roles)
          </Box>
          </Grid>
          <Grid item xs={2}>
          <Box>
<<<<<<< HEAD
<<<<<<< HEAD
            <Checkbox name="write_emission_tracking"  onChange={handleCheckboxChange}  /> Write
=======
            <Checkbox name="emissionTrackingWrite"    /> Write
>>>>>>> 1099567 (modify ui for add task,add modify drawer ,integration for some apis task)
=======
            <Checkbox name="write_emission_tracking"  onChange={handleCheckboxChange}  /> Write
>>>>>>> dac5812 (add assign task,add task ,add role,get all roles and start the update roles)
          </Box>
          </Grid>
          <Grid item xs={2}>
          <Box>
<<<<<<< HEAD
<<<<<<< HEAD
            <Checkbox name="create_emission_tracking"  onChange={handleCheckboxChange}  /> Create
=======
            <Checkbox name="emissionTrackingCreate"    /> Create
>>>>>>> 1099567 (modify ui for add task,add modify drawer ,integration for some apis task)
=======
            <Checkbox name="create_emission_tracking"  onChange={handleCheckboxChange}  /> Create
>>>>>>> dac5812 (add assign task,add task ,add role,get all roles and start the update roles)
          </Box>
          </Grid>
      </Grid>

      </Grid>
      <Grid item xs={12}  >
      <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
          <Typography variant="bodyB2" color="var(--Grey-grey-700, #4F5662)" style={{ margin: "0" }}>Tasks</Typography>
          </Grid>
           <Grid item xs={2}>
          <Box>
<<<<<<< HEAD
<<<<<<< HEAD
            <Checkbox  name="read_task" onChange={handleCheckboxChange}   /> Read
=======
            <Checkbox  name="TasksRead"   /> Read
>>>>>>> 1099567 (modify ui for add task,add modify drawer ,integration for some apis task)
=======
            <Checkbox  name="read_task" onChange={handleCheckboxChange}   /> Read
>>>>>>> dac5812 (add assign task,add task ,add role,get all roles and start the update roles)
          </Box>
          </Grid>
          <Grid item xs={2}>
          <Box>
<<<<<<< HEAD
<<<<<<< HEAD
            <Checkbox  name="write_task"  onChange={handleCheckboxChange} /> Write
=======
            <Checkbox  name="TasksWrite"   /> Write
>>>>>>> 1099567 (modify ui for add task,add modify drawer ,integration for some apis task)
=======
            <Checkbox  name="write_task"  onChange={handleCheckboxChange} /> Write
>>>>>>> dac5812 (add assign task,add task ,add role,get all roles and start the update roles)
          </Box>
          </Grid>
          <Grid item xs={2}>
          <Box>
<<<<<<< HEAD
<<<<<<< HEAD
            <Checkbox  name="create_task"   onChange={handleCheckboxChange} /> Create
=======
            <Checkbox  name="TasksCreate"   /> Create
>>>>>>> 1099567 (modify ui for add task,add modify drawer ,integration for some apis task)
=======
            <Checkbox  name="create_task"   onChange={handleCheckboxChange} /> Create
>>>>>>> dac5812 (add assign task,add task ,add role,get all roles and start the update roles)
          </Box>
          </Grid>
          </Grid>
      </Grid>
      
      <Grid item xs={12}  >
      <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
          <Typography variant="bodyB2" color="var(--Grey-grey-700, #4F5662)" style={{ margin: "0" }}>Targets</Typography>
          </Grid>
          <Grid item xs={2}>
          <Box>
<<<<<<< HEAD
<<<<<<< HEAD
            <Checkbox  name="read_targets" onChange={handleCheckboxChange}   /> Read
=======
            <Checkbox  name="TargetsRead"   /> Read
>>>>>>> 1099567 (modify ui for add task,add modify drawer ,integration for some apis task)
=======
            <Checkbox  name="read_targets" onChange={handleCheckboxChange}   /> Read
>>>>>>> dac5812 (add assign task,add task ,add role,get all roles and start the update roles)
          </Box>
          </Grid>
          <Grid item xs={2}>
          <Box>
<<<<<<< HEAD
<<<<<<< HEAD
            <Checkbox name="write_targets"  onChange={handleCheckboxChange} /> Write
=======
            <Checkbox name="TargetsWrite"   /> Write
>>>>>>> 1099567 (modify ui for add task,add modify drawer ,integration for some apis task)
=======
            <Checkbox name="write_targets"  onChange={handleCheckboxChange} /> Write
>>>>>>> dac5812 (add assign task,add task ,add role,get all roles and start the update roles)
          </Box>
          </Grid>
          <Grid item xs={2}>
          <Box>
<<<<<<< HEAD
<<<<<<< HEAD
            <Checkbox name="create_targets"  onChange={handleCheckboxChange}  /> Create
=======
            <Checkbox name="TargetsCreate"   /> Create
>>>>>>> 1099567 (modify ui for add task,add modify drawer ,integration for some apis task)
=======
            <Checkbox name="create_targets"  onChange={handleCheckboxChange}  /> Create
>>>>>>> dac5812 (add assign task,add task ,add role,get all roles and start the update roles)
          </Box>
          </Grid>
         </Grid>
      </Grid>




      <Grid item xs={12}  >
      <Grid container spacing={2} alignItems="center">
          <Grid item xs={6}>
          <Typography variant="bodyB2" color="var(--Grey-grey-700, #4F5662)" style={{ margin: "0" }}>Reports</Typography>
          </Grid>
          <Grid item xs={2}>
          <Box>
<<<<<<< HEAD
<<<<<<< HEAD
            <Checkbox name="read_reports" onChange={handleCheckboxChange}  /> Read
=======
            <Checkbox name="ReportsRead"   /> Read
>>>>>>> 1099567 (modify ui for add task,add modify drawer ,integration for some apis task)
=======
            <Checkbox name="read_reports" onChange={handleCheckboxChange}  /> Read
>>>>>>> dac5812 (add assign task,add task ,add role,get all roles and start the update roles)
          </Box>
          </Grid>
          <Grid item xs={2}>
          <Box>
<<<<<<< HEAD
<<<<<<< HEAD
            <Checkbox name="write_reports"  onChange={handleCheckboxChange} /> Write
=======
            <Checkbox name="ReportsWrite"   /> Write
>>>>>>> 1099567 (modify ui for add task,add modify drawer ,integration for some apis task)
=======
            <Checkbox name="write_reports"  onChange={handleCheckboxChange} /> Write
>>>>>>> dac5812 (add assign task,add task ,add role,get all roles and start the update roles)
          </Box>
          </Grid>
          <Grid item xs={2}>
          <Box>
<<<<<<< HEAD
<<<<<<< HEAD
            <Checkbox name="create_reports"  onChange={handleCheckboxChange} /> Create
=======
            <Checkbox name="ReportsCreate"   /> Create
>>>>>>> 1099567 (modify ui for add task,add modify drawer ,integration for some apis task)
=======
            <Checkbox name="create_reports"  onChange={handleCheckboxChange} /> Create
>>>>>>> dac5812 (add assign task,add task ,add role,get all roles and start the update roles)
          </Box>
          </Grid>
         </Grid>
      </Grid>
</Grid>

          </Box>
          <Divider sx={{ mt: 2 }} />
          <Grid sx={FooterBox}>
            <Grid sx={FooterBody}>
              <Button
                variant="contained"
                btnType="secondaryGray"
                onClick={handleCancelRole}
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
<<<<<<< HEAD
<<<<<<< HEAD
                onClick={handleCreateRole}
=======
                onClick={handleSubmit}
>>>>>>> 1099567 (modify ui for add task,add modify drawer ,integration for some apis task)
=======
                onClick={handleCreateRole}
>>>>>>> dac5812 (add assign task,add task ,add role,get all roles and start the update roles)
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

export default NewRole;
