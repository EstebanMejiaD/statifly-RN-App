import type {
  CreateSessionDto,
  Session,
  UpdateSessionDto,
} from "@/types/session";
import { api } from "../client";
import { endpoints } from "../endpoints";

import type { ApiResponse } from "@/types/api";
import { getApiErrorMessage } from "../api-error";

export interface SessionFilters {
  userId: string;
  sportId: string;
}

export const sessionsService = {
  async getAll(filters: SessionFilters): Promise<ApiResponse<Session[]>> {
    try {
      const response = await api.get<ApiResponse<Session[]>>(
        endpoints.sessions.all,
        {
          params: filters,
        },
      );

      return response.data;
    } catch (error: any) {
      console.log("Ocurrio un error: " + error.message);
      throw new Error(getApiErrorMessage(error));
    }
  },

  async getById(id: string): Promise<ApiResponse<Session>> {
    const response = await api.get<ApiResponse<Session>>(
      endpoints.sessions.byId(id),
    );

    return response.data;
  },

  async create(data: CreateSessionDto): Promise<ApiResponse<Session>> {
    const response = await api.post<ApiResponse<Session>>(
      endpoints.sessions.all,
      data,
    );

    return response.data;
  },

  async update(
    id: string,
    data: UpdateSessionDto,
  ): Promise<ApiResponse<Session>> {
    const response = await api.patch<ApiResponse<Session>>(
      endpoints.sessions.byId(id),
      data,
    );

    return response.data;
  },

  async remove(id: string): Promise<ApiResponse<Session>> {
    const response = await api.delete<ApiResponse<Session>>(
      endpoints.sessions.byId(id),
    );

    return response.data;
  },
};
