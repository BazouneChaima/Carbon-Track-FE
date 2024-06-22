import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { dataApis } from '@/lib/data/dataApis';
import { FilterEmptyRow, getEmission, isEmpty, isEmptyArray } from '@/lib/helper';
import { clearSelectedRow, setData } from '@/lib/store/reducer/useFile';
import { setOpenToast } from '@/lib/store/reducer/useGlobalActions';

import { DataTable } from '../Data-table';
import dayjs from 'dayjs';

export default function ExportStepThree() {
  const rowsPerPage = 4;

  const [page, setPage] = useState(1); // Start on page 1

  const [pages,setPages]=useState(1);
  const { file, columnMapped, dataDB } = useSelector((state: any) => state.file);
  const dispatch = useDispatch();
  const [searchInput,setSearchInput]=useState('')
  const [searchDate,setSearchDate]=useState('')
  const [totalRows,setTotalRows]=useState(1);
  const [rows, setRows] = useState([{}]);
  const [filteredRows, setFilteredRows] = useState([]); // State to store filtered data
  const [startFullDate, setStartFullDate] = useState<Date | ''>('');
  const [endFullDate, setEndFullDate] = useState<Date | ''>('');
  const onFilterByDate = (selectedDate: Date) => {
    console.log("OnfitlerBydate page date==>",selectedDate[0],selectedDate[1])
    setStartFullDate(selectedDate[0]);
    setEndFullDate(selectedDate[1])  
      
        
      
    };
  useEffect(() => {
    if (file) {
      const reader = new FileReader();
      reader.onload = async function (e: any) {
        const fileContent = e.target.result;

        // Process the file content here
        let lines = fileContent.split('\n');
        console.log("liness=>",lines.length)
      
        setTotalRows(lines.length);
        setPages( Math.ceil(lines.length / rowsPerPage));
        const newRows = [{}];
        lines?.slice(1).map((line, index:number) => {
          const rowArray = line.split(',');
          if (!isEmptyArray(rowArray)) {
            console.log("!isEmptyArray(rowArray")
            //console.log('year' + parseInt(rowArray[columnMapped['Date']]));
            //console.log('result emissio find=====<' +getEmission(dataDB , rowArray[columnMapped['Date']] , rowArray[columnMapped['Category']], rowArray[columnMapped['Location']] ))
            newRows.push({
              id: index,
              date: dayjs(rowArray[columnMapped['Date']]).format('YYYY-MM-DD'),
              location: rowArray[columnMapped['Location']],
              category: rowArray[columnMapped['Category']],
              quantity: rowArray[columnMapped['Quantity']],
              //emission_tracker: getEmission(dataDB , rowArray[columnMapped['Date']] , rowArray[columnMapped['Category']], rowArray[columnMapped['Location']] )
              //emission_tracker: rowArray[columnMapped['Emission Factor']],
            });
            console.log("pppppppppppppppppp"+newRows)
          }
        });
       // console.log('newArray' + JSON.stringify(newRows));
        try {
          console.log("in try"+ JSON.stringify(newRows))
          const { error, res } = await dataApis.generateRow(newRows.slice(1));
          if (error) {
            console.log("error",error)
            dispatch(setOpenToast({ message: 'something wrong', type: 'error' }));
            return;
          } else {
            console.log('generateRow==>' + JSON.stringify(res),pages,Object.keys(res));
            /* dispatch(setData(res));
            console.log("dispatch res",Object.keys(res))
            setRows(res);  */
           // setPages(totalPages);
           dispatch(setData(res));
           setRows(res);
           setFilteredRows(res)
           
        setTotalRows(lines.length);
        setPages( Math.ceil(lines.length / rowsPerPage));
          }
        } catch (e) {
          dispatch(setOpenToast({ message: 'something wrong', type: 'error' }));
        }
      };
      reader.readAsText(file);
    } else {
      console.log('No file selected');
    }
  }, [file]);
  const { selectedRow } = useSelector((state: any) => state.file);
  const handleDelete = () => {
    console.log('rpw'+ JSON.stringify(rows))
    const indexToRemove = rows.indexOf(selectedRow);
    const newData = rows.filter((_: any, i: any) => i !== indexToRemove);
    setRows(newData);
    dispatch(clearSelectedRow());
    return 'success';
  };
  const handleUpdate = (DataToUpdate : any) => {
    console.log('handle update'+ JSON.stringify(DataToUpdate))
    console.log('rpw'+ JSON.stringify(rows))
    const indexToUpdate = rows.indexOf(DataToUpdate);
    const newRows = rows.map((row) => {
      console.log(indexToUpdate)
      if (row.id === DataToUpdate.id) {
        console.log('here found' + JSON.stringify(DataToUpdate));
        return DataToUpdate;
      }else{

        return row;
      }

    });
    setRows(newRows);
    dispatch(clearSelectedRow());
    return 'success';
  };
  
  
    useEffect(() => {
      const applyFilters = () => { 
        const filteredData = rows.filter((row) => {
          // Combine location and category filtering here:
          const locationMatch = !searchInput || row.location.toLowerCase().includes(searchInput.toLowerCase());
          const categoryMatch = !searchInput || row.category.toLowerCase().includes(searchInput.toLowerCase());
             // Convert startFullDate and endFullDate to Date objects (assuming they are strings in YYYY-MM-DD format)
          const startDate = startFullDate ? new Date(startFullDate) : null;
          const endDate = endFullDate ? new Date(endFullDate) : null;
          

          const hasDateFilter = startDate || endDate;

      // Date filtering logic (only applied if hasDateFilter is true)
      const dateMatch = hasDateFilter
        ? new Date(row.date) > startDate && new Date(row.date) < endDate
        : true; // No date filter, so include all rows

      return (locationMatch || categoryMatch) && dateMatch;


     //     return locationMatch || categoryMatch; // AND condition for both criteria
        });
        console.log("filteredData",filteredData)
        setFilteredRows(filteredData);
       
      };
  
      applyFilters(); // Apply filters initially
  
      // Dependency array: Re-run useEffect when searchInput or rows change
    }, [searchInput,startFullDate, endFullDate,rows]);


    const onFilterBySearch=(search)=>{ 
      console.log("onFilterBySearch=>",search,filteredRows)
      setSearchInput(search)
      //setRows(filteredRows);
    }
    const handleChangePage = ( newPage ) => {
      console.log("handle change page===>",rows)
      
      setPage(newPage); 
      
      
    };
  return (
    <Grid
      container
      xs={12}
      sx={{
        display: 'flex',
        flex: '1 0 0',
        padding: '24px 0px',
        //flexDirection: 'column',
        justifyContent: 'center',
        //alignItems: 'center',
        width: '100%',
      }}
    >
      <Grid item xs={8}>
        <Typography variant="h5" color="var(--Grey-grey-900, #1A1D21)" gutterBottom>
          Verification
        </Typography>
        <Typography variant="body2" color="var(--Grey-grey-400, #888909F)">
          Verify that your file doesn’t contain any issue to be able to complete the process of import data
        </Typography>
      </Grid>

      <Grid item xs={8}>
       {/*  <DataTable
          page={1}
          rows={rows}
          rowsPerPage={4}
          importFunc={true}
          handleDelete={handleDelete}
          handleUpdate={handleUpdate}
        /> */}

        <DataTable 
          handleDelete={handleDelete} 
          handleUpdate={handleUpdate} 
           
          rows={filteredRows} 
          rowsPerPage={rowsPerPage}
          onFilterBySearch={onFilterBySearch} 
          onFilterByDate={onFilterByDate} 
         // pages={pages} 
          handleChangePage={handleChangePage}
      />



      </Grid>
    </Grid>
  );
}
