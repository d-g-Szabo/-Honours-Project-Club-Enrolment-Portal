import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsString, IsNumber, Min } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({ example: 'uuid-of-payment' })
  @IsUUID()
  @IsNotEmpty()
  payment_id: string;

  @ApiProperty({ example: 'completed' })
  @IsString()
  @IsNotEmpty()
  status: string;

  @ApiProperty({ example: 20.00 })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ example: 'USD' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ example: 'paypal-transaction-id' })
  @IsString()
  @IsNotEmpty()
  paypal_transaction_id: string;
} 