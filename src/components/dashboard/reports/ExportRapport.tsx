import React,{useState} from 'react';
import { VectorICon } from '@/icons';
import styled from '@emotion/styled';
import { Box, Grid, Stack, Typography } from '@mui/material';
import { Paperclip, X } from '@phosphor-icons/react';
import { useDispatch, useSelector } from 'react-redux';

import { clearFile, setFile } from '@/lib/store/reducer/useFile';
import { Button } from '@/components/commun/Button';
import { IconButton } from '@/components/commun/Button/IconButton';
import { palette } from '@/styles/theme/colors';
import { MuiButton } from '@/styles/theme/components/button';
import { CarbonEmissionsCategory } from '../overview/CarbonEmissionsCategory';
import { LatestOrders } from '../overview/latest-orders';
import { MonthlyCarbonEmissions } from '../overview/MonthlyCarbonEmissions';
import { CarbonEmissionsScope } from '../overview/CarbonEmissionsScope';
import { Tasks } from '../overview/Tasks';
import { Reduction } from '../overview/Reduction';
import { TotalEmissions } from '../overview/TotalEmissions';
import { CarbonPerMonth } from '../overview/CarbonPerMonth';
import Scopes from '../overview/Scopes';
import { ShareIcon } from '@/icons';
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

type ExportStep1Props = {
  handleSaveFile: () => void;
};
export default function ExportStep1() {
  const dispatch = useDispatch();
  const { file } = useSelector((state: any) => state.file);
  const [updatedTarget, setupdatedTarget] = useState<Target>();
  const handleFileChange = (event: any) => {
    const selectedFile = event.target.files[0];
    dispatch(setFile(selectedFile));
  };
  const [isActiveShare,setIsActiveShare]=useState(false); 
 
   const [error, setError] = useState(false);
   const handleUpdateTarget = () => {
     console.log('update')
    // onUpdateTarget(updatedTarget);
     //setupdatedTarget('');
     //onClose();
   };
   const handleShare=()=>{
     setIsActiveShare(!isActiveShare);
   }
   const handleSendShare=()=>{
 
   }
   const handleClseShare=()=>{
     setIsActiveShare(false);
 
 
   }
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
  <Grid container xs={12} sx={{padding:"24px 32px",justifyContent:"center",alignItems:"center"}}>
        <Grid item xs={10}>
        <Typography variant="h3" color="var(--Grey-grey-900, #1A1D21)" gutterBottom>
        Preview
        </Typography>
        <Typography variant="bodyP2" color="var(--Grey-grey-400, #88909F)" >
        you can see a preview of uploaded file to confirm that the data are correct
        </Typography> 
      </Grid>
     
      <Grid item xs={2} container justifyContent="flex-end">
       
        <Grid item>
          <Button
            btnType="Primary"
            sx={{ 
              borderRadius: "6px",
              background: "var(--Green-green-500, #16B364)",
            }}  
            startIcon={<ShareIcon/>}
            onClick={handleShare}
          >
            <Typography variant="h7" sx={{ color: "var(--Colors-Base-00, #FFF)" }}>
            Share Report
            </Typography>
          </Button>
        </Grid>
      
    </Grid>
    {
      isActiveShare &&
      <DeleteConfirmation
      open={isActiveShare}
      setOpen={setIsActiveShare}
      title="Share this report"
      subtitle="You can use up to five email addresses separated by a comma"
      primary="Send"
      secondary="Cancel"
      primaryColor={{ backgroundColor: 'var(--Green-green-500, #16B364)' }}
    />

    }

    <Grid container spacing={3} mt={3}  sx={{gap:"20px",paddingBottom:"32px"}} >
        <Grid lg={3.5} sm={6} xs={12}  sx={{paddingLeft:"32px"}}>
          <CarbonPerMonth diff={12} trend="up" sx={{ height: '100%'  }} value="548752" />
        </Grid>
        <Grid lg={3.5} sm={6} xs={12}>
          <TotalEmissions diff={0.9} trend="down" sx={{ height: '100%'  }} value="548752" />
        </Grid>
        <Grid lg={3.5} sm={6} xs={12}>
          <Reduction diff={1.4} trend="up" sx={{ height: '100%'  }} value={200} />
        </Grid>  
       </Grid> 
     
    <Grid container spacing={3} mt={3}  sx={{gap:"20px ",paddingBottom:"32px"}} >
        <Grid lg={7} xs={12}   sx={{paddingLeft:"32px"}}>
          <CarbonEmissionsScope
            chartSeries={[
              { name: 'Scope 1', data: [20, 25, 30, 35, 40, 45, 50, 55, 60, 55, 50, 45] },
              { name: 'Scope 2', data: [30, 35, 40, 45, 50, 55, 60, 55, 50, 45, 40, 35] },
              { name: 'Scope 3', data: [40, 45, 50, 55, 60, 55, 50, 45, 40, 35, 30, 25] },
            ]}
            sx={{ height: '100%' }}
          />
        </Grid>
        <Grid lg={4} xs={12}>
      
      <Scopes    />
    </Grid>
    </Grid>

    <Grid container spacing={3} mt={3}  sx={{gap:"20px ",paddingBottom:"32px"}} >

        <Grid lg={6} sm={6} xs={12}  sx={{paddingLeft:"32px"}}>
          <MonthlyCarbonEmissions dataEmission={[]} dataEmissionTarget={[]} sx={{ height: '100%' }} />
        </Grid>
        <Grid lg={5} md={6} xs={12}>
          <CarbonEmissionsCategory sx={{ height: '100%' }} />
        </Grid>
        </Grid>
        </Grid>
    </Grid>
  );
}
