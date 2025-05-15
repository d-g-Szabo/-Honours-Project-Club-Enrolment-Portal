import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsNumber, IsString, Min } from 'class-validator';

// CreatePaymentDto: Data transfer object for creating a new payment record.
// Includes amount, currency, user_id, and booking_id fields.

export class CreatePaymentDto {
  @ApiProperty({ example: 20.00 })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ example: 'USD' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ example: 'uuid-of-user' })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ example: 'uuid-of-booking' })
  @IsUUID()
  @IsNotEmpty()
  booking_id: string;
} 