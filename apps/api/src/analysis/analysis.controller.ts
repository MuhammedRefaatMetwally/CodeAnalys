import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { CreateAnalysisDto } from './dto/create-analysis.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@UseGuards(JwtGuard)
@Controller('analysis')
export class AnalysisController {
  constructor(private analysisService: AnalysisService) {}

  @Post()
  create(@Body() dto: CreateAnalysisDto, @GetUser('id') userId: string) {
    return this.analysisService.createAnalysis(userId, dto);
  }

  @Get()
  findAll(@GetUser('id') userId: string) {
    return this.analysisService.getUserAnalyses(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.analysisService.getAnalysisById(id, userId);
  }
}