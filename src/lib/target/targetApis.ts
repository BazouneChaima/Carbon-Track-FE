'use client';

import axios from 'axios';

import { Target } from '@/types/target';
import type { User } from '@/types/user';

import api from '../api';

function generateToken(): string {
  const arr = new Uint8Array(12);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

// const user = {
//   id: 'USR-000',
//   avatar: '/assets/avatar.png',
//   firstName: 'Afaf',
//   lastName: 'KELAI',
//   email: 'afafkelly@gmail.com',
// } satisfies User;

export interface NewTargetParams {
  name?: string;
  type?: string;
  emissionReduction?: string;
  baseYear?: string;
}

class TargetApis {
  private apiTarget = axios.create({
    baseURL: `${api}/target/`,
    headers: {
      'Content-Type': 'application/json',
      'x-auth-secret': process.env.NEXTAUTH_SECRET || '',
    },
  });
  async createTarget(data: NewTargetParams): Promise<{res? :Target,  error?: string }> {
    // Make API request
    try {
      const response = await this.apiTarget.post('/', data , { withCredentials: true });

      return {res : {...response.data, id: response.data._id}}
    } catch (e) {
      return { error: 'backend error' };
    }

    // // We do not handle the API, so we'll just generate a token and store it in localStorage.
    // const token = generateToken();

    // localStorage.setItem('custom-auth-token', token);

    return {};
  }

  async getTargets(filters = {}): Promise<{ res?: any;total?:any,totalPages?:any, error?: string }> {
    // Make API request
    const queryString = new URLSearchParams(filters);
    console.log("queryStringqueryString gettargetq",queryString)
    try {
      const res = await this.apiTarget.get('/?' + queryString.toString(), { withCredentials: true });
      console.log("backend targets",res.data.total,res.data.totalPages,res.data.pageMin)
      const total = res.data.total || 1;  
      const totalPages=res.data.totalPages || 1;
      return {
        res: res.data.targets.map((e: any) => ({ ...e, id: e._id })), 
         total,
         totalPages
      }; } catch (e) {
      return { error: 'backend error'+e };
    }

    // // We do not handle the API, so we'll just generate a token and store it in localStorage.
    // const token = generateToken();

    // localStorage.setItem('custom-auth-token', token);

    return {};
  }

  async updateTarget(target: NewTargetParams): Promise<{ res?: any; error?: string }> {
    // Make API request
    try {
      const res = await this.apiTarget.put('/',target,{ withCredentials: true });

      return {  };
    } catch (e) {
      return { error: 'backend error' };
    }

    return {};
  }

  async deleteTarget(id: string): Promise<{ res?: any; error?: string }> {
    // Make API request
    try {
      const res = await this.apiTarget.delete('/' + id, { withCredentials: true });

      return {};
    } catch (e) {
      return { error: 'backend error' + e };
    }

    // // We do not handle the API, so we'll just generate a token and store it in localStorage.
    // const token = generateToken();

    // localStorage.setItem('custom-auth-token', token);

    return {};
  }
}

export const targetApis = new TargetApis();
