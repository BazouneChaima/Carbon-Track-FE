import * as React from 'react';
import { Box, Button,Grid ,Typography} from '@mui/material'; 
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { MuiButton } from '@/styles/theme/components/button';
import { CalanderIcon, ExportIcon, FilterIcon, ImportIcon } from '@/icons';
import { backgroundClip } from 'html2canvas/dist/types/css/property-descriptors/background-clip';
const FilterDateComponent = ({
 
  handleApply, 
  handleCancel, 
  handleClear,
}) => {

  const isDaySelected = (day) => selectedDays.some((selectedDay) => dayjs(selectedDay).isSame(day, 'day'));
  
    const [selectedStart, setSelectedStart] = React.useState(Date);
    const [selectedEnd, setSelectedEnd] = React.useState(Date);
    console.log("selectedstart",selectedStart,selectedEnd)
    const onApply=()=>{
      console.log("on apply",selectedStart,selectedEnd);
      handleApply(selectedStart,selectedEnd)
    }

    const onClear=()=>{
      
      setSelectedStart('')
      setSelectedEnd('')
      console.log("onClear",selectedStart,selectedEnd)
      handleClear();
    }
    const onCancel=()=>{
      console.log("onCancel")
      setSelectedStart('');
      setSelectedEnd('');
      handleCancel();
       

    }

 const onEndDate=(date)=>{
  console.log("handleEndDate",date)
  setSelectedEnd(dayjs(date).format('YYYY-MM-DD'))

 }
 const onStartDate=(date)=>{
  console.log("handle start date",date)
  setSelectedStart(dayjs(date).format('YYYY-MM-DD'))
 }
  
  return (
    
    <Box sx={{
        position: 'absolute',
        marginTop:"16px",
        right: '9%',
        backgroundColor: 'white',
        borderWidth: 2, // Main border width
        borderStyle: 'solid', // Style for all borders
        width: "800px",
        padding: "2px",
        zIndex: 100,
        borderRadius: '6px',
        border: '1px solid var(--Grey-grey-200, #B3B8C2)',
        background: 'var(--Colors-Base-00, #FFF)',
    }}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', flexDirection: 'column', margin: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '16px' }}>
          <DateCalendar views={['year', 'month', 'day']} onChange={onStartDate} 
           
           dayCellProps={(day) => ({
             style: {
               backgroundColor: isDaySelected(day) ? 'var(--Blue-blue-500, #2C7BE0)' : 'inherit',
             },
           })}
          
          />
          <DateCalendar views={['year', 'month', 'day']} onChange={onEndDate}
          
          dayCellProps={(day) => ({
            style: {
              backgroundColor: isDaySelected(day) ? 'var(--Blue-blue-500, #2C7BE0)' : 'inherit',
            },
          })}

          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button variant="outlined" 
         btnType="secondaryGray"
         sx={{
           ...MuiButton.styleOverrides.sizeSmall,
           borderRadius: '6px',
           border: '1px solid var(--Grey-grey-200, #B3B8C2)',
           background: 'var(--Colors-Base-00, #FFF)',
         }}
         onClick={onClear}>
               <Typography variant="h7" sx={{ color: 'var(--Grey-grey-600, #606977)' }}>
                Clear
              </Typography>
            </Button>
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Button variant="outlined" onClick={handleCancel}
             btnType="secondaryGray"
             sx={{
               ...MuiButton.styleOverrides.sizeSmall,
               borderRadius: '6px',
               border: '1px solid var(--Grey-grey-200, #B3B8C2)',
               background: 'var(--Colors-Base-00, #FFF)',
             }}
             onClick={onCancel}
            >
        <Typography variant="h7" sx={{ color: 'var(--Grey-grey-600, #606977)' }}>
                Cancel
        </Typography>
            </Button>
            <Button variant="contained" 
             btnType="Primary"
             sx={{
               ...MuiButton.styleOverrides.sizeSmall,
               borderRadius: '6px',
               background: 'var(--Green-green-500, #16B364)',
             }}
            onClick={onApply}>
            <Typography variant="h7" sx={{ color: 'var(--Colors-Base-00, #FFF)' }}>
                Apply
            </Typography>
          </Button>
           
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  </Box>

     
  );
};

export default FilterDateComponent;
