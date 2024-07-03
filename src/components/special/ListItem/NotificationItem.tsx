import React from 'react';
import { Avatar, Divider, Grid, Stack } from '@mui/material';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/system';

import { palette } from '@/styles/theme/colors';

interface NotificationProps {
  notification: object;
}

const NotificationItem: React.FC<NotificationProps> = ({ notification }) => {
  const styledContainer = {
    borderRadius: 1,
    padding: 2,
    borderBottom: 'solid',
    backgroudColor: notification.status === 'SENT' ? palette.primary[50] : '',
    borderBottom: 1,
    borderColor: palette.gray[100],
  };
  return (
    <Grid
      container
      direction={'row'}
      bgcolor={notification.status === 'SENT' ? palette.primary[50] : ''}
      sx={styledContainer}
    >
      <Grid lg={2} sm={2} xs={2} sx={{ alignContent: 'center' }}>
        <Avatar alt="Text" />
      </Grid>
      <Grid lg={10} sm={10} xs={10}>
        <Stack direction={'row'} alignItems={'center'} spacing={0.2}>
          <Typography sx={{ fontWeight: 'bold' }}>
            {notification.user?.username}{' '}
          </Typography>
          <Typography  color="text.secondary">
              {' '}{notification.message}
            </Typography>
        </Stack>
        <Stack width="100%" direction="row" spacing={5}>
          <Box width="100%" sx={{ alignContent: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {notification.message}
            </Typography>
          </Box>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default NotificationItem;
