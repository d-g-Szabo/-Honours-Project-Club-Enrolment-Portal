import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: 'uuid-of-session' })
  @IsUUID()
  @IsNotEmpty()
  session_id: string;

  @ApiProperty({ example: 'uuid-of-place' })
  @IsUUID()
  @IsNotEmpty()
  place_id: string;

  @ApiProperty({ example: 'uuid-of-user' })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ example: 'uuid-of-payment', required: false })
  @IsString()
  payment_id?: string;

  @ApiProperty({ example: 'uuid-of-transaction', required: false })
  @IsUUID()
  transaction_id?: string;

  @ApiProperty({ example: 'pending', description: 'Status of the booking', required: false })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({ example: 'PAYID-123456789', description: 'PayPal payment ID', required: false })
  @IsString()
  @IsOptional()
  paypal_payment_id?: string;

  @ApiProperty({ example: 100.00, description: 'Amount of the booking', required: false })
  @IsNumber()
  @IsOptional()
  amount?: number;

  @ApiProperty({ example: 'USD', description: 'Currency of the booking', required: false })
  @IsString()
  @IsOptional()
  currency?: string;
} 