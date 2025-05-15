import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, IsUUID } from 'class-validator';

export class BookingQueryDto {
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

  @ApiPropertyOptional({ example: 'uuid-of-user' })
  @IsOptional()
  @IsUUID()
  user_id?: string;

  @ApiPropertyOptional({ example: 'uuid-of-session' })
  @IsOptional()
  @IsUUID()
  session_id?: string;

  @ApiPropertyOptional({ example: 'uuid-of-place' })
  @IsOptional()
  @IsUUID()
  place_id?: string;
} 

export class BookingForClubQueryDto {
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

  @ApiPropertyOptional({ example: 'uuid-of-user' })
  @IsOptional()
  @IsUUID()
  user_id?: string;

  @ApiPropertyOptional({ example: 'uuid-of-session' })
  @IsOptional()
  @IsUUID()
  session_id?: string;

  @ApiPropertyOptional({ example: 'uuid-of-place' })
  @IsOptional()
  @IsUUID()
  place_id?: string;
} 