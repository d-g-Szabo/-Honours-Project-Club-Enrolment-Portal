import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsObject } from 'class-validator';

export class PaypalWebhookDto {
  @ApiProperty({ example: 'PAYMENT.CAPTURE.COMPLETED' })
  @IsString()
  @IsNotEmpty()
  event_type: string;

  @ApiProperty({ example: {}, description: 'PayPal resource object' })
  @IsObject()
  @IsNotEmpty()
  resource: any;
} 