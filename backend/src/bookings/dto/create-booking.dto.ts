import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

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
  @IsUUID()
  payment_id?: string;

  @ApiProperty({ example: 'uuid-of-transaction', required: false })
  @IsUUID()
  transaction_id?: string;
} 