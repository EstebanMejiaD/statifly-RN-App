import type { CreateSportDto, Sport, UpdateSportDto } from '@/types/sport';
import { api } from '../client';
import { endpoints } from '../endpoints';

import type { ApiResponse } from '@/types/api';


export const sportsService = {
  async getAll(): Promise<ApiResponse<Sport[]>> {
    const response = await api.get<ApiResponse<Sport[]>>(
      endpoints.sports.all,
    );

    return response.data;
  },

  async getById(id: string): Promise<ApiResponse<Sport>> {
    const response = await api.get<ApiResponse<Sport>>(
      endpoints.sports.byId(id),
    );

    return response.data;
  },

  async create(
    data: CreateSportDto,
  ): Promise<ApiResponse<Sport>> {
    const response = await api.post<ApiResponse<Sport>>(
      endpoints.sports.all,
      data,
    );

    return response.data;
  },

  async update(
    id: string,
    data: UpdateSportDto,
  ): Promise<ApiResponse<Sport>> {
    const response = await api.patch<ApiResponse<Sport>>(
      endpoints.sports.byId(id),
      data,
    );

    return response.data;
  },

  async remove(id: string): Promise<ApiResponse<Sport>> {
    const response = await api.delete<ApiResponse<Sport>>(
      endpoints.sports.byId(id),
    );

    return response.data;
  },
};