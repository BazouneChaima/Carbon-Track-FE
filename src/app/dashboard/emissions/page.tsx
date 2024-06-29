'use client';

import  React,{useState,useRef} from 'react';
import { useEffect } from 'react';
import { CalanderIcon, ExportIcon, FilterIcon, ImportIcon } from '@/icons';
import { Box, Button, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useDispatch } from 'react-redux';

import { dataApis } from '@/lib/data/dataApis';
import { CalculateScopes, getCarbonEmission, getCarbonEmissionByCategory, getCarbonEmissionFromTarget } from '@/lib/helper';
import { setDataDB } from '@/lib/store/reducer/useFile';
import CustomTabs from '@/components/commun/Tabs/tabs';
import { CarbonEmissionsCategory } from '@/components/dashboard/overview/CarbonEmissionsCategory';
import { MonthlyCarbonEmissions } from '@/components/dashboard/overview/MonthlyCarbonEmissions';
import Scopes from '@/components/dashboard/overview/Scopes';
import { MuiButton } from '@/styles/theme/components/button';
import { setTargets } from '@/lib/store/reducer/useTarget';
import { Target } from '@/types/target';
import { targetApis } from '@/lib/target/targetApis';
import { addDataDB, clearColumnMapped, clearSelectedRow } from '@/lib/store/reducer/useFile';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import ButtomDrower from '@/components/dashboard/data/ButtomDrower';
import html2canvas from "html2canvas"

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import jsPDF from 'jspdf';
import FilterDateComponent from '@/components/commun/Date/CustomDate'; // Assuming it's in the same directory

/* import { Button } from '@/components/commun/Button/Button'; */
import 'jspdf-autotable';  // Import the library
import MyDocument from './MyDocument';
import dayjs from "dayjs"
interface Scopes {
  scope1?: number;
  scope2?: number;
  scope3?: number;
  sum?: number;
}
export default function Emissions(): React.JSX.Element {
  const [selectedTab, setSelectedTab] = React.useState<string>('12months');

  const [selectedTabScopes, setSelectedTabScopes] = React.useState<string>('scope1');
  const dispatch = useDispatch();
  const [myScope, setMyScope] = React.useState<Scopes>({});
  const [dataEmissionByCat , setDataEmissionByCat] = React.useState([]);
  const [dataEmission , setDataEmission] = React.useState([]);
  const [dataEmissionTarget, setDataEmissionTarget] = React.useState([]);
  const [target, setTarget] = React.useState<Target>({});

  const [isOpen, setIsOpen] = React.useState(false);

  const calendarRef = useRef<HTMLDivElement>(null);
 
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSelectingStartYear, setIsSelectingStartYear] = useState(false);
  const [isSelectingEndYear, setIsSelectingEndYear] = useState(false);
 

  const [startFullDate, setStartFullDate] = useState<Date | null>(null);
  const [endFullDate, setEndFullDate] = useState<Date | null>(null);
  
  
  const [formattedSelectedDate, setFormattedSelectedDate] = useState('');



  const getTargets = React.useCallback(async (): Promise<void> => {
    const { error, res } = await targetApis.getTargets();
    if (error) {
      return;
    } 
    dispatch(setTargets(res));
    setTarget(res);  
    setDataEmissionTarget(getCarbonEmissionFromTarget(res))
  }, []);


  const getData = React.useCallback(async (): Promise<void> => {
    const { error, res } = await dataApis.getData();
    if (error) {
      return;
    }
   
   
    dispatch(setDataDB(res));
    if(startFullDate && endFullDate){
      setSelectedTab('custom');
      console.log("getData===>",selectedTab,startFullDate,endFullDate)
    setMyScope(CalculateScopes(res,selectedTab,startFullDate,endFullDate));
    }else{
      setMyScope(CalculateScopes(res,selectedTab));
    }
  
   /*  if(startFullDate && endFullDate && selectedTab=""){
      const carbon=getCarbonEmissionByCategory(res,selectedTabScopes,"custom");
      setDataEmissionByCat(carbon);
    }else{
      const carbon=getCarbonEmissionByCategory(res,selectedTabScopes,selectedTab);
      setDataEmissionByCat(carbon);
    } */
   console.log("setDataEmissionByCat",setDataEmissionByCat(
    getCarbonEmissionByCategory(res,selectedTabScopes,selectedTab,startFullDate,endFullDate)))
    
    if(startFullDate && endFullDate){
      setSelectedTab('custom');
    const carbonEmission=getCarbonEmission(res,selectedTab,startFullDate,endFullDate);
    setDataEmission(carbonEmission)  
    }else{
       
    const carbonEmission=getCarbonEmission(res,selectedTab);
    setDataEmission(carbonEmission)  
    }
   /*  console.log("setDataEmission=====>",getCarbonEmission(res)) */
  }, [selectedTabScopes,selectedTab]);

  useEffect(() => {
  /*   getTargets() */
    getData();
    const handleClickOutside = (event) => {
       
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
        
      }
    };
console.log("startFullDate,startFullDate",startFullDate,endFullDate)
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [getData /* , getTargets */,startFullDate,endFullDate]);



 














  // Function to handle tab changes
  const handleTabChange = (event: React.ChangeEvent<any>, newValue: string) => {
    console.log("handle",newValue)
    setSelectedTab(newValue);
  };
 

  const handleTabChangeScopes = (event: React.ChangeEvent<any>, newValue: string) => {
    console.log("handleTabChangeScopes",newValue)
    setSelectedTabScopes(newValue);
  };


  const handleImporter = () => {
    setIsOpen(!isOpen);

    console.log('handleImporter', isOpen);
  };
  const handleExportToPDF = async () => {
  const doc = new jsPDF();
  const margin = 10; // Adjust margin for spacing

  const captureWithWhiteBackground = async (element) => {
    const originalBackground = element.style.backgroundColor;
    element.style.backgroundColor = '#ffffff'; // Set background to white
    const canvas = await html2canvas(element, { backgroundColor: '#ffffff' });
    element.style.backgroundColor = originalBackground; // Restore original background
    return canvas.toDataURL('image/png');
  };
  // If using captured image, add it to the doc:
  const chartElement = document.getElementById('scopeid');
  const chartElementMonthlyCarbon = document.getElementById("monthlyCarbonId");
  const chartElementCarbonEmissionsCategory = document.getElementById("carbonEmissionsCategory");


  const imageData = await captureWithWhiteBackground(chartElement);
  const imageDataMonthly = await captureWithWhiteBackground(chartElementMonthlyCarbon);
  const imageDataCarbonEmissionCategory = await captureWithWhiteBackground(chartElementCarbonEmissionsCategory);
 

  // Calculate image width based on available space
  const availableWidth = doc.internal.pageSize.getWidth() - 2 * margin;
  const imageWidth = availableWidth / 2; // Divide available space equally

  // Add first two images on top (side-by-side)
  doc.addImage(imageData, 'JPG', margin, margin, imageWidth, 0);
  doc.addImage(imageDataMonthly, 'JPG', margin + imageWidth + margin, margin, imageWidth, 0);

  // Calculate Y position for the third image (below the top two)
  const topRowHeight = 100; // Assuming all images have similar heights
  const thirdImageY = margin + topRowHeight + margin; // Add margin for spacing

  // Add the third image in a separate row
  doc.addImage(imageDataCarbonEmissionCategory,'JPG',margin,thirdImageY, imageWidth+100, 0);
  doc.text('Emission Tracking', 10, 10); 
  doc.save('chart_export.pdf');
};  

  

 

const handleApply=(firstDate,endDate)=>{
  console.log("handleApply",firstDate,endDate)
  setIsCalendarOpen(!isCalendarOpen)
  setEndFullDate(endDate)
  setStartFullDate(firstDate)
  const formattedDate = `${(firstDate)} - ${(endDate)}`;
  setFormattedSelectedDate(formattedDate);
  setSelectedTab('')

}
const handleCancel=()=>{
  console.log("handleCancel")
  setIsCalendarOpen(!isCalendarOpen)
  setEndFullDate('')
  setStartFullDate('')
}
const handleClear=()=>{
  console.log("handleClear")
  setFormattedSelectedDate('select Date')
  setEndFullDate('')
  setStartFullDate('')
   
}


 /*  const handleExportToPDF = async () => {
    const doc = new jsPDF();
  
    // If using captured image, add it to the doc:
    const chartElement = document.getElementById('scopeid');
    const chartElementMonthlyCarbon=document.getElementById("monthlyCarbonId");
    const canvas = await html2canvas(chartElement);
    const canvasMonthlyCarbon=await html2canvas(chartElementMonthlyCarbon);
    const imageData = canvas.toDataURL('image/png');
    const imageDataMonthly = canvasMonthlyCarbon.toDataURL('image/png');

     doc.addImage(imageData, 'PNG', 10, 10);
     doc.addImage(imageDataMonthly, 'PNG', 10, 10);
    // Add chart data directly using jsPDF or jsPDF-AutoTable:
    const chartData = [ // Your chart data in an array of arrays format
      ['Label 1', 'Value 1'],
      ['Label 2', 'Value 2'],
      // ...
    ];
  
    // With jsPDF:
    doc.text('Your Chart Title', 10, 10); // Add title if desired
    doc.autoTable({
      startY: 20, // Adjust starting Y position
      head: chartData[0], // Header row
      body: chartData.slice(1), // Data rows
      styles: { // Optional styles for the table
        fontSize: 10,
        halign: 'center',
      },
    });
  
    // With jsPDF-AutoTable:
    // doc.autoTable(chartData); // Simple usage
  
    doc.save('chart_export.pdf');
  }; */



  const handleStartYearChange = (date) => { 
    
  console.log("date===>",dayjs(date).format('YYYY-MM-DD'))
  setStartFullDate(dayjs(date).format('YYYY-MM-DD')); 
     
   
  setIsSelectingStartYear(false);
 
  };




  return (
    <Box>
      <Grid container justifyContent="space-between" spacing={2}>
        <Grid item xs={8}>
          <Typography variant="h3" color="var(--Grey-grey-900, #1A1D21)" gutterBottom>
            Emission Tracking
          </Typography>
          <Typography variant="bodyP2" color="var(--Grey-grey-400, #88909F)">
            Welcome to Emission Tracking, Your effortless tool for monitoring and managing your carbon footprint.
          </Typography>
        </Grid>
        <Grid item xs={4} container justifyContent="flex-end">
          <Grid item>
            <Button
              btnType="secondaryGray"
              sx={{
                ...MuiButton.styleOverrides.sizeSmall,
                borderRadius: '6px',
                border: '1px solid var(--Grey-grey-200, #B3B8C2)',
                background: 'var(--Colors-Base-00, #FFF)',
              }}
              startIcon={<ImportIcon />}
              onClick={handleImporter}
            >
              <Typography variant="h7" sx={{ color: 'var(--Grey-grey-600, #606977)' }}>
                Import
              </Typography>
            </Button>
          </Grid>
          <Grid item>
            <Button
              btnType="Primary"
              sx={{
                ...MuiButton.styleOverrides.sizeSmall,
                borderRadius: '6px',
                background: 'var(--Green-green-500, #16B364)',
              }}
              startIcon={<ExportIcon fontSize="var(--icon-fontSize-sm)" />}
              onClick={handleExportToPDF}
            >
              <Typography variant="h7" sx={{ color: 'var(--Colors-Base-00, #FFF)' }}>
                Export
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid container justifyContent="space-between" spacing={2} sx={{ paddingTop: '1rem' }}>
        <Grid item xs={8}>
          <CustomTabs value={selectedTab} handleChange={handleTabChange} />
        </Grid>
        <Grid item xs={4} container justifyContent="flex-end">
          <Grid item>
            <Button
              btnType="secondaryGray"
              sx={{
                ...MuiButton.styleOverrides.sizeSmall,
                borderRadius: '6px',
                border: '1px solid var(--Grey-grey-200, #B3B8C2)',
                background: 'var(--Colors-Base-00, #FFF)',
              }}
              startIcon={<CalanderIcon />}
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            >
              <Typography variant="h7" sx={{ color: 'var(--Grey-grey-600, #606977)' }}>
              {formattedSelectedDate || 'Select Date'}
              </Typography>
            </Button>

            {isCalendarOpen && (
           
         /*   <Box sx={{ position: 'relative', top: 'initial', zIndex: 100 }}>
           <Box
             sx={{
               border: '1px solid transparent',
               borderRadius: '8px',
               backgroundColor: 'white',
               padding: '8px',
               display: 'flex',
               justifyContent: 'space-between', // Arrange calendars horizontally
             }}
           >
             <LocalizationProvider dateAdapter={AdapterDayjs}>
               <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                 <Button
                   btnType="secondaryGray"
                   sx={{ ...MuiButton.styleOverrides.sizeSmall }}
                   startIcon={<CalanderIcon />}
                   id="filter-date-start"
                   onClick={() => {
                     setIsSelectingStartYear(true);
                     setIsSelectingEndYear(false);
                   }}
                 >
                   {startFullDate ? dayjs(startFullDate).format('YYYY-MM-DD') : 'Start Date'}
                 </Button>
                 {isSelectingStartYear && (
                   <DateCalendar
                     views={['year', 'month', 'day']}
                     onChange={handleStartYearChange}
                   />
                 )}
               </Box>
             </LocalizationProvider>
             <LocalizationProvider dateAdapter={AdapterDayjs}>
               <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                 <Button
                   btnType="secondaryGray"
                   sx={{ ...MuiButton.styleOverrides.sizeSmall }}
                   startIcon={<CalanderIcon />}
                   id="filter-date-end"
                   onClick={() => {
                     setIsSelectingStartYear(false);
                     setIsSelectingEndYear(true);
                   }}
                 >
                   {endFullDate ? dayjs(endFullDate).format('YYYY-MM-DD') : 'End Date'}
                 </Button>
                 {isSelectingEndYear && (
                   <DateCalendar
                     views={['year', 'month', 'day']}
                     onChange={handleEndYearChange}
                   />
                 )}
               </Box>
             </LocalizationProvider>
           </Box>
         </Box> */ 
         <FilterDateComponent
       
         handleApply={handleApply}
         handleCancel={handleCancel}
         handleClear={handleClear}
       />
       
          )}














          </Grid>
          <Grid item>
            <Button
              btnType="secondaryGray"
              sx={{
                ...MuiButton.styleOverrides.sizeSmall,
                borderRadius: '6px',
                background: 'var(--Colors-Base-00, #FFF)',
              }}
              startIcon={<FilterIcon fontSize="var(--icon-fontSize-sm)" />}
            >
              <Typography variant="h7" sx={{ color: 'var(--Grey-grey-600, #606977)' }}>
                Filters
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <Grid container spacing={3} mt={3}>
        <Grid lg={7} md={6} xs={12}>
          <MonthlyCarbonEmissions 
          dataEmission={dataEmission} 
          dataEmissionTarget={dataEmissionTarget}
          sx={{ height: '100%' }} 
          />  
        </Grid>
        <Grid lg={5} md={12} xs={12}>
          <Scopes   scope1={myScope.scope1} scope2={myScope.scope2} scope3={myScope.scope3} />
        </Grid>

        <Grid id="carbonEmissionsCategory" sx={{backgroundColor:"white"}} lg={12} md={12} xs={12}>
           <CarbonEmissionsCategory
            data={dataEmissionByCat}
            sx={{ height: '100%' }}
            showScopesTabs={true}
            value={selectedTabScopes}
            handleChange={handleTabChangeScopes}
          />  
        </Grid>
      </Grid>
      {isOpen && (
        <ButtomDrower
          open={isOpen}
          onClose={() => {
            setIsOpen(!isOpen);
            dispatch(clearColumnMapped())
          }}
          /* onNext={handleNext}  */
        />
      )}
    </Box>
  );
}
