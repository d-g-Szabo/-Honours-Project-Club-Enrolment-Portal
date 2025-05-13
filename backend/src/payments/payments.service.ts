import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaypalWebhookDto } from './dto/paypal-webhook.dto';
import * as paypal from '@paypal/checkout-server-sdk';
import { supabase } from '../utils/supabase/supabase.client';

const paypalEnv = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID!,
  process.env.PAYPAL_CLIENT_SECRET!
);
const paypalClient = new paypal.core.PayPalHttpClient(paypalEnv);

@Injectable()
export class PaymentsService {
  async createPaypalPayment(dto: CreatePaymentDto) {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          amount: {
            currency_code: dto.currency,
            value: dto.amount.toFixed(2),
          },
        },
      ],
      application_context: {
        return_url: process.env.PAYPAL_RETURN_URL || 'http://localhost:3000/paypal/success',
        cancel_url: process.env.PAYPAL_CANCEL_URL || 'http://localhost:3000/paypal/cancel',
      },
    });
    let order;
    try {
      const response = await paypalClient.execute(request);
      order = response.result;
    } catch (err) {
      throw new BadRequestException('PayPal payment creation failed: ' + err.message);
    }
    // Save payment intent in DB (payments table)
    const { error } = await supabase.from('payments').insert([
      {
        user_id: dto.user_id,
        amount: dto.amount,
        currency: dto.currency,
        status: 'pending',
        paypal_payment_id: order.id,
      },
    ]);
    if (error) throw new BadRequestException('Failed to save payment intent: ' + error.message);
    // Find approval URL
    const approvalUrl = order.links.find((l: any) => l.rel === 'approve')?.href;
    return { approvalUrl, paypalOrderId: order.id };
  }

  async handlePaypalWebhook(dto: PaypalWebhookDto) {
    // Only handle payment capture completed events
    if (dto.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const resource = dto.resource;
      const paypal_payment_id = resource.supplementary_data?.related_ids?.order_id;
      const paypal_transaction_id = resource.id;
      const amount = parseFloat(resource.amount.value);
      const currency = resource.amount.currency_code;
      // Update payments table
      const { data: payment, error: paymentError } = await supabase
        .from('payments')
        .update({ status: 'completed' })
        .eq('paypal_payment_id', paypal_payment_id)
        .select()
        .single();
      if (paymentError || !payment) throw new NotFoundException('Payment not found for webhook');
      // Insert transaction record
      const { error: txError } = await supabase.from('transactions').insert([
        {
          payment_id: payment.id,
          status: 'completed',
          amount,
          currency,
          paypal_transaction_id,
        },
      ]);
      if (txError) throw new BadRequestException('Failed to save transaction: ' + txError.message);
      return { message: 'Payment and transaction updated' };
    }
    return { message: 'Event ignored', event: dto.event_type };
  }
} 