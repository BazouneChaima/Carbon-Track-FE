'use client';

import React, { useMemo, useState } from 'react';
import { redirect, useRouter } from 'next/navigation';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { useDispatch } from 'react-redux';
import { Pagination } from '@/components/commun/Pagination/Pagination';
import usePagination from '@/hooks/use-pagination';
import { Target } from '@/types/target';
import { setTarget } from '@/lib/store/reducer/useTarget';
import { useSelection } from '@/hooks/use-selection';
import Chip from '@/components/commun/Chip/Chip'; 
import DropdownTableCell from '@/components/DropDown/DropdownTableCellTarget';
import { palette } from '@/styles/theme/colors';

import empty from '../../../../public/assets/empty.png';
import EmptySVG from '../../../../public/assets/svg/empty';
import FilterColumns from '../../commun/Filters/FilterColumns';


export interface Customer {
  id: string;
  avatar: string;
  name: string;
  email: string;
  address: { city: string; state: string; country: string; street: string };
  phone: string;
  createdAt: Date;
}

interface TargetsTableProps {
  count?: number;
  page?: number;
  pages:number,
  rows?: Target[];
  rowsPerPage?: number;
  onFilterBySearch:any;
  onFilterByDate:any;
  onFilterByFiltering:any;
  handleChangePage:any;
  
}

export function TargetsTable({  
  rows = [],
  rowsPerPage = 5,
  
  onFilterBySearch,
  onFilterByFiltering,
  onFilterByDate,
  pages,
  handleChangePage,
 }: TargetsTableProps): React.JSX.Element {
  const columns: Column[] = [
    { field: 'name', headerName: 'Target', width: 150, filterable: true, type: 'string' },
    { field: 'type', headerName: 'Type', width: 110, filterable: true, type: 'string' },
    {field:"emissionReduction", headerName:"Emission Reduction", width: 160, filterable: true, type: 'number'},
  ];
  const rowIds = React.useMemo(() => {
    return Array.isArray(rows) && rows?.map((customer) => customer.id);
  }, [rows]);
  const [page, setPage] = useState(1); 
  const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection(rowIds);

  const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < rows.length;
  const selectedAll = rows.length > 0 && selected?.size === rows.length;

  const dispatch = useDispatch();

  const paginatedRows = usePagination({ rows, page, pageSize: rowsPerPage });
  const router = useRouter();
  console.log("pppppppppppppppp",paginatedRows)
  const [pageSize, setPageSize] = useState(rowsPerPage);
console.log("pagineted and rows target",rows,paginatedRows,pages)

  const updateChangePage = (event: any, newPage: any) => {
    console.log("update change data",newPage)
    setPage(newPage);
    handleChangePage(newPage);
  };
  const updateSearch=(search:string)=>{
    console.log("search Data table",search)
    onFilterBySearch(search);
  }
   

  const handleClickRow = (event: any, data: any) => {
    if (
      !event.target.classList.contains('mui-wlbu0w-MuiTableCell-root') 
    ) {
      return;
    }
    //Row selected

    dispatch(setTarget(data));
    router.push('/dashboard/target/details');
  };
  const updateFiltering=(selectedValue:string,operator:string,value:string)=>{
    console.log("update filtering from task table",selectedValue,operator,value);
    onFilterByFiltering(selectedValue,operator,value);
  }
  

  return (
    <Card>
      <FilterColumns columns={columns} onFilterByFiltering={updateFiltering} onFilterByDate={onFilterByDate} onFilterBySearch={updateSearch} isYear={true} isDate={false} isFullDate={false}/>
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                />
              </TableCell>
              <TableCell>Target Name</TableCell>
              <TableCell>Target Type</TableCell>
              <TableCell>Emission Reduction Target</TableCell>
              <TableCell>Base To Target Year</TableCell>

              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows &&
              rows.map((row, index) => {
                const isSelected = selected?.has(row.id);

                return (
                  <TableRow
                    hover
                    onClick={(e) => handleClickRow(e, row)}
                    key={row.id}
                    selected={isSelected}
                    //style={index % 2 ? { background: palette.gray[25] } : { background: 'white' }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={isSelected}
                        onChange={(event) => {
                          event.stopPropagation();
                          if (event.target.checked) {
                            selectOne(row.id);
                          } else {
                            deselectOne(row.id);
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                        {/* <Avatar src={row.avatar} /> */}
                        <Typography variant="subtitle2">{row.name}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip chipType="primaryLight">{row.type}</Chip>
                    </TableCell>

                    <TableCell>{row.emissionReduction}</TableCell>
                    <TableCell>{row.baseYear }-{row.targetYear}</TableCell>
                    <TableCell>
                    <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem' }}>
                      <DropdownTableCell  target={row} />
                    </Box>
                    </TableCell>
                  </TableRow>
                );
              })}

            {!rows || rows.length == 0  && (
              <TableRow>
                <TableCell colSpan={5} padding="checkbox">
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginY: '2rem' }}>
                    <img src={'/assets/empty.png'} width={200} height={200} alt="My Image" />
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      <Box style={{ display: 'flex', justifyContent: 'center' }}>
      <Pagination
          paginatioType="gray"
          // color='gray'
          //count={pages} // Total number of pages
          count={pages}
          page={page}
          onChange={updateChangePage}
          size="small"
          showFirstButton
          showLastButton
          shape="rounded"
        />
      </Box>
    </Card>
  );
}