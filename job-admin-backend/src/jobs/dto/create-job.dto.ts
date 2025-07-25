import { IsString, IsOptional, IsDateString, IsNumber } from 'class-validator';

export class CreateJobDto {
  @IsString()
  title: string;

  @IsString()
  company: string;

  @IsString()
  location: string;

  @IsString()
  jobType: string; // Full-time, Part-time, etc.

  @IsString()
  experience: string; // e.g., 0-2yrs

  @IsString()
  salaryRange: string;

  @IsDateString()
  deadline: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsDateString()
  applicationDeadline: string; 

  @IsNumber()
  salaryMin: number;
  
  @IsNumber()
  salaryMax: number;

  @IsOptional()
  @IsString()
  workType: string;

  @IsOptional()
  @IsString()
  requirements?: string;

  @IsOptional()
  @IsString()
  responsibilities?: string;
}
