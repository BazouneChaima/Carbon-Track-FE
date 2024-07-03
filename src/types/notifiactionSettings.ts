export interface NotificationSettings {
  id?: string;
  _id?: string;
  email_notification?: boolean;
  push_notification?: boolean;
  target_progress?: boolean;
  reduction_tips?: boolean;
  high_emission_activity?: boolean;
  reach_target?: boolean;
  sms_notification?: boolean;
  push_rem?:boolean;
  email_rem?:boolean;
  user?: string;
  created_at?: Date;
  updated_at?: Date;
}
