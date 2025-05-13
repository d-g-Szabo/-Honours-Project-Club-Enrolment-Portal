import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { supabase } from '../utils/supabase/supabase.client';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionQueryDto } from './dto/transaction-query.dto';

@Injectable()
export class TransactionsService {
  async create(dto: CreateTransactionDto) {
    const { error, data } = await supabase.from('transactions').insert([dto]).select().single();
    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async findAll(query: TransactionQueryDto) {
    const { page = 1, limit = 10, payment_id, status } = query;
    let supaQuery = supabase.from('transactions').select('*', { count: 'exact' });
    if (payment_id) {
      supaQuery = supaQuery.eq('payment_id', payment_id);
    }
    if (status) {
      supaQuery = supaQuery.eq('status', status);
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
    const { data, error } = await supabase.from('transactions').select('*').eq('id', id).single();
    if (error || !data) throw new NotFoundException('Transaction not found');
    return data;
  }

  async update(id: string, dto: UpdateTransactionDto) {
    const { data, error } = await supabase.from('transactions').update(dto).eq('id', id).select().single();
    if (error || !data) throw new NotFoundException('Transaction not found or update failed');
    return data;
  }

  async remove(id: string) {
    const { error } = await supabase.from('transactions').delete().eq('id', id);
    if (error) throw new NotFoundException('Transaction not found or delete failed');
    return { message: 'Transaction deleted successfully' };
  }
} 