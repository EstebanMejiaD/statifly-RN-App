import { sessionsService } from './sessions.service';
import { metricPointsService } from './metric-points.service';
import { CreateSessionDto } from '@/types/session';
import { BulkMetricPoint } from '@/types/metric-point';

export const sessionUploadService = {
  async upload(
    session: CreateSessionDto,
    metrics: BulkMetricPoint[],
  ) {
    const sessionResponse =
      await sessionsService.create(session);

    const createdSession = sessionResponse.data;

    await metricPointsService.bulk(
      createdSession.id,
      {
        metrics,
      },
    );

    return createdSession;
  },
};