import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, IsString, IsIn } from 'class-validator';

export class PlaceQueryDto {
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

  @ApiPropertyOptional({ example: 'Physical', enum: ['Physical', 'Virtual'] })
  @IsOptional()
  @IsString()
  @IsIn(['Physical', 'Virtual'])
  type?: string;

  @ApiPropertyOptional({ example: 'Paid', enum: ['Paid', 'Free'] })
  @IsOptional()
  @IsString()
  @IsIn(['Paid', 'Free'])
  fee_type?: string;

  @ApiPropertyOptional({ example: 'New York' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ example: 'NY' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiPropertyOptional({ example: 'search term', description: 'Search by address or link' })
  @IsOptional()
  @IsString()
  search?: string;
} 