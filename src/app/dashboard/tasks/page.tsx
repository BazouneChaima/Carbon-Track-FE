'use client';

import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { useDispatch, useSelector } from 'react-redux';
import { Task } from '@/types/task';
import { User } from '@/types/user';
import { setTargets } from '@/lib/store/reducer/useTarget';
import { setTasks } from '@/lib/store/reducer/useTask';
import { targetApis } from '@/lib/target/targetApis';
import { taskApis } from '@/lib/task/taskApis';
import { userApis } from '@/lib/user/userApis';
import CustomTabs from '@/components/commun/Tabs/taskTabs';
import { MyTasksTable } from '@/components/dashboard/tasks/myTasks-table';
import { TasksTable } from '@/components/dashboard/tasks/tasks-table';
import BottomDrawer from './BottomDrawer';
import { setOpenToast } from '@/lib/store/reducer/useGlobalActions';
import dayjs from 'dayjs';
export default function Page(): React.JSX.Element {
  console.log('rrrrrrrrrrrrrrrrrrrouting')
  const [selectedTab, setSelectedTab] = React.useState<string>('All Tasks');
  const [users, setUsers] = useState<User>({});
  const [isNewTask, setIsNewTask] = useState(false);
  const { tasks } = useSelector((state: any) => state.task);
  const { targets } = useSelector((state: any) => state.target);
  const { user } = useSelector((state: any) => state.user);
  const [search, setSearch] = useState('');
  const [searchInput,setSearchInput]=useState('')
const [searchDate,setSearchDate]=useState('')
  const [newTask, setNewTask] = useState<Task>({ ['createdBy']: user.id });
  const [column,setColumn]=useState('');
  const [operator,setOperator]=useState('');
  const [value,setValue]=useState('');
  const rowsPerPage = 8;
  
  const [pages,setPages]=useState(1);
  const [pagesMyTask,setPagesMyTask]=useState(1);
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();
  const [rows, setRows] = useState([{}]);
   

  const [totalRows,setTotalRows]=useState(1);

  const [totalRowsMyTask,setTotalRowsMyTask]=useState(1);


  const handleTabChange = (event: React.ChangeEvent<any>, newValue: string) => {
    setSelectedTab(newValue);
    setSearchInput('');
    setPage(1); 
    
  };
 

  const handleCreateTask = React.useCallback(async (): Promise<void> => {
    setNewTask({ ...newTask, ['createdBy']: user.id });
    const { res, error } = await taskApis.createTask(newTask);
    if (error) {
      // setErrorAlert(error);
      dispatch(setOpenToast({message : error, type:'error'}))
      return;
    }
    dispatch(setTasks([...tasks, res]));
    dispatch(setOpenToast({message : 'Task Added Successfully', type:'success'}))
    handleClose();
  }, [newTask]);

  const getTasks = React.useCallback(async (): Promise<void> => {
    console.log("get tasks mytasks")
 try {
  const filters = {
    dueDate:searchDate,
    //page,  
     //limit: rowsPerPage,   
    search:searchInput,
    column:column,
    operator:operator,
    value:value,
  };
  const { error, res,total,totalPages } = await taskApis.getTasks(filters);
  
  console.log("length filtered filteredTasks",res)
  if (error) {
    dispatch(setOpenToast({ message: 'something wrong'+error, type: 'error' }));

    return;
  }

  console.log("filterss===>",filters,selectedTab,res)
  if(selectedTab=="All Tasks"){
    dispatch(setTasks(res)); 
    setTasks(res);
    setRows(res);  
    setTotalRows(total);
    setPages(Math.ceil(total/rowsPerPage));
    
    console.log("task 03",res,total,totalPages,page)
  }
  if(selectedTab=='My Tasks' || selectedTab=="Actions" )
  {
    let filteredTasks: Task[];
    filteredTasks=res.filter((task: Task) => 
      task?.usersIds?.some((userObj: any) => userObj._id === user.id)
    );
    dispatch(setTasks(filteredTasks)); 
    setTasks(filteredTasks);
    setRows(filteredTasks);  
    setTotalRowsMyTask(total);
    setPagesMyTask(Math.ceil(filteredTasks.length/total));
  }
  setPage(1)
} catch (error) {
  console.error('Error fetching tasks:', error);
}
}, [selectedTab,page, pages,totalRows,rowsPerPage, dispatch,searchInput,searchDate,column,operator,value,]);


useEffect(() => {
getTasks();
}, [getTasks]); 

 
  const handleTargets = React.useCallback(async (): Promise<void> => {
    try {
      const { res } = await targetApis.getTargets();
      dispatch(setTargets(res));
    } catch (error) {
      console.error('Error fetching targets:', error);
    }
  }, [dispatch]);

  const handleUsers = React.useCallback(async (): Promise<void> => {
    try {
      const { res } = await userApis.getUsers();

      //dispatch(setUsers(res));
      setUsers(res);
      console.log('useeeeeeeeee', users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }, [dispatch]);

  useEffect(() => {
    handleTargets();
    handleUsers();
  }, [handleTargets, handleUsers]);

  const handleFilterBySearch = (data) => {
    setSearch(data);
  };

  const onFilterByDate = (selectedDate) => {
    const selectedDateObj = new Date(selectedDate);
    const selectedDateObjFormat=dayjs(selectedDate).format('YYYY-MM-DD');
    console.log("onfilterbydate====>",selectedDateObjFormat)
    setSearchDate(selectedDateObjFormat);
        
        
      
    };
  const onFilterBySearch=(search)=>{ 
      console.log("onFilterBySearch=>",search)
      setSearchInput(search)
      setPage(1)
    }
const onFilterByFiltering=(selectedValue,operator,value)=>{
  console.log("searching equal page task==>",selectedValue,operator,value)
  setColumn(selectedValue);
    setOperator(operator);
    setValue(value)
  

}

    const handleChangePage = ( newPage ) => {
      console.log("handle change page",page)
      setPage(newPage); 
    };
  const handleClose = () => {
    setIsNewTask(false);
  };
  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h3">All Tasks</Typography>
          <Typography
            variant="body2"
            sx={{
              alignSelf: 'stretch',
              color: 'var(--Grey-grey-400, #88909F)',
              fontFeatureSettings: '"cv04" on, "cv03" on, "cv02" on, "cv11" on, "clig" off, "liga" off',
            }}
          >
            Below is a list of tasks in your carbon emission. Please review and ensure alignment with your
            sustainability objectives
          </Typography>

          <CustomTabs value={selectedTab} screen="tasks" handleChange={handleTabChange} />
        </Stack>
        <div>
          <Button
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            style={{
              borderRadius: '0.375rem',
              background: 'var(--Green-green-500, #16B364)',
            }}
            //onClick={()=>handleNewTask, setIsNewTask(!isNewTask)}
            onClick={() => {
              handleUsers(), handleTargets(), setIsNewTask(!isNewTask);
            }}
          >
            New Task
          </Button>
        </div>
      </Stack>

      <BottomDrawer
        open={isNewTask}
        handleCancelTask={handleClose}
        newTask={newTask}
        setNewTask={setNewTask}
        onCreateTask={handleCreateTask}
        users={users}
        targets={targets}
      />

      {/*  <TargetsTable     
        
       
        /> */}

      {selectedTab === 'All Tasks' && (
        <TasksTable
        onFilterBySearch={onFilterBySearch}
        onFilterByFiltering={onFilterByFiltering}
        onFilterByDate={onFilterByDate}
        handleChangePage={handleChangePage}
        pages={pages} 
          page={page}
          rows={tasks}  
          rowsPerPage={rowsPerPage} 
          selectedTab={'All Tasks'}
        />
      )}
      {selectedTab !== 'All Tasks' && (
        <MyTasksTable
        onFilterBySearch={onFilterBySearch}
        onFilterByFiltering={onFilterByFiltering}
        onFilterByDate={onFilterByDate}
        handleChangePage={handleChangePage}
        pages={pagesMyTask} 
          page={page}
          rows={rows}  
          rowsPerPage={rowsPerPage}  
          selectedTab={'My Tasks'}
        />
      )}
    </Stack>
  );
}

 
