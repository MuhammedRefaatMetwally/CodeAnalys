import { Module, forwardRef } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { AnalysisController } from './analysis.controller';
import { GeminiService } from './gemini.service';
import { QueueService } from './queue.service';
import { GithubModule } from '../github/github.module';

@Module({
  imports: [GithubModule],
  providers: [
    {
      provide: AnalysisService,
      useClass: AnalysisService,
    },
    GeminiService,
    QueueService,
  ],
  controllers: [AnalysisController],
})
export class AnalysisModule {}