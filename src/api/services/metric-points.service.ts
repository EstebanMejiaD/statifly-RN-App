import { MetricPoint } from '@/types';
import { api } from '../client';
import { endpoints } from '../endpoints';
import { ApiResponse } from '@/types/api';
import { BulkMetricPointsDto, CreateMetricPointDto } from '@/types/metric-point';


export interface MetricPointFilters {
  sessionId?: string;
}

export const metricPointsService = {
  async getAll(
    params?: MetricPointFilters,
  ): Promise<ApiResponse<MetricPoint[]>> {
    const response = await api.get<ApiResponse<MetricPoint[]>>(
      endpoints.metricPoints.all,
      {
        params,
      },
    );

    return response.data;
  },

  async getById(
    id: string,
  ): Promise<ApiResponse<MetricPoint>> {
    const response = await api.get<ApiResponse<MetricPoint>>(
      endpoints.metricPoints.byId(id),
    );

    return response.data;
  },

  async create(
    data: CreateMetricPointDto,
  ): Promise<ApiResponse<MetricPoint>> {
    const response = await api.post<ApiResponse<MetricPoint>>(
      endpoints.metricPoints.all,
      data,
    );

    return response.data;
  },

  async bulk(
    sessionId: string,
    data: BulkMetricPointsDto,
  ): Promise<ApiResponse<MetricPoint[]>> {
    const response = await api.post<ApiResponse<MetricPoint[]>>(
      endpoints.metricPoints.bulk(sessionId),
      data,
    );

    return response.data;
  },

  async update(
    id: string,
    data: Partial<CreateMetricPointDto>,
  ): Promise<ApiResponse<MetricPoint>> {
    const response = await api.patch<ApiResponse<MetricPoint>>(
      endpoints.metricPoints.byId(id),
      data,
    );

    return response.data;
  },

  async remove(
    id: string,
  ): Promise<ApiResponse<MetricPoint>> {
    const response = await api.delete<ApiResponse<MetricPoint>>(
      endpoints.metricPoints.byId(id),
    );

    return response.data;
  },
};