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
import { roleApis } from '@/lib/role/roleApis';
import { SelectChangeEvent } from '@mui/material/Select';
import { useDispatch, useSelector } from 'react-redux';
import { setRoles } from '@/lib/store/reducer/useRole';
import { body, FooterBody, FooterBox, header } from '@/styles/theme/Bottom-drawer';
import { Role } from '@/types/role';
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

interface RoleDrawerProps {
  open: boolean;
  handleCancelRole: () => void;
  users: any;
  role: Role | null;
  headerName: string;
  isUpdate: boolean;
   
}

const RoleDrawer: React.FC<RoleDrawerProps> = ({ open, handleCancelRole, users, role, headerName, isUpdate }) => {
 console.log("role from edit===>",role)
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

  const [usersIds, setUsersIds] = useState<string[]>([]);
  const [currentRole, setCurrentRole] = useState<Role>(role || { name: '', permissions: [], usersIds: [] });
  const dispatch = useDispatch();
  const { roles } = useSelector((state: any) => state.role);

  useEffect(() => {
    if (role?.users) {
      const extractedIds = role.users.map((user) => user._id);
      setUsersIds(extractedIds);
    }
  }, [role?.users]);

  useEffect(() => {
    if (role?.permissions) {
      setPermissions((prevPermissions) => {
        const updatedPermissions = { ...prevPermissions };
        role.permissions.forEach((permission) => {
          updatedPermissions[permission] = true;
        });
        return updatedPermissions;
      });
    }
  }, [role?.permissions]);

  

  const handleSaveRole = async () => {
    const selectedPermissions = Object.entries(permissions)
      .filter(([key, value]) => value)
      .map(([key]) => key);

    const newRoleData = {
      ...currentRole,
      permissions: selectedPermissions,
      usersIds: usersIds,
    };

    setCurrentRole(newRoleData);

    if (isUpdate) {
      setCurrentRole({...currentRole,id:role?.id});
      console.log(newRoleData)
      const { error } = await roleApis.updateRole(newRoleData);
      if (error) {
        console.log("Update error:", error);
        dispatch(setOpenToast({ message: error, type: 'error' }));
        return;
      }
      dispatch(setOpenToast({ message: 'Role Updated Successfully', type: 'success' }));
      const updatedRoles = roles.map((r) => (r._id === newRoleData._id ? newRoleData : r));
      dispatch(setRoles(updatedRoles));
    } else {
      const { res, error } = await roleApis.createRole(newRoleData);
      if (error) {
        dispatch(setOpenToast({ message: error, type: 'error' }));
        return;
      }

   dispatch(setOpenToast({ message: 'Role Added Successfully', type: 'success' }));
      dispatch(setRoles([...roles, res?.role]));  
    console.log("add ",res.role) 
    }

    handleCancelData();
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [name]: checked,
    }));
  };

  const handleMultiSelectChange = (event: SelectChangeEvent<typeof usersIds>) => {
    const {
      target: { value },
    } = event;

    setUsersIds(typeof value === 'string' ? value.split(',') : value);
    setCurrentRole({ ...currentRole, usersIds: typeof value === 'string' ? value.split(',') : value });
  };

  const handleChange = (name: string, value: any) => {
    setCurrentRole((prevRole) => ({
      ...prevRole,
      [name]: value,
    }));
  };

  const handleCancelData=()=>{
    setCurrentRole({})
    handleCancelRole()
  }

  return (
    <form onSubmit={handleSaveRole}>
      <Drawer anchor="bottom" open={open} onClose={handleCancelData}>
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
                {headerName}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="help">need help?</Typography>
                <IconButton onClick={handleCancelData} sx={{ marginLeft: 8 }}>
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
                  value={currentRole.name}
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
                <FormControl fullWidth>
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
                    {users && Array.isArray(users) ? (
                      users.map((user) => (
                        <MenuItem key={user._id} value={user._id}>
                          {user.email}
                        </MenuItem>
                      ))
                    ) : (
                      <Typography variant="body2" sx={{ color: 'var(--Grey-grey-600, #606977)' }}>
                        {users === undefined ? 'Loading users...' : 'No users available'}
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
                <Typography variant="h5" sx={{ color: 'var(--Grey-grey-900, #1A1D21)' }}>Role Permissions</Typography>
                <Typography variant="bodyP3" sx={{ color: 'var(--Grey-grey-400, #88909' }}>Customize role with specific permissions to manage your software</Typography>
              </Box>

              <Grid container spacing={2} display="flex" flexDirection="row">
                <Grid item xs={12}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                      <Typography variant="bodyB2" color="var(--Grey-grey-700, #4F5662)" style={{ margin: "0" }}>Admin Access</Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Box>
                        <Checkbox name="all" onChange={handleCheckboxChange} /> select all
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                      <Typography variant="bodyB2" color="var(--Grey-grey-700, #4F5662)" style={{ margin: "0" }}>User Management</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Box>
                        <Checkbox name="read_user_management" checked={permissions.read_user_management} onChange={handleCheckboxChange} /> Read
                      </Box>
                    </Grid>
                    <Grid item xs={2}>
                      <Box>
                        <Checkbox name="write_user_management" checked={permissions.write_user_management} onChange={handleCheckboxChange} /> Write
                        </Box>
          </Grid>
          <Grid item xs={2}>
          <Box>
            <Checkbox name="create_user_management"  checked={permissions.create_user_management} onChange={handleCheckboxChange}   /> Create
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
            <Checkbox name="read_emission_tracking" checked={permissions.read_emission_tracking} onChange={handleCheckboxChange}  /> Read
          </Box>
          </Grid>
          <Grid item xs={2}>
          <Box>
            <Checkbox name="write_emission_tracking" checked={permissions.write_emission_tracking} onChange={handleCheckboxChange}  /> Write
          </Box>
          </Grid>
          <Grid item xs={2}>
          <Box>
            <Checkbox name="create_emission_tracking" checked={permissions.create_emission_tracking} onChange={handleCheckboxChange}  /> Create
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
            <Checkbox  name="read_task" checked={permissions.read_task} onChange={handleCheckboxChange}   /> Read
          </Box>
          </Grid>
          <Grid item xs={2}>
          <Box>
            <Checkbox  name="write_task" checked={permissions.write_task}  onChange={handleCheckboxChange} /> Write
          </Box>
          </Grid>
          <Grid item xs={2}>
          <Box>
            <Checkbox  name="create_task"  checked={permissions.create_task} onChange={handleCheckboxChange} /> Create
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
            <Checkbox  name="read_targets" checked={permissions.read_targets} onChange={handleCheckboxChange}   /> Read
          </Box>
          </Grid>
          <Grid item xs={2}>
          <Box>
            <Checkbox name="write_targets" checked={permissions.write_targets} onChange={handleCheckboxChange} /> Write
          </Box>
          </Grid>
          <Grid item xs={2}>
          <Box>
            <Checkbox name="create_targets" checked={permissions.create_targets} onChange={handleCheckboxChange}  /> Create
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
            <Checkbox name="read_reports" checked={permissions.read_reports} onChange={handleCheckboxChange}  /> Read
          </Box>
          </Grid>
          <Grid item xs={2}>
          <Box>
            <Checkbox name="write_reports"  checked={permissions.write_reports} onChange={handleCheckboxChange} /> Write
          </Box>
          </Grid>
          <Grid item xs={2}>
          <Box>
            <Checkbox name="create_reports" checked={permissions.create_reports} onChange={handleCheckboxChange} /> Create
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
                onClick={handleCancelData}
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
                onClick={handleSaveRole}
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

export default RoleDrawer;
