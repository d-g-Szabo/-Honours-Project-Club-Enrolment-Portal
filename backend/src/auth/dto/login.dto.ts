import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'johnnew1@yopmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123123123' })
  @IsString()
  @IsNotEmpty()
  password: string;
} 