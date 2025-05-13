import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, IsString, IsIn, IsDateString } from 'class-validator';

export class SessionQueryDto {
  @ApiPropertyOptional({ example: 1, description: 'Page number' })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, description: 'Items per page' })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'Yoga', description: 'Search by title or description' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'Available', enum: ['Booked', 'Available'] })
  @IsOptional()
  @IsString()
  @IsIn(['Booked', 'Available'])
  status?: string;

  @ApiPropertyOptional({ example: '2024-05-01', description: 'Start date' })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({ example: '2024-05-31', description: 'End date' })
  @IsOptional()
  @IsDateString()
  dateTo?: string;
} 