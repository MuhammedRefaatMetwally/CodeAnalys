import { IsUrl, IsString } from 'class-validator';

export class AnalyzePrDto {
  @IsString()
  @IsUrl()
  prUrl: string;
}