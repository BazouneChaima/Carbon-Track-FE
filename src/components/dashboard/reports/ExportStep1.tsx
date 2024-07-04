import React,{useState,useEffect} from 'react';
import { VectorICon } from '@/icons';
import styled from '@emotion/styled'; 
import { Paperclip, X } from '@phosphor-icons/react';
import { useDispatch, useSelector } from 'react-redux';

import { clearFile, setFile } from '@/lib/store/reducer/useFile';
import { Button } from '@/components/commun/Button'; 
import { Target } from '@/types/target';
import { palette } from '@/styles/theme/colors';
import { MuiButton } from '@/styles/theme/components/button';
import {
  Box,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,Stepper,Step,StepLabel,
  TextField,
  Typography,
  Divider,
} from '@mui/material';
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

type ExportStepOneProps = {
  handleSaveFile: () => void;
};
export default function ExportStepOne() {
   
 /*  const [updatedTarget, setupdatedTarget] = useState<Target>(() => {
    const baseToTargetYear = target?.baseYear && target?.targetYear ? target.baseYear + '-' + target.targetYear : null;
    return { ...(target || {}), baseToTargetYear };
  }); */
  
  const [updatedTarget, setupdatedTarget] = useState<Target>();
   const dispatch = useDispatch();
    const [error, setError] = useState(false);
    const handleNext = () => {
      console.log('handleNext') 
     // onNext(updatedTarget);
      //setupdatedTarget('');
      //onClose();
    };
  
    const handleChange = (name: string, event: any) => {
      const regex = /^\d{4}-\d{4}$/;
      if (name == 'baseToTargetYear') {
        console.log('see year to ' + event);
        if (!regex.test(event)) {
          setError(true);
          setupdatedTarget({ ...updatedTarget, [name]: event });
        } else {
          const newString = event?.split('-');
          console.log('Update new string '+ newString[0])
          setupdatedTarget({ ...updatedTarget, baseYear: newString[0], targetYear: newString[1] , [name]: event });
          setError(false);
        }
      }else{
        setupdatedTarget({ ...updatedTarget, [name]: event });
      }
    };
  
 


  return (
    <Grid
      container
      xs={12}
      sx={{
        display: 'flex',
        flex: '1 0 0',
        padding: '24px 0px',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Grid item xs={10}>
        <Typography variant="h5" color="var(--Grey-grey-900, #1A1D21)" gutterBottom>
        Configuration
        </Typography>
        <Typography variant="body2" color="var(--Grey-grey-400, #888909F)">
        Control your report display by configuring the inputs of your reports.
          
        </Typography>

        <Grid
          container spacing={3} mt={3}  
           sx={{padding:"24px 32px",
            justifyContent:"flex-start",
            alignItems:"center",
            display: 'flex',
            marginTop: '8px',
            gap: '4px',
            alignSelf: 'stretch',
          }}
/*   sx={{
            display: 'flex',
            padding: '24px 32px',
            flexDirection: 'column',
            marginTop: '32px',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '22px',
            alignSelf: 'stretch',
            borderRadius: 'var(--Components-Pagination-Component-itemSizeSM, 24px)',
            border: '1px dashed var(--Foundation-Grey-grey-300, #787486)',
          }}  */         
        >
           
              
              <Typography variant="subtitle2">File Name</Typography>
              <TextField
                label="Categories"
                value={updatedTarget?.name}
                onChange={(e) => handleChange('name', e.target.value)}
                //onChange={(e) => setNewTask(e.target.value)}
                margin="normal"
                fullWidth
              />
              <Typography variant="subtitle2">Report Type</Typography>
              <FormControl fullWidth>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={updatedTarget?.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  label="Select"
                >
                  <MenuItem value="scopes">Scopes</MenuItem>
                  <MenuItem value="category">Category</MenuItem>
                  
                </Select>
              </FormControl>
              <Typography variant="subtitle2">Display</Typography>
              <FormControl fullWidth>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={updatedTarget?.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  label="Select"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="carbonbyscope">Carbon Emission By Scope</MenuItem>
                  <MenuItem value="scopes">Scopes</MenuItem>
                  <MenuItem value="monthlycarbon">Monthly Carbon Emission</MenuItem>
                  <MenuItem value="carbonbycategory">Carbon Emission By Category</MenuItem>
                </Select>
              </FormControl>

              <Typography variant="subtitle2">Type of Reporting</Typography>
              <FormControl fullWidth>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={updatedTarget?.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  label="Select"
                >
                  <MenuItem value="custom">custom</MenuItem>
                  <MenuItem value="custom1">custom1</MenuItem> 
                </Select>
              </FormControl>
 
              <Typography variant="subtitle2">Date Range</Typography>
              <TextField
                label="Base To Target Year"
                value={updatedTarget?.baseToTargetYear}
                onChange={(e) => handleChange('baseToTargetYear', e.target.value)}
                margin="normal"
                error={error}
                placeholder="YYYY - YYYY"
                fullWidth
              />

        <Typography variant="subtitle2">Display Per</Typography>
              <FormControl fullWidth>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={updatedTarget?.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  label="Select"
                >
                  <MenuItem value="year">Year</MenuItem>
                  <MenuItem value="month">month</MenuItem>
                  <MenuItem value="day">day</MenuItem>
                </Select>
              </FormControl>


              <Typography variant="subtitle2">File Type</Typography>
              <FormControl fullWidth>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={updatedTarget?.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  label="Select"
                >
                  <MenuItem value="pdf">pdf</MenuItem>
                  <MenuItem value="csv">csv</MenuItem> 
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
    
    
  );
}
