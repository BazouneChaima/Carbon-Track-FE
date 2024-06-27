import React, { useEffect, useRef } from 'react';
import Box from '@mui/material/Box';

const FilterBox = ({ children, onClose }) => {
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClose(); // Close only if clicking outside the filter box
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <Box
      ref={ref}
      sx={{
        border: '0.1px solid gray',
        borderRadius: '8px',
        backgroundColor: 'red',
        padding: '400px',
        position: 'relative', // Ensure position relative for zIndex to work properly
        zIndex: 999, // Ensure zIndex is higher than other elements to prevent hiding
      }}
    >
      {children}
    </Box>
  );
};

export default FilterBox;
