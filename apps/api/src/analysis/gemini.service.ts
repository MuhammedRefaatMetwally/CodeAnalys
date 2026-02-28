import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PullRequestFile } from '../github/github.service';

export interface FileAnalysis {
  filename: string;
  issues: {
    severity: 'critical' | 'warning' | 'suggestion';
    message: string;
    line?: number;
  }[];
  summary: string;
}

export interface AnalysisResult {
  overallScore: number;
  summary: string;
  files: FileAnalysis[];
}

@Injectable()
export class GeminiService {
  private genAI: GoogleGenerativeAI;

  constructor(private config: ConfigService) {
    this.genAI = new GoogleGenerativeAI(
      this.config.get<string>('GEMINI_API_KEY')!,
    );
  }

  async analyzeCode(
    prTitle: string,
    files: PullRequestFile[],
  ): Promise<AnalysisResult> {
    const model = this.genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    });

    const filesContent = files
      .map((f) => `File: ${f.filename}\n\`\`\`\n${f.patch ?? 'No diff available'}\n\`\`\``)
      .join('\n\n');

    const prompt = `
You are an expert code reviewer. Analyze the following pull request and return a JSON response only, no markdown, no explanation outside the JSON.

PR Title: ${prTitle}

Changed Files:
${filesContent}

Return this exact JSON structure:
{
  "overallScore": <number 0-100>,
  "summary": "<overall PR summary in 2-3 sentences>",
  "files": [
    {
      "filename": "<filename>",
      "summary": "<what this file does in 1 sentence>",
      "issues": [
        {
          "severity": "<critical|warning|suggestion>",
          "message": "<clear description of the issue>",
          "line": <line number or null>
        }
      ]
    }
  ]
}

Scoring guide:
- 90-100: Excellent code, minimal issues
- 70-89: Good code, minor improvements needed
- 50-69: Average code, several issues
- Below 50: Poor code, major issues found
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned) as AnalysisResult;
  }
}