import * as React from 'react';
import { Card, CardContent, CardHeader, Stack } from '@mui/material';
import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import { useDispatch, useSelector } from 'react-redux';

import { notificationApis } from '@/lib/notification/notificationApis';
import { setNotification, setReadAllNotification } from '@/lib/store/reducer/useNotification';
import { Button } from '@/components/commun/Button';
import NotificationItem from '@/components/special/ListItem/NotificationItem';
import { palette } from '@/styles/theme/colors';

export interface UserPopoverProps {
  anchorEl: Element | null;
  onClose: () => void;
  open: boolean;
}

export function NotificationPopover({ anchorEl, onClose, open }: UserPopoverProps): React.JSX.Element {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state: any) => state.notification);

  const getAllNotif = React.useCallback(async (): Promise<void> => {
    try {
      const { res, error } = await notificationApis.getAllNotif();
      if (error) {
        return;
      }
      dispatch(setNotification(res));
    } catch (err) {}
  }, []);

  const readAllNotif = React.useCallback(async (): Promise<void> => {
    try {
      console.log('notification data jere ' + JSON.stringify(notifications))
      const ids = notifications.map(item => item._id);
      const { res, error } = await notificationApis.readAllNotif(ids);
      if (error) {
        return;
      }
      dispatch(setReadAllNotification());
    } catch (err) {}
  }, [notifications]);


  React.useEffect(() => {
    getAllNotif();
  }, []);
  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { width: '428px' } } }}
    >
      <Card>
        <CardHeader
          action={
            <Box display="flex" alignItems="flex-end">
              <Button btnType="link" sx={{ color: palette.primary[500], fontWeight: 700 }} onClick={readAllNotif}>
                Mark all as read
              </Button>
            </Box>
          }
          title={
            <Typography variant="h6" component="div" fontWeight={700}>
              Notifications
            </Typography>
          }
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        />
        <CardContent>
          <Stack spacing={2}>
            {notifications &&
              notifications.slice(0, 5).map((notification: any) => <NotificationItem notification={notification} />)}
            {/* <Divider /> */}
          </Stack>
        </CardContent>
      </Card>
    </Popover>
  );
}
