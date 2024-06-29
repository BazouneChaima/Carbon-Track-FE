'use client';

import axios from 'axios';

import { Target } from '@/types/target';
import type { User } from '@/types/user';

import api from '../api';

 

export interface NewTargetParams {
  name?: string;
  type?: string;
  emissionReduction?: string;
  baseYear?: string;
}

class EmissionApis {
  private apiEmission = axios.create({
    baseURL: `${api}/emission/`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-secret': process.env.NEXTAUTH_SECRET || '',
    },
  });
 /* async getTasks(filters = {}): Promise<{ res?: any; error?: string }> {
  // Build the query string based on filters object
  const queryString = new URLSearchParams(filters);
  console.log("querystring",queryString);

  // Make API request with optional filters
  try {
    const res = await this.apiTask.get('/?' + queryString.toString(), { withCredentials: true });
 */

  async getEmissions(filters = {}): Promise<{ res?: any;total?:any,totalPages?:any, error?: string }> {
    // Make API request
    const queryString = new URLSearchParams(filters); 
    try {
      const res = await this.apiEmission.get('/?' + queryString.toString(), { withCredentials: true });
    
      console.log("backend res===>",res.data.emissions)
      const total = res.data.total || 1; // Handle potential missing total property
      const totalPages=res.data.totalPages || 1;
      return {
        res: res.data.emissions.map((e: any) => ({ ...e, id: e._id })), 
         total,
         totalPages
      };
      
    } catch (e) {
      return { error: 'backend error' };
    } 

    return {};
  }

}
 

export const emissionApis = new EmissionApis();
