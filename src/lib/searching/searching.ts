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

class SearchApis {
  private apiSearch = axios.create({
    baseURL: `${api}/search/`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-secret': process.env.NEXTAUTH_SECRET || '',
    },
  });
 

  async getResults(filters:{}): Promise<{ res?: any; error?: string }> {
    // Make API request 
    const queryString = new URLSearchParams(filters);
    console.log("queryStringqueryString gettargetq",queryString)
    try {
      const res = await this.apiSearch.get('/?' + queryString.toString(), { withCredentials: true });
      console.log("backend targets",Object.keys(res.data),res.data.tasks)
     
      const results = {
        targets: res.data.targets || [],  
        tasks: res.data.tasks.map((e: any) => ({ ...e, id: e._id }))  || [],
        data: res.data.data || [], // Use default empty array if 'data' is not present
      };
  
      return {
        res: results, 
        
      }
      
      ; } catch (e) {
      return { error: 'backend error'+e };
    }

    // // We do not handle the API, so we'll just generate a token and store it in localStorage.
    // const token = generateToken();

    // localStorage.setItem('custom-auth-token', token);

    return {};
  }
 
}

export const searchApis = new SearchApis();
