import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsString, IsInt, Min } from 'class-validator';

export class CreatePaymentMethodDto {
  @ApiProperty({ example: 'uuid-of-user' })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ example: 'paypal-card-id' })
  @IsString()
  @IsNotEmpty()
  paypal_card_id: string;

  @ApiProperty({ example: 'Visa' })
  @IsString()
  @IsNotEmpty()
  brand: string;

  @ApiProperty({ example: '1234' })
  @IsString()
  @IsNotEmpty()
  last4: string;

  @ApiProperty({ example: 12 })
  @IsInt()
  @Min(1)
  exp_month: number;

  @ApiProperty({ example: 2028 })
  @IsInt()
  @Min(2020)
  exp_year: number;
} 