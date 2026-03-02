import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Octokit } from '@octokit/rest';

export interface PullRequestFile {
  filename: string;
  status: string;
  additions: number;
  deletions: number;
  patch?: string;
  content?: string;
}

export interface PullRequestData {
  title: string;
  description: string;
  author: string;
  repoName: string;
  files: PullRequestFile[];
}

@Injectable()
export class GithubService {
  private octokit: Octokit;

  constructor(private config: ConfigService) {
    this.octokit = new Octokit({
      auth: this.config.get<string>('GITHUB_TOKEN'),
    });
  }

  parsePrUrl(url: string): { owner: string; repo: string; pull_number: number } {
    const match = url.match(
      /github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/,
    );
    if (!match) throw new BadRequestException('Invalid GitHub PR URL');

    return {
      owner: match[1],
      repo: match[2],
      pull_number: parseInt(match[3]),
    };
  }

  async getPullRequestData(prUrl: string): Promise<PullRequestData> {
    const { owner, repo, pull_number } = this.parsePrUrl(prUrl);

    const [prResponse, filesResponse] = await Promise.all([
      this.octokit.pulls.get({ owner, repo, pull_number }),
      this.octokit.pulls.listFiles({ owner, repo, pull_number, per_page: 20 }),
    ]);

    const pr = prResponse.data;
    const files: PullRequestFile[] = filesResponse.data
      .filter((f) => this.isAnalyzableFile(f.filename))
      .map((f) => ({
        filename: f.filename,
        status: f.status,
        additions: f.additions,
        deletions: f.deletions,
        patch: f.patch,
      }));

    return {
      title: pr.title,
      description: pr.body ?? '',
      author: pr.user?.login ?? '',
      repoName: `${owner}/${repo}`,
      files,
    };
  }

  private isAnalyzableFile(filename: string): boolean {
    const analyzableExtensions = [
      '.ts', '.tsx', '.js', '.jsx',
      '.py', '.java', '.go', '.rb',
      '.php', '.cs', '.cpp', '.c',
    ];
    return analyzableExtensions.some((ext) => filename.endsWith(ext));
  }
}