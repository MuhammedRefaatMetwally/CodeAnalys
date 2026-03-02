import api from '../axios';

export interface AuthResponse {
  token: string;
  user: { id: string; name: string; email: string };
}

export const authApi = {
  register: async (data: { name: string; email: string; password: string }) => {
    const res = await api.post<AuthResponse>('/auth/register', data);
    return res.data;
  },
  login: async (data: { email: string; password: string }) => {
    const res = await api.post<AuthResponse>('/auth/login', data);
    return res.data;
  },
};