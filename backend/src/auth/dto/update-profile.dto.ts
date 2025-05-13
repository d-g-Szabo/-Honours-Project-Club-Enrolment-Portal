import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'https://example.com/avatar.png' })
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  avatar_url: string;
} 