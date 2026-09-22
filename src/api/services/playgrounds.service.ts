import { CreatePlaygroundDto, Playground, UpdatePlaygroundDto } from '@/types/playground';
import { api } from '../client';
import { endpoints } from '../endpoints';
import { ApiResponse } from '@/types/api';



export interface PlaygroundFilters {
  userId?: string;
  sportId?: string;
}

export const playgroundsService = {
  async getAll(
    params?: PlaygroundFilters,
  ): Promise<ApiResponse<Playground[]>> {
    const response = await api.get<ApiResponse<Playground[]>>(
      endpoints.playgrounds.all,
      {
        params,
      },
    );

    return response.data;
  },

  async getById(
    id: string,
  ): Promise<ApiResponse<Playground>> {
    const response = await api.get<ApiResponse<Playground>>(
      endpoints.playgrounds.byId(id),
    );

    return response.data;
  },

  async create(
    data: CreatePlaygroundDto,
  ): Promise<ApiResponse<Playground>> {
    const response = await api.post<ApiResponse<Playground>>(
      endpoints.playgrounds.all,
      data,
    );

    return response.data;
  },

  async update(
    id: string,
    data: UpdatePlaygroundDto,
  ): Promise<ApiResponse<Playground>> {
    const response = await api.patch<ApiResponse<Playground>>(
      endpoints.playgrounds.byId(id),
      data,
    );

    return response.data;
  },

  async remove(
    id: string,
  ): Promise<ApiResponse<Playground>> {
    const response = await api.delete<ApiResponse<Playground>>(
      endpoints.playgrounds.byId(id),
    );

    return response.data;
  },
};