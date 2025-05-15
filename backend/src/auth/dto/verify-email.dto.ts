import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({ example: 'access_token_from_email_link' })
  @IsString()
  @IsNotEmpty()
  access_token: string;
} 