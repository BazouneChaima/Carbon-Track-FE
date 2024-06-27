import React,{useRef,useEffect,useState} from 'react';
import { Stack,Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'; // Import necessary MUI components

type Operator = 'contains' | 'equals' | 'startsWith' | 'endsWith' | 'lessThan' | 'greaterThan'; // Add more operators as needed
 
interface Column {
  field: string;
  headerName: string;
  width: number;
  filterable: boolean;
  type?: 'string' | 'number' | 'Date'; // Optional type for data type handling
}

interface FiltersProps {
  columns: Column[];
  selectedColumn: string;
  operator: Operator;
  filterValue: string;
  handleColumnChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleOperatorChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  handleFilterValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  applyFilter: () => void;
  isOpen?: boolean; // Optional prop to control the dropdown visibility
}

const Filters: React.FC<FiltersProps> = ({
  columns,
  selectedColumn,
  operator,
  filterValue,
  handleColumnChange,
  handleOperatorChange,
  handleFilterValueChange,
  applyFilter,
  onClose,
  isOpen = false,
}) => {
  const filterBoxRef = useRef(); // Ref for the outer filter box
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to track menu open/close

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterBoxRef.current && !filterBoxRef.current.contains(event.target) && !isMenuOpen) {
        // Close only if clicking outside the filter box and no menu is open
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, isMenuOpen]);

  const handleMenuOpen = () => {
    setIsMenuOpen(true);
  };
  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };
  
  const getAvailableOperators = (columnType?: string) => {
    const operators = ['equals']; // Default operators
    if (columnType === 'number') {
      operators.push( 'greaterThan', 'lessThan');
    } else if (columnType === 'string') {
      operators.push('startsWith', 'endsWith','contains');
    }
    else if (columnType === 'Date') {
      operators.push( 'greaterThan', 'lessThan');
    }
    return operators;
  };
  const availableOperators = getAvailableOperators(columns.find((col) => col.field === selectedColumn)?.type);
  return (
    <Box ref={filterBoxRef}>
    <Stack direction="row" >
    <Box      sx={{ p: 4 }}>
      <FormControl sx={{ minWidth: 120}}>
        <InputLabel  id="column-label" >Column</InputLabel>
        <Select sx={{marginRight:2,marginTop:2}}
         
        labelId="column-label" id="column" value={selectedColumn} onChange={handleColumnChange}
        onOpen={handleMenuOpen} // Open menu on click
        onClose={handleMenuClose}
        >
          {columns
            .filter((col) => col.filterable)
            .map((col) => (
              <MenuItem key={col.field} value={col.field}>
                {col.headerName}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id="operator-label">Operator</InputLabel>
        <Select sx={{marginRight:2,marginTop:2}}  labelId="operator-label" id="operator"
         value={operator} onChange={handleOperatorChange}
         onOpen={handleMenuOpen} // Open menu on click
         onClose={handleMenuClose}
         >
       
         {availableOperators.map((op) => (
           <MenuItem key={op} value={op}>
             {op}
           </MenuItem>
         ))}
        </Select>
      </FormControl>
      <FormControl sx={{ minWidth: 120 }}>
      <InputLabel id="operator-label" sx={{marginTop:-3.5}} >value</InputLabel>
      <TextField  
        type={columns.find((col) => col.field === selectedColumn)?.type || 'text'}
        value={filterValue}
        onChange={handleFilterValueChange}
        sx={{ marginRight:2,marginTop:2 }} // Optional styling for TextField
      />
       </FormControl>
      <Button variant="contained" onClick={applyFilter} style={{
              borderRadius: '0.375rem',
              background: 'var(--Green-green-500, #16B364)',
            }}  sx={{ marginRight:2,marginTop:2 }}>
        Apply
      </Button>
    </Box>
    </Stack>
    </Box>
  );
};

export default Filters;
