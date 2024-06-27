'use client';

import React, { useCallback, useEffect, useState } from 'react';
import UpdateBottomDrawerTask from '@/app/dashboard/tasks/UpdateBottomDrawer';
import { AssignIcon, DashboardIcon, DeleteIcon, DotsHorizontal, ModifyIcon } from '@/icons';
import { TroubleshootSharp } from '@mui/icons-material';
import { IconButton, LinearProgress, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
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
import { useDispatch, useSelector } from 'react-redux';

import { Task } from '@/types/task'; 
import { setTasks } from '@/lib/store/reducer/useTask';
import { taskApis } from '@/lib/task/taskApis';
import usePagination from '@/hooks/use-pagination';
import { useSelection } from '@/hooks/use-selection';
import DeleteConfirmation from '@/components/commun/Alerts/DeleteConfirmation';
import { Pagination } from '@/components/commun/Pagination/Pagination';
import DropdownTableCell from '@/components/DropDown/DropdownTableCell';
import { palette } from '@/styles/theme/colors';

import FilterColumns from '../../commun/Filters/FilterColumns';
import { setOpenToast } from '@/lib/store/reducer/useGlobalActions';
interface TasksTableProps { 
    count?: number;
    page?: number;
    rows?: Task[];
    rowsPerPage?: number;
    onFilterBySearch:any;
    onFilterByFiltering:any;
    onFilterByDate:any;
    pages:number,
    handleChangePage:any;
    
  }

export function TasksTable({
  rows = [],
  rowsPerPage = 5,
  
  onFilterBySearch,
  onFilterByFiltering,
  onFilterByDate,
  pages,
  handleChangePage,selectedTab
}: TasksTableProps): React.JSX.Element {
  const dispatch = useDispatch();

  const { tasks } = useSelector((state: any) => state.task);
  const { targets } = useSelector((state: any) => state.target);
  const { users } = useSelector((state: any) => state.user);
  const [page, setPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [modify, setModify] = useState(false);
  const [isAssign, setIsAssign] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { dataDB } = useSelector((state: any) => state.file);
  const paginatedRows = usePagination({ rows, page, pageSize: rowsPerPage });
  console.log("rowsPerPage",paginatedRows,rows.length,page)
  const columns: Column[] = [
    { field: 'taskName', headerName: 'tasks', width: 150, filterable: true, type: 'string' },
    { field: 'dueDate', headerName: 'Due Date', width: 110, filterable: true, type: 'Date' },
    { field: 'status', headerName: 'status', width: 160, filterable: true, type: 'string' },
    {field:"progress", headerName:"progress", width: 160, filterable: true, type: 'number'},
    { field: 'targetName', headerName: 'Target Name', width: 150, filterable: true, type: 'string' },
  
  ];


  const updateSearch=(search:string)=>{
    console.log("search Data table",search)
    onFilterBySearch(search);
  }
const updateFiltering=(selectedValue:string,operator:string,value:string)=>{
  console.log("update filtering from task table",selectedValue,operator,value);
  onFilterByFiltering(selectedValue,operator,value);
}

  const updateChangePage = (event: any, newPage: any) => {
    console.log("update change data===>",newPage)
    setPage(newPage);
    handleChangePage(newPage);
  };
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, taskId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedTaskId(taskId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedTaskId(null);
  };
  const handleClose = () => {
    setAnchorEl(null);
    setSelectedTaskId(null);
    setModify(false);
    setIsAssign(false);
  };

  const handleModify = (event: React.MouseEvent<HTMLElement>, task: Task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTaskId(task?.id);
    setModify(true);
    // const selectedTask = tasks.find((task) => task.id === taskId); // Find the selected task
    setSelectedRow(task);

    handleMenuClose();
  };

  const handleAssign = (event: React.MouseEvent<HTMLElement>, task: Task) => {
    setAnchorEl(event.currentTarget);
    setSelectedTaskId(task?.id);
    setIsAssign(true);
    // const selectedTask = tasks.find((task) => task.id === taskId); // Find the selected task
    setSelectedRow(task);

    handleMenuClose();
  };

  const handleDelete = (task: Task) => {
    setSelectedTaskId(task?.id);
    setIsDeleteOpen(true);
    setSelectedRow(task);
  };

/*   const getTasks = React.useCallback(async (): Promise<void> => {
    try {
      const filters = {
        dueDate: searchDate,
        page: 1,
        limit: 15,
        search: searchInput,
      };

      const { error, res } = await taskApis.getTasks(filters);

      if (error) {
        return;
      }
          console.log("get tasks",Object.keys(tasks[0]))
      dispatch(setTasks(res));
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }, [selectedTab, page, rowsPerPage, dispatch, searchInput, searchDate]);

  useEffect(() => {
    getTasks();
  }, [getTasks]); */

/*   const onFilterByDate = (selectedDate: Date) => {
    const selectedDateObjFormat = dayjs(selectedDate).format('YYYY-MM-DD');
    setSearchDate(selectedDateObjFormat);
  };

  const onFilterBySearch = (search) => {
    setSearchInput(search);
  }; */

  const handleUpdateTask = useCallback(
    async (data: any): Promise<void> => {
      console.log('update=>>>>>', { data });
      console.log('update=>>>>>tasks ', { tasks });
      const { error, res } = await taskApis.updateTask(data);
      if (error) {
        return;
      } else {
        const targetUpdated = targets.find((target) => target._id === data.targetName);
        const newTasks = tasks.map((tar: Task) => {
          if (tar.id === data.id) {
            return {
              ...data,
              targetName: targetUpdated.name,
              usersIds :[ data.users]
            };
          }
          return tar;
        }); 
        console.log('update=>>>>>tasks ', { newTasks });
        dispatch(setTasks(newTasks));
      }
      handleClose();
    },
    [tasks]
  );
  const handleAssignTask = React.useCallback(async (data: any): Promise<void> => {
    const { error, res } = await taskApis.assignTask(data);
    if (error) {
      dispatch(setOpenToast({ message: error, type: 'error' }));
      return;
    } else {
      const newTasks = targets.map((tar: Task) => {
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
  const handleDeleteTask = React.useCallback(
    async (data: string): Promise<void> => {
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
        dispatch(setOpenToast({ message: 'Task Deleted Successfully', type: 'success' }));
        // Clear selected row state
        setSelectedRow(null);
      }

      handleClose();
    },
    [dispatch, tasks, selectedRow]
  );

  return (
    <Card>
       <FilterColumns columns={columns} onFilterByFiltering={updateFiltering} onFilterByDate={onFilterByDate} onFilterBySearch={updateSearch} isYear={false} isDate={true} isFullDate={false}/>
     
 
      <Divider />
      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ minWidth: '800px' }}>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox"></TableCell>
              <TableCell>Tasks</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Assigned Users</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Target Name</TableCell>
              <TableCell>Base To Target Year</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows && paginatedRows.map((row) => (
              <TableRow hover key={row.id}>
                <TableCell padding="checkbox"></TableCell>
                <TableCell>
                  <Typography variant="bodyB3">{row.taskName}</Typography>
                </TableCell>
                <TableCell>{dayjs(row.dueDate).format('MMM D, YYYY')}</TableCell>
                <TableCell>
                  {Array.isArray(row.usersIds) ? (
                    row.usersIds?.map((user, index) => <span key={index}>{user.username}</span>)
                  ) : (
                    <span></span>
                  )}  
                </TableCell>
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
                      {50} %
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="bodyP3">{row.targetName}</Typography>
                </TableCell>
                <TableCell>2020-2023</TableCell>
                <TableCell>
                  <Box display="flex" justifyContent="center" alignItems="center">
                    <IconButton onClick={(event) => handleMenuOpen(event, row.id)}>
                    <DropdownTableCell  task={row} />
                    </IconButton>
                    
                  </Box>
                </TableCell>
              </TableRow>
            ))}
             {!paginatedRows ||
              (paginatedRows.length == 0 && (
                <TableRow>
                  <TableCell colSpan={10} padding="checkbox">
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginY: '2rem' }}>
                      <img src={'/assets/empty.png'} width={200} height={200} alt="My Image" />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </Box>
      <Divider />
      {modify && selectedRow && (
        <UpdateBottomDrawerTask
          open={modify}
          handleCancelTask={handleClose}
          onUpdateTask={handleUpdateTask}
          task={selectedRow}
          users={users}
          targets={targets}
          isAssign={false}
          headerName="Edit Task"
          titleName="Edit a Task"
          subtitleName="Edit a task to further streamline your carbon emission management process."
        />
      )}

      
      {isAssign && selectedRow && (
        <UpdateBottomDrawerTask
          open={isAssign}
          handleCancelTask={handleClose}
          onUpdateTask={handleAssignTask}
          task={selectedRow}
          users={users}
          targets={targets}
          isAssign={isAssign}
          headerName="Assign Task"
          titleName="Assign a Task"
          subtitleName="Assign a task to further streamline your carbon emission management process."
        />
      )}

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
