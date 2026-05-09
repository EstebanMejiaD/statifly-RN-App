import { CompetitiveLevel, DominantFoot, Gender, User } from "@/types/auth";
import { api } from "../client";
import { endpoints } from "../endpoints";
import { ApiResponse, AuthResponse } from "@/types/api";
import { AxiosError } from "axios";

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  lastName: string;
  birthDate: string;

  gender: Gender;
  dominantFoot: DominantFoot;

  height: number;
  weight: number;

  competitiveLevel: CompetitiveLevel;

  email: string;
  phone: string;

  password: string;
}

export const authService = {
  async login(data: LoginDto): Promise<AuthResponse<User>> {
    try {
      const response = await api.post<AuthResponse<User>>(
        endpoints.auth.login,
        data,
      );

      return response.data;
    } catch (error: any) {
        if (error instanceof AxiosError) {
            console.log({Error: error.response?.data})
            throw new Error(error.response?.data?.message || 'Error desconocido');
        }
        console.log('Ocurrio un error: '+error.message)
      throw error;
    }
  },

  async register(data: RegisterDto): Promise<ApiResponse<User>> {
    try {
        const response = await api.post<ApiResponse<User>>(
      endpoints.auth.register,
      data,
    );

    return response.data;
    } catch (error:any) {
        if (error instanceof AxiosError) {
            console.log({Error: error.response?.data})
            throw new Error(error.response?.data?.message || 'Error desconocido');
        }
        console.log('Ocurrio un error: '+error.message)
      throw error;
    }
  },
};
