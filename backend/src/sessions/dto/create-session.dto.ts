import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsDateString, IsInt, Min, IsNumber, IsIn } from 'class-validator';

export class CreateSessionDto {
  @ApiProperty({ example: 'uuid-of-user' })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ example: 'Yoga Class' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'A relaxing yoga session.' })
  @IsString()
  description: string;

  @ApiProperty({ example: '2024-05-20' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ example: '10:00:00' })
  @IsString()
  @IsNotEmpty()
  time: string;

  @ApiProperty({ example: 60 })
  @IsInt()
  @Min(1)
  duration: number;

  @ApiProperty({ example: 20 })
  @IsInt()
  @Min(1)
  capacity: number;

  @ApiProperty({ example: 0 })
  @IsInt()
  @Min(0)
  booked_slots: number;

  @ApiProperty({ example: 15.00 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 'Available', enum: ['Booked', 'Available'] })
  @IsString()
  @IsIn(['Booked', 'Available'])
  status: string;
} 