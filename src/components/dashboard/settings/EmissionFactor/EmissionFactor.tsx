'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { Grid } from '@mui/material';
import { EmissionFactorTable } from "./EmissionFactorTable";
import { useDispatch, useSelector } from 'react-redux';
import { setEmissions } from '@/lib/store/reducer/useEmission';
import { emissionApis } from '@/lib/emission/emissionApis';
import { Emission } from '@/types/emission';

export function EmissionFactor() { 
  const rowsPerPage = 5;  
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [emission,setEmission]= useState<Emission[]>([]);
  /* const [totalRows, setTotalRows] = useState(1); */
  const dispatch = useDispatch(); 
    
  const { emissions, totalRows, totalPages } = useSelector((state: any) => state.emission);

  const getEmissions = useCallback(async (): Promise<void> => {
    const filters = {
       page,  
       limit: rowsPerPage,  
       search: searchInput,
     };
     console.log("getemissions settings filters", filters);
    const { error, res, total, totalPages } = await emissionApis.getEmissions(filters);
    if (error) {
      return;
    }
   /*  dispatch(setEmissions(res)); */
   dispatch(setEmissions({ emissions: res, total, totalPages }));
   setEmission(res);
   /*  setTotalRows(total); */
    setPages(totalPages);
    
    console.log("set emission==>", page,emissions,emission);
  }, [dispatch, page, rowsPerPage,searchInput ]);
 
  useEffect(() => {
    getEmissions();
  }, [getEmissions]);

  const handleChangePage = (newPage: number) => {
    console.log("handle change page", newPage);
    setPage(newPage); 
    
  };

  const onFilterBySearch = (search: string) => { 
    console.log("onFilterBySearch=>", search);
    setSearchInput(search);
    setPage(1); 
  };

  return (
    <Stack spacing={3}>
      <Grid container alignItems="center">
        <EmissionFactorTable
          
          rows={emission}
          rowsPerPage={rowsPerPage}
          onFilterBySearch={onFilterBySearch} 
          pages={pages} 
          handleChangePage={handleChangePage}
        />
      </Grid>
      <Divider />
    </Stack>
  );
}
