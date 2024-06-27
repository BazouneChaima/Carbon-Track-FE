'use client';

import React,{useState,useEffect,useCallback} from 'react';
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
import { setOpenToast } from '@/lib/store/reducer/useGlobalActions';
 
import usePagination from '@/hooks/use-pagination';
import { Pagination } from '@/components/commun/Pagination/Pagination';
import DeleteConfirmation from '@/components/commun/Alerts/DeleteConfirmation';
import { AssignIcon, DashboardIcon, DeleteIcon, DotsHorizontal, ModifyIcon } from '@/icons';
import { useSelection } from '@/hooks/use-selection'; 
import DropdownTableCell from '@/components/DropDown/DropdownTableCell';
import FilterColumns from '../../commun/Filters/FilterColumns';
import { IconButton } from '@mui/material';
import { Task } from '@/types/task';
import { taskApis } from '@/lib/task/taskApis';
import { setTasks } from '@/lib/store/reducer/useTask';
import { useDispatch, useSelector } from 'react-redux';
import { palette } from '@/styles/theme/colors';
import UpdateBottomDrawerTask from "@/app/dashboard/tasks/UpdateBottomDrawer";
import {   ListItemIcon, ListItemText, Menu, MenuItem , LinearProgress} from '@mui/material';
import { TroubleshootSharp } from '@mui/icons-material';
interface TaskMeTableProps {
  count?: number;
  page?: number;
  rows?: Task[];
  rowsPerPage?: number;
  onFilterBySearch:any;
  onFilterByDate:any;
  pages:number,
  handleChangePage:any;
  onFilterByFiltering:any;
  
}

export function MyTasksTable({
  rows = [],
  rowsPerPage = 5,
  
  onFilterBySearch,
  onFilterByFiltering,
  onFilterByDate,
  pages,
  handleChangePage,selectedTab="My Tasks"
}: TaskMeTableProps): React.JSX.Element {
  const columns: Column[] = [
    { field: 'taskName', headerName: 'tasks', width: 150, filterable: true, type: 'string' },
    { field: 'dueDate', headerName: 'Due Date', width: 110, filterable: true, type: 'Date' },
    {field:"progress", headerName:"progress", width: 160, filterable: true, type: 'number'},
    { field: 'status', headerName: 'status', width: 150, filterable: true, type: 'string' },
  ];
 
  
  const { targets } = useSelector((state: any) => state.target);
  const { users } = useSelector((state: any) => state.user); 
  const { user } = useSelector((state: any) => state.user); 
 
  const [selectedRow,setSelectedRow]=useState(null); 
  const [page, setPage] = useState(1); // Start on page 1  
   const dispatch = useDispatch();
   const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
const [searchInput,setSearchInput]=useState('')
const [searchDate,setSearchDate]=useState('')
const [modify,setModify]=useState(false);
const [isAssign,setIsAssign]=useState(false);
const [isDeleteOpen,setIsDeleteOpen]=useState(false);
const { tasks } = useSelector((state: any) => state.task);
const paginatedRows = usePagination({ rows, page, pageSize: rowsPerPage });
  console.log("ppppppppppp",rows)



const updateChangePage = (event: any, newPage: any) => {
    console.log("update change data",newPage)
    setPage(newPage);
    handleChangePage(newPage);
  };

 
const updateSearch=(search:string)=>{
  console.log("search Data table",search)
  onFilterBySearch(search);
}
const updateFiltering=(selectedValue:string,operator:string,value:string)=>{
  console.log("update filtering from task table",selectedValue,operator,value);
  onFilterByFiltering(selectedValue,operator,value);
}

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, taskId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedTaskId(taskId);

  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTaskId(null);
  };
  const handleClose=()=>{
    setAnchorEl(null);
    setSelectedTaskId(null);
    setModify(false);
    setIsAssign(false);

  }

  const handleModify = (event: React.MouseEvent<HTMLElement>, task: Task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTaskId(task?.id);
    setModify(true); 
   // const selectedTask = tasks.find((task) => task.id === taskId); // Find the selected task
    setSelectedRow(task) 

    console.log("hnale modify",task)
    
    handleMenuClose();
  };

  const handleAssign = (event: React.MouseEvent<HTMLElement>, task: Task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTaskId(task?.id);
    setIsAssign(true); 
   // const selectedTask = tasks.find((task) => task.id === taskId); // Find the selected task
    setSelectedRow(task) ;

    console.log("hnale modify",task)
    
    handleMenuClose();
  };


  
 
  const handleDelete = (task: Task) => {
   
    setSelectedTaskId(task?.id);
    setIsDeleteOpen(true);  
    setSelectedRow(task) 
    console.log("handleDelete==>",task, selectedRow)
     
  };
  const handleUpdateTask=useCallback(async (data:  any): Promise<void> => {
    console.log("update",data.usersIds)
    const { error, res } = await taskApis.updateTask(data);
    if (error) {
      dispatch(setOpenToast({ message: error, type: 'error' }));
      return;
    } else { 

      const newTasks =  targets.map((tar : Task) => {
        if (tar.id === data.id) {
          return data;
        }
        return tar;
      });
      //setIsDeleteOpen(false);
      dispatch(setOpenToast({ message: 'Task Updated Successfully', type: 'success' }));
      dispatch(setTasks(newTasks));
     


    }
    handleClose();
  }, []);
  const handleAssignTask = React.useCallback(async (data:  any): Promise<void> => {
    console.log("handle assign data===>",Object.keys(data))
    const { error, res } = await taskApis.assignTask(data);
    if (error) {
      dispatch(setOpenToast({ message: error, type: 'error' }));
      return;
    } else { 

      const newTasks =  targets.map((tar : Task) => {
        if (tar.id === data.id) {
          return data;
        }
        return tar;
      });
      dispatch(setOpenToast({ message: 'Task Assigned Successfully', type: 'success' }));
      dispatch(setTasks(newTasks));
       
    }
    handleClose();
  }, []);
  const handleDeleteTask = React.useCallback(async (data: string): Promise<void> => {
    console.log("handle deelte task===>", data, selectedRow, selectedTaskId);
    const { error, res } = await taskApis.deleteTask(selectedRow?.id);
    if (error) {
      dispatch(setOpenToast({ message: error, type: 'error' }));
      return;
    } else {
      const indexToRemove = tasks.indexOf(selectedRow);
      const newTasks = tasks.filter((_: any, i: any) => i !== indexToRemove);
      setIsDeleteOpen(false);
      // Update tasks in Redux store
      dispatch(setTasks(newTasks));
      // Clear selected row state

      dispatch(setOpenToast({ message: 'Task Deleted Successfully', type: 'success' }));
      setSelectedRow(null);
    }
  
    handleClose();
  }, [dispatch, tasks, selectedRow]);




  return (
    <Card>
     {/*  <FilterColumns onFilterByDate={onFilterByDate}/> */}
    
     <FilterColumns columns={columns} onFilterByFiltering={updateFiltering} onFilterByDate={onFilterByDate} onFilterBySearch={updateSearch} isYear={false} isDate={true} isFullDate={false}/>
      

      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
              {/*   <Checkbox
                  checked={selectedAll}
                  indeterminate={selectedSome}
                  onChange={(event) => {
                    if (event.target.checked) {
                      selectAll();
                    } else {
                      deselectAll();
                    }
                  }}
                /> */}
              </TableCell>
              <TableCell>Tasks</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>status</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {rows &&
              rows.map((row, index) => {
              /* const isSelected = selected?.has(row.id); */

              return (
                <TableRow hover key={row.id} /* selected={isSelected} */>
                  <TableCell padding="checkbox">
                   {/*  <Checkbox
                      checked={isSelected}
                      onChange={(event) => {
                        if (event.target.checked) {
                          selectOne(row.id);
                        } else {
                          deselectOne(row.id);
                        }
                      }}
                    /> */}
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2">{row.taskName}</Typography>
                    
                  </TableCell>

                  <TableCell>{dayjs(row.dueDate).format('MMM D, YYYY')}</TableCell>
                  <TableCell>

                  <Stack direction="row" spacing={3} width="100%">
                    <Box width="50%" sx={{ alignContent: 'center' }}>
                      <LinearProgress
                        sx={{
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: palette.success[500],
                          },
                          background: palette.primary[100],
                          height: 8,
                          borderRadius: 1,
                        }}
                        variant="determinate"
                        value={50}
                      />
                    </Box>
                    <Typography variant="body2" color={palette.primary[500]}>
                      {20} %
                    </Typography>
                  </Stack>

                  </TableCell>
                  <TableCell>{row.status}</TableCell>
                  <TableCell>
                  <Box display="flex" justifyContent="center" alignItems="center">
                    <IconButton onClick={(event) => handleMenuOpen(event, row.id)}>
                    <DropdownTableCell  task={row} />
                    </IconButton>
                    
                  </Box>
                   </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      {modify && selectedRow && (
       <UpdateBottomDrawerTask 
       open={modify} 
       handleCancelTask={ handleClose } 
       onUpdateTask={handleUpdateTask } 
       task={selectedRow}
       users={users} 
       targets={targets} 
       isAssign={false}  

       headerName="Edit Task"
       titleName="Edit a Task"
       subtitleName="Edit a task to further streamline your carbon emission management process."
       
       />)
      }
{isAssign && selectedRow && (
       <UpdateBottomDrawerTask 
       open={isAssign} 
       handleCancelTask={ handleClose } 
       onUpdateTask={handleAssignTask } 
       task={selectedRow}
       users={users} 
       targets={targets} 
       isAssign={isAssign}  

       headerName="Assign Task"
       titleName="Assign a Task"
       subtitleName="Assign a task to further streamline your carbon emission management process."
       
       />)
      }
      <Divider />
      <Box display="flex" justifyContent="center">
      <Pagination
          paginatioType="gray"
         
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
