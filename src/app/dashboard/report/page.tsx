'use client';

import  React , {useState} from 'react';
import { Box, Typography,Button ,Divider} from '@mui/material';
import { MuiButton } from '@/styles/theme/components/button';
import Grid from '@mui/material/Unstable_Grid2';
import {ImportIcon,ExportIcon,CalanderIcon, FilterIcon } from '@/icons';
import CustomTabs from '@/components/commun/Tabs/tabs';
import { CarbonEmissionsCategory } from '@/components/dashboard/overview/CarbonEmissionsCategory';
import { MonthlyCarbonEmissions } from '@/components/dashboard/overview/MonthlyCarbonEmissions';
import Scopes from "@/components/dashboard/overview/Scopes"

import ButtomDrower from '@/components/dashboard/reports/ButtomDrower';
import { useDispatch, useSelector } from 'react-redux';
import { ReportsTable } from '@/components/dashboard/reports/reports-table';
import dayjs from 'dayjs';
const reports = [
  {
    id: 'USR-010',
    name: 'Alcides Antonio',
    period: '/assets/avatar-10.png',
    status: 'progress',
    createdBy: 'dddddd',
     createdAt: dayjs().subtract(2, 'hours').toDate(),
  },
  {
    id: 'USR-010',
    name: 'Alcides Antonio',
    period: '/assets/avatar-10.png',
    status: 'progress',
    createdBy: 'dddddd',
     createdAt: dayjs().subtract(2, 'hours').toDate(),
  },

] satisfies reports[];
export default function Page(): React.JSX.Element {
  const [selectedTab, setSelectedTab] = useState<string>('7 Days');
  const page = 0;
  const rowsPerPage = 3;
  const [isOpen, setIsOpen] = useState(false);

  const { targets } = useSelector((state: any) => state.target);
  const [target, setTarget] = React.useState<Target>({});
  const [paginatedTarget, setPaginatedTarget] = useState<Target[]>([]);
  // Function to handle tab changes
  const handleTabChange = (event: React.ChangeEvent<any>, newValue: string) => {
    setSelectedTab(newValue);
  };
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
  const handleExportClick = () => {
    setIsOpen(!isOpen);
  };
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
  return (
    <Box  >
    <Grid container justifyContent="space-between" spacing={2}>
      <Grid item xs={8}>
        <Typography variant="h3" color="var(--Grey-grey-900, #1A1D21)" gutterBottom>
        Reports
        </Typography>
        <Typography variant="bodyP2" color="var(--Grey-grey-400, #88909F)" >
       
        Ci-dessous se trouve une liste de tâches liées à vos émissions de carbone. Veuillez les passer en revue et vous assurer qu'elles sont conformes à vos objectifs en matière de durabilité.
        </Typography>
        <Divider sx={{backgroundColor:"#EAECF0",height:"1px",width:"100%",marginTop:"24px"}}   />
      </Grid>
     
      <Grid item xs={4} container justifyContent="flex-end">
       
        <Grid item>
          <Button
            btnType="Primary"
            sx={{
              ...MuiButton.styleOverrides.sizeSmall,
              borderRadius: "6px",
              background: "var(--Green-green-500, #16B364)",
            }}
            startIcon={<ExportIcon fontSize="var(--icon-fontSize-sm)"  color="white"/>}
            onClick={handleExportClick}  
          >
            <Typography variant="h7" sx={{ color: "var(--Colors-Base-00, #FFF)" }}>
              Export
            </Typography>
          </Button>
        </Grid>
      </Grid>
    </Grid>
    <ReportsTable count={paginatedTarget.length} page={page} rows={reports} rowsPerPage={rowsPerPage} />
     
    {isOpen && (
        <ButtomDrower
          open={isOpen}
          onClose={() => {
            setIsOpen(!isOpen);
            
          }}
          /* onNext={handleNext}  */
        />
      )}
       
    </Box>
  );
}
function applyPagination(rows: any[], page: number, rowsPerPage: number): Target[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
}
