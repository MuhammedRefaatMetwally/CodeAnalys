import { IsString, IsUrl } from 'class-validator';

export class CreateAnalysisDto {
  @IsString()
  @IsUrl()
  prUrl: string;
}