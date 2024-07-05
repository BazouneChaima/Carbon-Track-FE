'use client';

import axios from 'axios';


import api from '../api';

class NotificationApis {
  private notification = axios.create({
    baseURL: `${api}/notification`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-secret': process.env.NEXTAUTH_SECRET || '',
    },
  });

  async getAllNotif(): Promise<{ res?: object; error?: string }> {
    try {
      const response = await this.notification.get('/', { withCredentials: true });
      return { res: response.data };
    } catch (e:  any) {
      const error = e.response ? e.response.data.error : 'Connexion Error';
      return { error: error };
    }
  }

  async readAllNotif(ids: string[]): Promise<{ res?: object; error?: string }> {
    try {
      const response = await this.notification.put('/bulk/update',{notificationIds : ids} ,{ withCredentials: true });
      return { res: response.data };
    } catch (e:  any) {
      const error = e.response ? e.response.data.error : 'Connexion Error';
      return { error: error };
    }
  }
}

export const notificationApis = new NotificationApis();
