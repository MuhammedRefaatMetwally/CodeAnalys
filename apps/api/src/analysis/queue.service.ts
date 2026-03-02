import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  forwardRef,
  Inject,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue, Worker, Job } from 'bullmq';
import { AnalysisService } from './analysis.service';

export const ANALYSIS_QUEUE = 'analysis-queue';

@Injectable()
export class QueueService implements OnModuleInit, OnModuleDestroy {
  private queue: Queue;
  private worker: Worker;

  constructor(
    private config: ConfigService,
    @Inject(forwardRef(() => AnalysisService))
    private analysisService: AnalysisService,
  ) {}

  onModuleInit() {
    const connection = {
      host: 'localhost',
      port: 6379,
    };

    this.queue = new Queue(ANALYSIS_QUEUE, { connection });

    this.worker = new Worker(
      ANALYSIS_QUEUE,
      async (job: Job) => {
        await this.analysisService.processAnalysis(job.data.analysisId);
      },
      { connection },
    );

    this.worker.on('completed', (job) => {
      Logger.log(
        `✅ Job ${job.id} completed — analysisId: ${job.data.analysisId}`,
        'QueueWorker',
      );
    });

    this.worker.on('failed', (job, err) => {
      Logger.error(`❌ Job ${job?.id} failed — ${err.message}`, 'QueueWorker');
    });

    this.worker.on('active', (job) => {
      Logger.log(
        `⚙️  Job ${job.id} started — analysisId: ${job.data.analysisId}`,
        'QueueWorker',
      );
    });
  }

  async addAnalysisJob(analysisId: string) {
    await this.queue.add('process-analysis', { analysisId });
  }

  async onModuleDestroy() {
    await this.worker.close();
    await this.queue.close();
  }
}
