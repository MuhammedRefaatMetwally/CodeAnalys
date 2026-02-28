import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GithubService } from '../github/github.service';
import { GeminiService } from './gemini.service';
import { QueueService } from './queue.service';
import { CreateAnalysisDto } from './dto/create-analysis.dto';

@Injectable()
export class AnalysisService {
  constructor(
    private prisma: PrismaService,
    private githubService: GithubService,
    private geminiService: GeminiService,
    private queueService: QueueService,
  ) {}

  async createAnalysis(userId: string, dto: CreateAnalysisDto) {
    const { repo } = this.githubService.parsePrUrl(dto.prUrl);

    const analysis = await this.prisma.analysis.create({
      data: {
        userId,
        prUrl: dto.prUrl,
        repoName: repo ?? dto.prUrl,
        status: 'PENDING',
      },
    });

    await this.queueService.addAnalysisJob(analysis.id);
    return analysis;
  }

  async processAnalysis(analysisId: string) {
    await this.prisma.analysis.update({
      where: { id: analysisId },
      data: { status: 'PROCESSING' },
    });

    try {
      const analysis = await this.prisma.analysis.findUnique({
        where: { id: analysisId },
      });
      if (!analysis) throw new NotFoundException('Analysis not found');

      const prData = await this.githubService.getPullRequestData(analysis.prUrl);
      const result = await this.geminiService.analyzeCode(prData.title, prData.files);

      await this.prisma.analysis.update({
        where: { id: analysisId },
        data: {
          status: 'COMPLETED',
          result: result as any,
          overallScore: result.overallScore,
        },
      });
    } catch (error) {
      await this.prisma.analysis.update({
        where: { id: analysisId },
        data: { status: 'FAILED' },
      });
      throw error;
    }
  }

  async getUserAnalyses(userId: string) {
    return this.prisma.analysis.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAnalysisById(id: string, userId: string) {
    const analysis = await this.prisma.analysis.findFirst({
      where: { id, userId },
    });
    if (!analysis) throw new NotFoundException('Analysis not found');
    return analysis;
  }
}