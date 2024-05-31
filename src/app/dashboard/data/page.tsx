'use client';

import  React , {useState} from 'react';
import { Box, Typography,Button ,Divider} from '@mui/material';
import { MuiButton } from '@/styles/theme/components/button';
import Grid from '@mui/material/Unstable_Grid2';
import {ImportIcon,ExportIcon,CalanderIcon, FilterIcon,PlusIcon } from '@/icons';
import CustomTabs from '@/components/commun/Tabs/tabs';
import { CarbonEmissionsCategory } from '@/components/dashboard/overview/CarbonEmissionsCategory';
import { MonthlyCarbonEmissions } from '@/components/dashboard/overview/MonthlyCarbonEmissions';
import Scopes from "@/components/dashboard/overview/Scopes"

import { useDispatch, useSelector } from 'react-redux';
import { DataTable } from '@/components/dashboard/data/Data-table';
import ExportStep1 from '@/components/dashboard/data/ExportStep1';
import dayjs from 'dayjs';
const reports = [
  {
    id: 'USR-010',
    Date: "12/01/2022",
    Location: "Location 01", 
    Category: "Transportation",
    Qunatity:"500 milles",
    EmissionFactor: "0.2 Kg CO2e/mile",
    SourceType:"Manual",
    IntegrationSource:"GreenAPI",
  },
  {
    id: 'USR-010',
    Date: "12/01/2022",
    Location: "Location 02", 
    Category: "Building",
    Qunatity:"500 milles",
    EmissionFactor: "0.2 Kg CO2e/mile",
    SourceType:"Manual",
    IntegrationSource:"GreenAPI",
  },

] satisfies reports[];
export default function Page(): React.JSX.Element {
  const [selectedTab, setSelectedTab] = useState<string>('7 Days');
  const page = 0;
  const rowsPerPage = 3;
const [isOpen,setIsOpen]=useState(false);
const [isUpdate, setIsUpdate] = useState(false);
const [activeStep, setActiveStep] = useState(0);
  const { targets } = useSelector((state: any) => state.target);
  const [target, setTarget] = React.useState<Target>({});
  const [paginatedTarget, setPaginatedTarget] = useState<Target[]>([]);
  // Function to handle tab changes
  const handleTabChange = (event: React.ChangeEvent<any>, newValue: string) => {
    setSelectedTab(newValue);
  };
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    console.log("nexttt",activeStep)
  };
  const handleModify=()=>{

  }

  const handleImporter=()=>{
    setIsOpen(!isOpen);

    console.log("handleImporter",isOpen)
  }

  return (
    <Box  >
    <Grid container justifyContent="space-between" spacing={2}>
      <Grid item xs={8}>
        <Typography variant="h3" color="var(--Grey-grey-900, #1A1D21)" gutterBottom>
        Data
        </Typography>
        <Typography variant="bodyP2" color="var(--Grey-grey-400, #88909F)" >
        Here's your carbon emissions data. Feel free to add new entries, upload data, or utilize our API for seamless integration
         </Typography>
        <Divider sx={{backgroundColor:"#EAECF0",height:"1px",width:"100%",marginTop:"24px"}}   />
      </Grid>
     
      <Grid item xs={4} container justifyContent="flex-end">
       
        <Grid item spacing={2} >

        <Button
            btnType="Primary"
            sx={{
              ...MuiButton.styleOverrides.sizeSmall,
              borderRadius: "6px",
              marginRight:"16px",
              
              background: "var(--Colors-Base-00, #FFF)",
            }}
            startIcon={<ImportIcon fontSize="var(--icon-fontSize-sm)"  color="var(--Grey-grey-600, #606977)"/>}  
          onClick={handleImporter}
          >
            <Typography variant="h7" sx={{ color: "var(--Grey-grey-600, #606977)" }}>
              Import
            </Typography>
          </Button>

          <Button
            btnType="Primary"
            sx={{
              ...MuiButton.styleOverrides.sizeSmall,
              borderRadius: "6px",
              background: "var(--Green-green-500, #16B364)",
            }}
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-sm)"  color="white"/>}  
          >
            <Typography variant="h7" sx={{ color: "var(--Colors-Base-00, #FFF)" }}>
              New 
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </Grid>
  
   

    <DataTable count={paginatedTarget.length} page={page} rows={reports} rowsPerPage={rowsPerPage} />
    {isOpen ?
    <ExportStep1 open={isOpen} onClose={() => {setIsUpdate(!isUpdate);setActiveStep(0)}}
    onUpdateTarget={handleModify} target={target} activeStep={activeStep}
     /* onNext={handleNext}  */
     
     />
    :
    <div>ffffffffffffffffffff</div>
}
    </Box>
  );
}
function applyPagination(rows: any[], page: number, rowsPerPage: number): Target[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
