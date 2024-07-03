'use client';

import axios from 'axios';

import { NotificationSettings } from '@/types/notifiactionSettings';

import api from '../api';

class NotificationSettingsApis {
  private notificationSettings = axios.create({
    baseURL: `${api}/notification-settings`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-secret': process.env.NEXTAUTH_SECRET || '',
    },
  });

  async createNotifSetttings(notifSettings: NotificationSettings): Promise<{ res?: any; error?: string }> {
    // Make API request
    try {
      const response = await this.notificationSettings.post('/', notifSettings, { withCredentials: true });

      return { res: { ...response.data, id: response.data._id } };
    } catch (e : any) {
      const error = e.response ? e.response.data.error : 'Connexion Error';
      return { error: error };
    }
  }
  async getAllNotifSetttings(): Promise<{ res?: object; error?: string }> {
    try {
      const response = await this.notificationSettings.get('/', { withCredentials: true });
      return { res: response.data };
    } catch (e: any) {
      const error = e.response ? e.response.data.error : 'Connexion Error';
      return { error: error };
    }
  }

  async getOneNotifSetttings(id : string): Promise<{ res?: any; error?: string }> {
    // Make API request
    try {
      const res = await this.notificationSettings.get('/'+id, { withCredentials: true });

      return { res: res.data };
    } catch (e : any) {
      const error = e.response ? e.response.data.error : 'Connexion Error';
      return { error: error };
    }
  }

  async getOneByUserNotifSetttings(): Promise<{ res?: any; error?: string }> {
    // Make API request
    try {
      const res = await this.notificationSettings.get('/user', { withCredentials: true });

      return { res: res.data[0]};
    } catch (e : any) {
      const error = e.response ? e.response.data.error : 'Connexion Error';
      return { error: error };
    }
  }

  /*  */

  async updateNotifSetttings(notifSettings: NotificationSettings): Promise<{ res?: any; error?: string }> {
    // Make API request
    try {
      const res = await this.notificationSettings.put('/'+notifSettings._id, notifSettings, { withCredentials: true });

      return {res};
    } catch (e : any) {
      const error = e.response ? e.response.data.error : 'Connexion Error';
      return { error: error };
    }
  }

  async deleteNotifSetttings(id: string): Promise<{ res?: any; error?: string }> {
    try {
      const res = await this.notificationSettings.delete(`/${id}`, {
        withCredentials: true,
      });

      return { res };
    } catch (e : any) {
      const error = e.response ? e.response.data.error : 'Connexion Error';
      return { error: error };
    }
  }
}

export const notificationSettingsApis = new NotificationSettingsApis();
