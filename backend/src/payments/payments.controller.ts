// PaymentsController: Exposes endpoints for creating PayPal payments and handling PayPal webhooks.
// Delegates business logic to PaymentsService.

import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaypalWebhookDto } from './dto/paypal-webhook.dto';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('paypal')
  @ApiOperation({ summary: 'Create a PayPal payment and get approval URL' })
  @ApiResponse({ status: 201, description: 'PayPal approval URL returned' })
  async createPaypalPayment(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.createPaypalPayment(dto);
  }

  @Post('paypal/webhook')
  @ApiOperation({ summary: 'Handle PayPal webhook notifications' })
  @ApiResponse({ status: 200, description: 'Webhook processed' })
  async handlePaypalWebhook(@Body() dto: PaypalWebhookDto, @Req() req: any) {
    return this.paymentsService.handlePaypalWebhook(dto);
  }
} 