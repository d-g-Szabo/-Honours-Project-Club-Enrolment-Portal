import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { supabase } from '../utils/supabase/supabase.client';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';
import { PaymentMethodQueryDto } from './dto/payment-method-query.dto';

@Injectable()
export class PaymentMethodsService {
  async create(dto: CreatePaymentMethodDto) {
    const { error, data } = await supabase.from('payment_methods').insert([dto]).select().single();
    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async findAll(query: PaymentMethodQueryDto) {
    const { page = 1, limit = 10, user_id } = query;
    let supaQuery = supabase.from('payment_methods').select('*', { count: 'exact' });
    if (user_id) {
      supaQuery = supaQuery.eq('user_id', user_id);
    }
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const { data, error, count } = await supaQuery.range(from, to);
    if (error) throw new BadRequestException(error.message);
    return {
      data,
      meta: {
        total: count,
        page,
        limit,
        totalPages: count ? Math.ceil(count / limit) : 0,
      },
    };
  }

  async findOne(id: string) {
    const { data, error } = await supabase.from('payment_methods').select('*').eq('id', id).single();
    if (error || !data) throw new NotFoundException('Payment method not found');
    return data;
  }

  async update(id: string, dto: UpdatePaymentMethodDto) {
    const { data, error } = await supabase.from('payment_methods').update(dto).eq('id', id).select().single();
    if (error || !data) throw new NotFoundException('Payment method not found or update failed');
    return data;
  }

  async remove(id: string) {
    const { error } = await supabase.from('payment_methods').delete().eq('id', id);
    if (error) throw new NotFoundException('Payment method not found or delete failed');
    return { message: 'Payment method deleted successfully' };
  }
} 