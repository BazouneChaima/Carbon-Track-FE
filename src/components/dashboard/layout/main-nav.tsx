'use client';

import * as React from 'react';
import { redirect } from 'next/navigation';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputBase from '@mui/material/InputBase';
import Stack from '@mui/material/Stack';
import { paths } from '@/paths';
import Tooltip from '@mui/material/Tooltip';
import { Bell as BellIcon } from '@phosphor-icons/react/dist/ssr/Bell';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import io from 'socket.io-client';
import { Button, Modal,Typography } from '@mui/material';
import { setCloseToast, setOpenToast } from '@/lib/store/reducer/useGlobalActions';
import { addNotification, setNotification } from '@/lib/store/reducer/useNotification';
import { userApis } from '@/lib/user/userApis';
import { usePopover } from '@/hooks/use-popover';
import ThemeToggle from '@/components/commun/ThemeToggle/ThemeToggle';
import Toast from '@/components/commun/Toast/Toast';
import { palette } from '@/styles/theme/colors';


import { setTarget } from '@/lib/store/reducer/useTarget';

import { setTask } from '@/lib/store/reducer/useTask';
import { MobileNav } from './mobile-nav';
import { NotificationPopover } from './notification-popover';
import { UserPopover } from './user-popover';
import { useDispatch, useSelector } from 'react-redux';
import {searchApis} from '@/lib/searching/searching'; 

import {  useRouter } from 'next/navigation';
import { taskApis } from '@/lib/task/taskApis';


//i will add it in const file
const socket = io('http://localhost:5000');

export function MainNav(): React.JSX.Element {
  const router = useRouter();
  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const [searchValue, setSearchValue] = React.useState<string>(''); // State for search value
  const [isSearching,setIsSearching]=React.useState('false');
  const userPopover = usePopover<HTMLDivElement>();
  const notificationPopover = usePopover<HTMLDivElement>();
  const { isOpenToast, message, type } = useSelector((state: any) => state.globalActions);
  const { user } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const { notifications } = useSelector((state: any) => state.notification);
  const hasSentStatus = notifications.some((item) => item.status === 'SENT');
  const getImage = React.useCallback(
    async (type: string): Promise<void> => {
      console.log('here upload');
      const { res, error } = await userApis.getImage(user._id, type);

      const blob = new Blob([res.data], { type: 'image/jpeg' });
      console.log({ blob });
      const imageUrl = URL.createObjectURL(blob);
      setProfileImage(imageUrl);
      if (error) {
        // dispatch(setOpenToast({message : error, type:'error'}))
        return;
      }
      // dispatch(setOpenToast({message : 'Data Added Successfully', type:'success'}))
      // onClose();
    },
    [user]
  );

  React.useEffect(() => {
    getImage('PROFILE');
  }, [user]);

  React.useEffect(() => {
    socket.on('notification', (data) => {
      // dispatch(setOpenToast({message : data.message, type:'warning'}))
      dispatch(addNotification(data.notification))
      // toast(data.message);/
    });

    return () => {
      socket.off('notification');
    };
  }, []);
  const [openModal, setOpenModal] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [profileImage, setProfileImage] = React.useState(null);
  const [searchResultsTaregts, setSearchResultsTaregt] = React.useState<any[]>([]);

  const [searchResultsData, setSearchResultsData] = React.useState<any[]>([]);
  const handleCloseModal = () => setOpenModal(false);

  const handleResultClick = (result: any) => {
    // Handle click on a search result (replace with your logic)
    console.log("Clicked result:", Object.keys(result));
    // You can close the modal or navigate to a specific page based on the result
    setOpenModal(false);
  };

  const handleResultClickTargets = (result: any) => {
    // Handle click on a search result (replace with your logic)
    console.log("Clicked result:", Object.keys(result));
    // You can close the modal or navigate to a specific page based on the result
    setOpenModal(false);
  };

  const handleResultClickData = (result: any) => { 
    console.log("Clicked result:", Object.keys(result)); 
    setOpenModal(false);
  };
  const handleSearch = React.useCallback(async () => {
    try {
      // Access user input from event object
      const searchTerm = event.target.value;
      const filters = {
        query: searchTerm,
      };
      setSearchValue(searchTerm); // Update state with search term
      setIsSearching(true);

      const { res, error } = await searchApis.getResults(filters);
      console.log("searchin",res)
      if (error) { 
        setIsSearching(false);
        return;
      }

      // Handle successful search results
      setSearchResults(res.tasks);
      setSearchResultsTaregt(res.targets);
      setSearchResultsData(res.data);
      console.log("resuu handle search==>",Object.keys(res),res.tasks,res.target)
      setIsSearching(false);
      setOpenModal(true); // Open modal to display results
    } catch (error) {
      console.error("Error searching:", error);
     // dispatch(setOpenToast({ message: 'Search failed!', type: 'error' }));
      setIsSearching(false);
    }
  }, []);
  
  const handleNavigateToTask = async(result) => {
    setIsSearching(true); //  
    const filters = {
      dueDate:'',
      //page,  
       //limit: rowsPerPage,   
      search:result.taskName,
      column:'',
      operator:'',
      value:'',
    };
 
    
    router.push('/dashboard/tasks')
  
  };

  const handleNavigateToTarget= (result) => {
    setIsSearching(true); // 
   

    dispatch(setTarget(result));
    router.push('/dashboard/target/details');
    // Replace with your actual task path
  };


  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid var(--mui-palette-divider)',
          backgroundColor: 'var(--mui-palette-background-paper)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--mui-zIndex-appBar)',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', px: 2 }}
        >
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <IconButton onClick={() => setOpenNav(true)} sx={{ display: { lg: 'none' } }}>
              <ListIcon />
            </IconButton>

            {/* Search Input with Magnifying Glass Icon on the left */}
            <InputBase
              placeholder="Search for anything..."
              value={searchValue}
              onChange={handleSearch}
              sx={{
                padding: '12px 16px',
                border: 'none',
                backgroundColor: palette.gray[25],

                borderRadius: '6px',
                flex: 1,
              }}
              startAdornment={
                <InputAdornment position="start">
                  <MagnifyingGlassIcon />
                </InputAdornment>
              }
            />
          </Stack>
          {openModal && (
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, bgcolor: 'background.paper', boxShadow: 24, p: 4 }}>
            <h2 id="modal-title-text">Search Results</h2>
            {/* Wrap results with custom CSS for scrolling */}
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              <Stack direction="column" spacing={2}>
                {searchResults?.map((result) => (
                  <Stack key={result.id} direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  <Typography variant="body2">{result.taskName || result.title || result.text}</Typography>
                  <Box sx={{ flexGrow: 1 }} /> {/* Spacer for right alignment */}
                  <Button   variant="outlined" onClick={()=>handleNavigateToTask(result)} sx={{ justifyContent: 'flex-end' }}>
                    Navigate
                  </Button>
                </Stack>
                ))}
                {searchResultsTaregts?.map((result) => (
                   

                   <Stack key={result.id} direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                   <Typography variant="body2">{result.name || result.title || result.text}</Typography>
                   <Box sx={{ flexGrow: 1 }} /> {/* Spacer for right alignment */}
                    <Button  variant="outlined" onClick={()=>handleNavigateToTarget(result)} sx={{ justifyContent: 'flex-end' }}>
                      Navigate
                     </Button>
                 
                 </Stack>

                ))}
                {searchResultsData?.map((result) => (
                  <Button sx={{ left:"50%"}}  key={result.id} variant="contained" onClick={() => handleResultClick(result)}>
                    {result.name || result.title || result.text}
                  </Button>
                ))}
              </Stack>
            </div>
          </Box>
        </Modal>
      )}
      
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <Tooltip title="Contacts">
              <ThemeToggle />
            </Tooltip>
            {/*  <Tooltip title="Contacts">
              <IconButton>
                <UsersIcon />
              </IconButton>
            </Tooltip> */}
            <Tooltip title="Notifications" onClick={notificationPopover.handleOpen} ref={notificationPopover.anchorRef}>
              {hasSentStatus ? (
                <Badge badgeContent={4} color="success" variant="dot">
                  <IconButton>
                    <BellIcon />
                  </IconButton>
                </Badge>
              ) : (
              
                  <IconButton>
                    <BellIcon />
                  </IconButton>
              )}
            </Tooltip>
            <Avatar
              onClick={userPopover.handleOpen}
              ref={userPopover.anchorRef}
              src={profileImage || '/assets/avatar.png'}
              sx={{ cursor: 'pointer' }}
            />
          </Stack>
        </Stack>
      </Box>
      <NotificationPopover
        anchorEl={notificationPopover.anchorRef.current}
        onClose={notificationPopover.handleClose}
        open={notificationPopover.open}
      />
      <UserPopover anchorEl={userPopover.anchorRef.current} onClose={userPopover.handleClose} open={userPopover.open} />
      <MobileNav onClose={() => setOpenNav(false)} open={openNav} />
      <Toast message={message} open={isOpenToast} type={type} handleClose={() => dispatch(setCloseToast())} />
    </React.Fragment>
  );
}
