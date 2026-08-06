import { IsString, IsOptional, IsArray, IsEnum } from 'class-validator';

export enum SeniorityLevel {
  ENTRY = 'ENTRY',
  MID = 'MID',
  SENIOR = 'SENIOR',
  LEAD = 'LEAD',
  EXECUTIVE = 'EXECUTIVE',
}

export enum RemotePreference {
  REMOTE_ONLY = 'REMOTE_ONLY',
  HYBRID = 'HYBRID',
  ONSITE = 'ONSITE',
  OPEN = 'OPEN',
}

export class CreateProfileDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsString()
  @IsOptional()
  timezone?: string;

  @IsString()
  @IsOptional()
  targetRole?: string;

  @IsEnum(SeniorityLevel)
  @IsOptional()
  seniority?: SeniorityLevel;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  preferredLocations?: string[];

  @IsEnum(RemotePreference)
  @IsOptional()
  remotePreference?: RemotePreference;

  @IsString()
  @IsOptional()
  salaryExpectation?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  employmentTypes?: string[];
}
