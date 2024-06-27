'use client';

import React, { useEffect, useState } from 'react';
import { CalanderIcon, ExportIcon, FilterIcon, ImportIcon, PlusIcon } from '@/icons';
import { Box, Divider, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';

import { Data } from '@/types/data';
import { dataApis } from '@/lib/data/dataApis';
import { addDataDB, clearColumnMapped, clearSelectedRow, setDataDB, updateDataDB } from '@/lib/store/reducer/useFile';
import { setOpenToast } from '@/lib/store/reducer/useGlobalActions';
import { Button } from '@/components/commun/Button';
import CustomTabs from '@/components/commun/Tabs/tabs';
import ButtomDrower from '@/components/dashboard/data/ButtomDrower';
import CreateUpdateButtomDrower from '@/components/dashboard/data/CreateUpdateButtomDrower';
import { DataTable } from '@/components/dashboard/data/Data-table'; 
import Scopes from '@/components/dashboard/overview/Scopes';
import { MuiButton } from '@/styles/theme/components/button';
 
export default function Page(): React.JSX.Element { 
  const dispatch = useDispatch();
  
  const rowsPerPage = 4;
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCU, setIsOpenCU] = useState(false);
  const { selectedRow, dataDB } = useSelector((state: any) => state.file);
  const [searchInput,setSearchInput]=useState('')
  const [searchDate,setSearchDate]=useState('')
  const [rows, setRows] = useState([{}]);

  const [page, setPage] = useState(1); // Start on page 1

  const [pages,setPages]=useState(1);
  const [totalRows,setTotalRows]=useState(1);

  const [dataEmission, setDataEmission] = useState<Data[]>([]);

  const [startFullDate, setStartFullDate] = useState<Date | ''>('');
  const [endFullDate, setEndFullDate] = useState<Date | ''>('');
  const [column,setColumn]=useState('');
const [operator,setOperator]=useState('');
const [value,setValue]=useState('');
  const handleModify = () => {};

  const handleImporter = () => {
    setIsOpen(!isOpen);

    console.log('handleImporter', isOpen);
  };
  const handleChangePage = ( newPage ) => {
    console.log("handle change page",page)
    setPage(newPage); 
  };

  const onFilterByFiltering=(selectedValue,operator,value)=>{
    console.log("searching equal page task==>",selectedValue,operator,value)
    setColumn(selectedValue);
      setOperator(operator);
      setValue(value)
    
  
  }

  const getData = React.useCallback(async (): Promise<void> => {
    console.log("searchInput",searchInput)
    const filters = {
      startFullDate:startFullDate,
      endFullDate:endFullDate, 
      page,  
      limit: rowsPerPage,  
      search:searchInput,
      column:column,
      operator:operator,
      value:value,

    };
    console.log("filters data",filters)
    const { error, res,total,totalPages } = await dataApis.getData(filters);
    if (error) {
      return;
    }
    dispatch(setDataDB(res));
    setDataEmission(res);
    setTotalRows(total);
    setPages(totalPages);
    setRows(res); 
  }, [dispatch, page, rowsPerPage,pages,totalRows, searchInput,endFullDate,startFullDate,,column,operator,value]);

  useEffect(() => {
    getData();
  }, [getData]);

  // const { selectedRow ,dataDB } = useSelector((state: any) => state.file);
  const handleDelete = React.useCallback(async (): Promise<string> => {
    const { error, res } = await dataApis.deleteData(selectedRow._id);
    console.log('see' + selectedRow);
    if (error) {
      return error;
    }
    
    const indexToRemove = dataDB.indexOf(selectedRow);
    const newData = dataDB.filter((_: any, i: any) => i !== indexToRemove);
    dispatch(setDataDB(newData));
    dispatch(clearSelectedRow());
    return res;
  }, [selectedRow]);

  const handleCreate = React.useCallback(
    async (DataToCreate: any): Promise<void> => {
      const { error } = await dataApis.createData(DataToCreate);
      if (error) {
        dispatch(setOpenToast({ message: error, type: 'error' }));
        return
      }
      dispatch(setOpenToast({ message: 'Data Added Successfully', type: 'success' }));
      dispatch(addDataDB(DataToCreate));
      setIsOpenCU(false);
    },
    []
  );

  const handleUpdate = React.useCallback(
    async (DataToUpdate: any): Promise<string> => {
      const { error, res} = await dataApis.updateData(DataToUpdate);
      if (error) {
        dispatch(setOpenToast({ message: error, type: 'error' }));
        return error 
      }
      dispatch(setOpenToast({ message: 'Data Updated Successfully', type: 'success' }));
      dispatch(updateDataDB(DataToUpdate));
      dispatch(clearSelectedRow());
      return res
    },
    []
  );



  const onFilterByDate = (selectedDate: Date) => {
    console.log("OnfitlerBydate page date==>",selectedDate[0],selectedDate[1])
    setStartFullDate(selectedDate[0]);
    setEndFullDate(selectedDate[1])  
      
        
      
    };
    const onFilterBySearch=(search)=>{ 
      console.log("onFilterBySearch=>",search)
      setSearchInput(search)
    }




  return (
    <Box>
      <Grid container justifyContent="space-between" spacing={2}>
        <Grid item xs={8}>
          <Typography variant="h3" color="var(--Grey-grey-900, #1A1D21)" gutterBottom>
            Data
          </Typography>
          <Typography variant="bodyP2" color="var(--Grey-grey-400, #88909F)">
            Here's your carbon emissions data. Feel free to add new entries, upload data, or utilize our API for
            seamless integration
          </Typography>
          <Divider sx={{ backgroundColor: '#EAECF0', height: '1px', width: '100%', marginTop: '24px' }} />
        </Grid>

        <Grid item xs={4} container justifyContent="flex-end">
          <Grid item spacing={2}>
            <Button
              btnType="Primary"
              sx={{
                ...MuiButton.styleOverrides.sizeSmall,
                borderRadius: '6px',
                marginRight: '16px',

                background: 'var(--Colors-Base-00, #FFF)',
              }}
              startIcon={<ImportIcon fontSize="var(--icon-fontSize-sm)" color="var(--Grey-grey-600, #606977)" />}
              onClick={handleImporter}
            >
              <Typography variant="h7" sx={{ color: 'var(--Grey-grey-600, #606977)' }}>
                Import
              </Typography>
            </Button>

            <Button
              btnType="Primary"
              onClick={() => setIsOpenCU(true)}
              sx={{
                ...MuiButton.styleOverrides.sizeSmall,
                borderRadius: '6px',
                background: 'var(--Green-green-500, #16B364)',
              }}
              startIcon={<PlusIcon fontSize="var(--icon-fontSize-sm)" color="white" />}
            >
              <Typography variant="h7" sx={{ color: 'var(--Colors-Base-00, #FFF)' }}>
                New
              </Typography>
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <DataTable handleDelete={handleDelete} onFilterByFiltering={onFilterByFiltering} handleUpdate={handleUpdate} page={page} rows={rows} rowsPerPage={rowsPerPage}
      
      onFilterBySearch={onFilterBySearch} onFilterByDate={onFilterByDate} pages={pages} handleChangePage={handleChangePage}
      />
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

      <CreateUpdateButtomDrower
        open={isOpenCU}
        onClose={() => setIsOpenCU(false)}
        onAction={handleCreate}
        title={'Data Entry'}
        subTitle={'Enter specific details for each program category selected.'}
        action={'create'}
      />
    </Box>
  );
}
