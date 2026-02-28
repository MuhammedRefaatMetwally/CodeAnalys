import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { GithubService } from './github.service';
import { AnalyzePrDto } from './dto/analyze-pr.dto';
import { JwtGuard } from '../auth/jwt.guard';

@UseGuards(JwtGuard)
@Controller('github')
export class GithubController {
  constructor(private githubService: GithubService) {}

  @Post('pr-data')
  async getPrData(@Body() dto: AnalyzePrDto) {
    return this.githubService.getPullRequestData(dto.prUrl);
  }
}