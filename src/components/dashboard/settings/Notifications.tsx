'use client';

import { useState } from 'react';
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { useDispatch, useSelector } from 'react-redux';

import { NotificationSettings } from '@/types/notifiactionSettings';
import { notificationSettingsApis } from '@/lib/notification-settings/notificationSettingsApis';
import { setOpenToast } from '@/lib/store/reducer/useGlobalActions';
import { setNotificationSettings } from '@/lib/store/reducer/useNotificationSettings';
import { Button } from '@/components/commun/Button';

export function Notifications(): React.JSX.Element {
  const { notificationSettings } = useSelector((state: any) => state.notificationSettings);
  const { user } = useSelector((state: any) => state.user);
  const dispatch = useDispatch();
  const [data, setData] = useState<NotificationSettings>(null);
  console.log('');
  const handleSave = async () => {
    const { res, error } = notificationSettings
      ? await notificationSettingsApis.updateNotifSetttings(data)
      : notificationSettingsApis.createNotifSetttings(data);

    if (error) {
      dispatch(setOpenToast({ message: error, type: 'error' }));
    } else {
      dispatch(setOpenToast({ message: 'Notification saved succefully', type: 'success' }));
      dispatch(setNotificationSettings(res));
    }
  };

  const handleChange = (name: string, value: boolean) => {
    setData({ ...data, [name]: value });
  };

  const getNotifSettings = async () => {
    const { res, error } = await notificationSettingsApis.getOneByUserNotifSetttings();
    if (!error) {
      console.log({ res });
      setData(res);
      dispatch(setNotificationSettings(res));
    }
  };

  React.useEffect(() => {
    getNotifSettings();
  }, [user]);
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <Card>
        <CardHeader
          subheader="We may still send you important notifications about your account outside of your notification settings."
          title="Notification settings"
          action={<Button onClick={handleSave}>Save</Button>}
        />
        <Divider />
        <CardContent>
          <Grid container spacing={6} wrap="wrap" direction="column">
            <Grid item xs={12}>
              <Stack spacing={1} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                <Typography variant="BodyB2" color="var(--Grey-grey-800, #3D434C)" sx={{ alignSelf: 'flex-start' }}>
                  General Notifications:
                </Typography>
                <FormGroup sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        color="success"
                        variant="solid"
                        checked={data?.email_notification}
                        onChange={(e) => handleChange('email_notification', e.target.checked)}
                      />
                    }
                    label="Email Notifications"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        color="success"
                        variant="solid"
                        checked={data?.push_notification}
                        onChange={(e) => handleChange('push_notification', e.target.checked)}
                      />
                    }
                    label="Notifications Push"
                  />
                </FormGroup>
              </Stack>
            </Grid>
            <Divider />

            <Grid item xs={12}>
              <Stack spacing={1} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                <Typography variant="BodyB2" color="var(--Grey-grey-800, #3D434C)" sx={{ alignSelf: 'flex-start' }}>
                  Alert Settings :
                </Typography>
                <FormGroup sx={{ height: '20px', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                  <FormControlLabel
                    control={
                      <Switch
                        color="success"
                        variant="solid"
                        checked={data?.target_progress}
                        onChange={(e) => handleChange('target_progress', e.target.checked)}
                      />
                    }
                    label="Targets Progress"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        color="success"
                        variant="solid"
                        checked={data?.reduction_tips}
                        onChange={(e) => handleChange('reduction_tips', e.target.checked)}
                      />
                    }
                    label="Reduction Tips"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        color="success"
                        variant="solid"
                        checked={data?.high_emission_activity}
                        onChange={(e) => handleChange('high_emission_activity', e.target.checked)}
                      />
                    }
                    label="High Emission Activities"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        color="success"
                        variant="solid"
                        checked={data?.reach_target}
                        onChange={(e) => handleChange('reach_target', e.target.checked)}
                      />
                    }
                    label="Reach the target"
                  />
                </FormGroup>
              </Stack>
            </Grid>
          </Grid>
          <Divider />
          <Grid item xs={12}>
            <Stack spacing={1} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
              <Typography variant="BodyB2" color="var(--Grey-grey-800, #3D434C)" sx={{ alignSelf: 'flex-start' }}>
                Reminders
              </Typography>
              <Typography variant="BodyP3" color="var(--Grey-grey-800, #88909F)" sx={{ alignSelf: 'flex-start' }}>
                {' '}
                These are notifications to remind you of updates you might have missed.
              </Typography>

              <FormGroup sx={{ gap: '8px', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                <FormControlLabel
                  control={
                    <Switch
                      color="success"
                      variant="solid"
                      checked={data?.push_rem}
                      onChange={(e) => handleChange('push_rem', e.target.checked)}
                    />
                  }
                  label="Push"
                />
                <FormControlLabel
                  control={
                    <Switch
                      color="success"
                      variant="solid"
                      checked={data?.email_rem}
                      onChange={(e) => handleChange('email_rem', e.target.checked)}
                    />
                  }
                  label="Email"
                />
                <FormControlLabel
                  control={
                    <Switch
                      color="success"
                      variant="solid"
                      checked={data?.sms_notification}
                      onChange={(e) => handleChange('sms_notification', e.target.checked)}
                    />
                  }
                  label="SMS"
                />
              </FormGroup>
            </Stack>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
}
