'use client';

import * as React from 'react';
import { Box } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import type { Icon } from '@phosphor-icons/react/dist/lib/types';
import { Desktop as DesktopIcon } from '@phosphor-icons/react/dist/ssr/Desktop';
import { DeviceTablet as DeviceTabletIcon } from '@phosphor-icons/react/dist/ssr/DeviceTablet';
import { Phone as PhoneIcon } from '@phosphor-icons/react/dist/ssr/Phone';
import type { ApexOptions } from 'apexcharts';

import { Button } from '@/components/commun/Button';
import { Chart } from '@/components/core/chart';
import { palette } from '@/styles/theme/colors';

import TaskItem from './TaskItem';
import  { useEffect, useState } from 'react';
  
import { useDispatch, useSelector } from 'react-redux';
import { Task } from '@/types/task';
import { User } from '@/types/user';
import { setTargets } from '@/lib/store/reducer/useTarget';
import { setTasks } from '@/lib/store/reducer/useTask';
import { targetApis } from '@/lib/target/targetApis';
import { taskApis } from '@/lib/task/taskApis';
import { userApis } from '@/lib/user/userApis'; 
import BottomDrawer from '@/app/dashboard/tasks/BottomDrawer';
import { setOpenToast } from '@/lib/store/reducer/useGlobalActions';
 

const iconMapping = { Desktop: DesktopIcon, Tablet: DeviceTabletIcon, Phone: PhoneIcon } as Record<string, Icon>;

export interface TrafficProps {
  sx?: SxProps;
}

export function Tasks({ sx }: TrafficProps): React.JSX.Element { 
  const [users, setUsers] = useState<User>({});
  const [isNewTask, setIsNewTask] = useState(false);
  const { tasks } = useSelector((state: any) => state.task);
  const { targets } = useSelector((state: any) => state.target);
  const { user } = useSelector((state: any) => state.user);
   
  const [newTask, setNewTask] = useState<Task>({ ['createdBy']: user.id });
  
   
  const dispatch = useDispatch();
   

  const handleClose = () => {
    setIsNewTask(false);
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
  const handleTargets = React.useCallback(async (): Promise<void> => {
    try {
      const { res } = await targetApis.getTargets();
      dispatch(setTargets(res));
    } catch (error) {
      console.error('Error fetching targets:', error);
    }
  }, [dispatch]);

  const handleUsers = React.useCallback(async (): Promise<void> => {
    console.log("handleUsers")
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

  return (
    <Card sx={sx}>
      <CardHeader
        action={
          <Box display="flex" alignItems="flex-end">
            <Button btnType="link" sx={{ color: palette.primary[500], fontWeight: 700 }}
               onClick={() => {
                handleUsers(), handleTargets(), setIsNewTask(!isNewTask);
              }}
            >
              Add Task
            </Button>
          </Box>
        }
        title={
          <Typography variant="h6" component="div" fontWeight={700}>
            Tasks
          </Typography>
        }
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      />
        <BottomDrawer
        open={isNewTask}
        handleCancelTask={handleClose}
        newTask={newTask}
        setNewTask={setNewTask}
        onCreateTask={handleCreateTask}
        users={users}
        targets={targets}
      />
      <CardContent>
        <Stack spacing={2}>
          <TaskItem dueDate="18/02/2024" target="Reports - tagert01 task" />
          <TaskItem dueDate="18/02/2024" target="Reports - tagert01 task" />
          <TaskItem dueDate="18/02/2024" target="Reports - tagert01 task" />
          <TaskItem dueDate="18/02/2024" target="Reports - tagert01 task" />
          <TaskItem dueDate="18/02/2024" target="Reports - tagert01 task" />
        </Stack>
      </CardContent>
    </Card>
  );
}

function useChartOptions(labels: string[]): ApexOptions {
  const theme = useTheme();

  return {
    chart: { background: 'transparent' },
    colors: [theme.palette.primary.main, theme.palette.success.main, theme.palette.warning.main],
    dataLabels: { enabled: false },
    labels,
    legend: { show: false },
    plotOptions: { pie: { expandOnClick: false } },
    states: { active: { filter: { type: 'none' } }, hover: { filter: { type: 'none' } } },
    stroke: { width: 0 },
    theme: { mode: theme.palette.mode },
    tooltip: { fillSeriesColor: false },
  };
}
