import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsObject } from 'class-validator';

// PaypalWebhookDto: Data transfer object for handling PayPal webhook notifications.
// Includes event_type and resource fields for webhook event processing.

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