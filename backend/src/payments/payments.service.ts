// PaymentsService: Handles payment creation, PayPal integration, and payment status updates.
// Responsible for creating payment intents, processing PayPal webhooks, and updating booking/payment records.

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaypalWebhookDto } from './dto/paypal-webhook.dto';
import * as paypal from '@paypal/checkout-server-sdk';
import { supabase } from '../utils/supabase/supabase.client';

// Set up PayPal SDK environment (Sandbox for testing)
const paypalEnv = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID!,
  process.env.PAYPAL_CLIENT_SECRET!
);
const paypalClient = new paypal.core.PayPalHttpClient(paypalEnv);

@Injectable()
export class PaymentsService {
  // Create a PayPal payment intent and save it in the database
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
      // Create the PayPal order
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
    // Find approval URL from PayPal response
    const approvalUrl = order.links.find((l: any) => l.rel === 'approve')?.href;
    return { approvalUrl, paypalOrderId: order.id };
  }

  // Handle PayPal webhook events (e.g., payment capture completed)
  async handlePaypalWebhook(dto: PaypalWebhookDto) {
    // Only handle payment capture completed events
    if (dto.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const resource = dto.resource;
      // Extract payment/order and transaction details
      const payment_id = resource.supplementary_data?.related_ids?.order_id;
      const paypal_transaction_id = resource.id;
      const amount = parseFloat(resource.amount.value);
      const currency = resource.amount.currency_code;
      // Find the related booking by payment_id
      const { data: paymentData, error: paymentError } = await supabase
        .from('bookings')
        .select('*')
        .eq('payment_id', payment_id)
        .single();

      // update the booked_slots in the sessions table
      if (paymentError || !paymentData) {
        throw new NotFoundException('Payment not found for webhook');
      }
      const { session_id } = paymentData;
      // Fetch the session to update booked slots
      const { data: sessionData, error: sessionError } = await supabase
        .from('sessions')
        .select('*')
        .eq('id', session_id)
        .single();
      
        if (sessionError || !sessionData) {
        throw new NotFoundException('Session not found for webhook');
      }
      const { booked_slots, capacity } = sessionData;
      const newBookedSlots = booked_slots + 1;
      // Update the session's booked_slots field
      const { error: updateError } = await supabase
        .from('sessions')
        .update({ booked_slots: newBookedSlots })
        .eq('id', session_id);
      
        if (updateError) {
        throw new BadRequestException('Failed to update booked slots: ' + updateError.message);
      }
      
      // Call a Postgres function to update booking/payment status and transaction
      const { data, error } = await supabase.rpc('increment_booked_slots', {
        payment_id,
        amount,
        currency,
        paypal_transaction_id
      });
      
      if (error) throw new NotFoundException('Payment not found for webhook');
      return { message: 'Payment and transaction updated' };
    }
    // Ignore other event types
    return { message: 'Event ignored', event: dto.event_type };
  }
} 