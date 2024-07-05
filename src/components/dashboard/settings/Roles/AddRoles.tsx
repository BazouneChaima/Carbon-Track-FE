import React, { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  Drawer,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Slide,
  TextField,
  Typography,
} from '@mui/material';
import Avatar from '@mui/material/Avatar';

import { body, FooterBody, FooterBox, header, HeaderBody } from '@/styles/theme/Bottom-drawer';

interface NewRoleProps {
  isnewRole: boolean;
  handlenewRole: () => void;
  handleCreateUser: (user: string) => void;
  handleClose: () => void;
}

const NewRole: React.FC<NewRoleProps> = ({ open, onClose, onCreateUser }) => {
  const [newRole, setNewRole] = useState('');
  const [value, setValue] = useState([]);
  const rolesData = [
    { id: 1, name: 'Role 1' },
    { id: 2, name: 'Role 2' },
    // Add more objects as needed
  ];
  const handleChange = () => {
    console.log('handle change');
  };
  const handleCreateUser = () => {
    //onCreateUser(newRole);
    setNewRole('');
    onClose();
  };

  return (
    <Drawer anchor="bottom" open={open} onClose={onClose}>
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
              Add Roles{' '}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="help">need help?</Typography>
              <IconButton onClick={onClose} sx={{ marginLeft: 8 }}>
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
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
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
              <Select label="Assigned To" value={value} onChange={handleChange} multiple fullWidth>
                {/* Populate options dynamically */}
                {rolesData.map((role) => (
                  <MenuItem key={role.id} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </Select>
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
              <Typography variant="h5" sx={{ color: 'var(--Grey-grey-900, #1A1D21)' }}>
                Role Permissions
              </Typography>
              <Typography variant="bodyP3" sx={{ color: 'var(--Grey-grey-400, #88909' }}>
                Customize role with specific permission to manage your software
              </Typography>
            </Box>

            <Grid container spacing={2} display="flex" flexDirection="row">
              {/* Grid items */}

              <Grid item xs={12}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <Typography variant="bodyB2" color="var(--Grey-grey-700, #4F5662)" style={{ margin: '0' }}>
                      Admin Access
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Box>
                      <Checkbox defaultChecked /> select all
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <Typography variant="bodyB2" color="var(--Grey-grey-700, #4F5662)" style={{ margin: '0' }}>
                      User Management
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Box>
                      <Checkbox defaultChecked /> Read
                    </Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Box>
                      <Checkbox defaultChecked /> Write
                    </Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Box>
                      <Checkbox defaultChecked /> Create
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              <Divider style={{ margin: '1rem 0', backgroundColor: 'red', strokeWidt: '1px' }} />
              {/* Repeat the same structure for other grid items */}
              <Grid item xs={12}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <Typography variant="bodyB2" color="var(--Grey-grey-700, #4F5662)" style={{ margin: '0' }}>
                      {' '}
                      Emission tracking
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Box>
                      <Checkbox defaultChecked /> Read
                    </Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Box>
                      <Checkbox defaultChecked /> Write
                    </Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Box>
                      <Checkbox defaultChecked /> Create
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <Typography variant="bodyB2" color="var(--Grey-grey-700, #4F5662)" style={{ margin: '0' }}>
                      Tasks
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Box>
                      <Checkbox defaultChecked /> Read
                    </Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Box>
                      <Checkbox defaultChecked /> Write
                    </Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Box>
                      <Checkbox defaultChecked /> Create
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <Typography variant="bodyB2" color="var(--Grey-grey-700, #4F5662)" style={{ margin: '0' }}>
                      Targets
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Box>
                      <Checkbox defaultChecked /> Read
                    </Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Box>
                      <Checkbox defaultChecked /> Write
                    </Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Box>
                      <Checkbox defaultChecked /> Create
                    </Box>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6}>
                    <Typography variant="bodyB2" color="var(--Grey-grey-700, #4F5662)" style={{ margin: '0' }}>
                      Reports
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Box>
                      <Checkbox defaultChecked /> Read
                    </Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Box>
                      <Checkbox defaultChecked /> Write
                    </Box>
                  </Grid>
                  <Grid item xs={2}>
                    <Box>
                      <Checkbox defaultChecked /> Create
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
                onClick={onClose}
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
                onClick={onClose}
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
  );
};

export default NewRole;
