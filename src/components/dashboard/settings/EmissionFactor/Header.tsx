
import React, { useEffect, useRef, useState } from 'react';
import Box from '@mui/material/Box';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { palette } from '@/styles/theme/colors';
import { MuiButton } from '@/styles/theme/components/button';
import { outlinedInput, filterCalander } from '@/styles/theme/Filter';
import { CalanderIcon, FilterIcon } from '@/icons';
import { Button } from '@/components/commun/Button/Button';
import dayjs from 'dayjs';
import { start } from 'repl';
import Filters from '@/components/commun/Filters/Filters'; 

interface FilterColumnsProps {
  onFilterByDate: (date: any) => void;
  onFilterBySearch: (search: any) => void;
  onFilterByFiltering:(selectedValue:any,operator:any,value:any)=>void;
  isYear: boolean;
  isDate: boolean;
  isFullDate:boolean;
  columns:Column[];
}

 




const FilterColumns = ({ columns,onFilterByFiltering,onFilterByDate, onFilterBySearch, isYear, isDate,isFullDate }: FilterColumnsProps) => {
  const calendarRef = useRef<HTMLDivElement>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isSelectingStartYear, setIsSelectingStartYear] = useState(false);
  const [isSelectingEndYear, setIsSelectingEndYear] = useState(false);
  const [startYear, setStartYear] = useState<number | null>(null);
  const [endYear, setEndYear] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [formattedSelectedDate, setFormattedSelectedDate] = useState('');
    const [endDate,setEndDate]= useState<Date | null>(null);
    const [startDate,setStartDate]= useState<Date | null>(null);

  const [startFullDate, setStartFullDate] = useState<Date | null>(null);
  const [endFullDate, setEndFullDate] = useState<Date | null>(null);

  const [selectedColumn, setSelectedColumn] = useState(columns[0].field);
  const [operator, setOperator] = useState<Operator>('equals');
  const [filterValue, setFilterValue] = useState('');
  //const [filteredData, setFilteredData] = useState(data);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  
 
  const toggleFilterDropdown = () => setIsFilterDropdownOpen(!isFilterDropdownOpen);

   

  const handleSearchChange = (event) => {
    onFilterBySearch(event.target.value);
    setSearch(event.target.value);
  };


  const handleSearchFilter=(event)=>{
    console.log("handle filter search",event,selectedColumn,operator,filterValue) 
    onFilterByFiltering(selectedColumn,operator,filterValue)
     
  }

  

  
  
  







  useEffect(() => {
    const handleClickOutside = (event) => {
       
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
        setIsSelectingStartYear(false);
        setIsSelectingEndYear(false);

        const dateRange = [startYear, endYear].filter(Boolean);
        if (isYear && startYear && endYear) {
          const dateRange = [startYear, endYear];
          onFilterByDate(dateRange);
          const formattedDate = `${(startYear)} - ${(endYear)}`;
          console.log("use effect date r ange",startYear,endYear)
          setFormattedSelectedDate(formattedDate);
        }
        if (isFullDate && startFullDate && endFullDate){
          const dateRange = [startFullDate, endFullDate];
          onFilterByDate(dateRange);
          const formattedDate = `${(startFullDate)} - ${(endFullDate)}`;
          setFormattedSelectedDate(formattedDate);
        }

        if (isDate && startDate){ 
          setFormattedSelectedDate(`${(startDate)}`);
          onFilterByDate(startDate);
          
        }


      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [startYear, endYear, onFilterByDate,startFullDate,endFullDate,startDate]);

  const handleColumnChange = (event: React.ChangeEvent<HTMLSelectElement>) => setSelectedColumn(event.target.value);
  const handleOperatorChange = (event: React.ChangeEvent<HTMLSelectElement>) =>{
    console.log("setOperator",event.target.value)
    setOperator(event.target.value);
  }
  const handleFilterValueChange = (event: React.ChangeEvent<HTMLInputElement>) => setFilterValue(event.target.value);

 /*  const applyFilter = () => {
    setFilteredData(filterData(data.slice(), selectedColumn, operator, filterValue));
    setIsFilterDropdownOpen(false); // Close dropdown after applying filter
  }; */
  
  return (
   
    <Box sx={{ backgroundColor: palette.common.white, position: 'relative', p: 2, padding: 'var(--12, 12px) 16px', gap: '12px 12px', borderRadius: '12px' }}>
      <Box sx={{ display: "flex", alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: "row" }}>
        <OutlinedInput
          defaultValue=""
          placeholder="Search for anything..."
          onChange={handleSearchChange}
          startAdornment={
            <InputAdornment position="start">
              <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
            </InputAdornment>
          }
          sx={outlinedInput}
        />
 
        <Box ref={calendarRef} sx={{
          display: 'flex',
          padding: 'var(--12, 12px) 16px',
          justifyContent: 'space-between',
          alignItems: 'center',
          alignSelf: 'stretch',
          zIndex: 20,
          gap: '8px',
        }}>
          
          
          <Button
            btnType="secondaryGray"
            sx={{ p: MuiButton.styleOverrides['sizeSmall'], justifyContent: 'left' }}
            startIcon={<FilterIcon />}
            onClick={toggleFilterDropdown}
          >
            Filters
          </Button>
{/*  <Box sx={{ backgroundColor: palette.common.white, position: 'relative', p: 2, padding: 'var(--12, 12px) 16px', gap: '12px 12px', borderRadius: '12px' }}>
      <Box sx={{ display: "flex", alignItems: 'flex-start', justifyContent: 'space-between', flexDirection: "row" }}>
    */}
           {isFilterDropdownOpen && (
      <Box   sx={{ position: 'absolute', top: '80px', right: '16px', zIndex: 10,
border: '0.1px solid gray', borderRadius: '8px', backgroundColor: 'white',  

       }}>
        
          <Filters 
            columns={columns}
            selectedColumn={selectedColumn}
            operator={operator}
            filterValue={filterValue}
            handleColumnChange={handleColumnChange}
            handleOperatorChange={handleOperatorChange}
            handleFilterValueChange={handleFilterValueChange}
            applyFilter={handleSearchFilter}
            onClose={() => setIsFilterDropdownOpen(false)}
            isOpen={isFilterDropdownOpen} // Pass the isOpen state
          />
          
        
      </Box>
    )}  

        </Box>
        
      </Box>
    </Box> 
  );
};

export default FilterColumns;
