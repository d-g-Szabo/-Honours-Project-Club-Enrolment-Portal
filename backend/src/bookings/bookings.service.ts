import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { supabase } from '../utils/supabase/supabase.client';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingQueryDto } from './dto/booking-query.dto';

@Injectable()
export class BookingsService {
  async create(dto: CreateBookingDto) {
    const { error, data } = await supabase.from('bookings').insert([dto]).select().single();
    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async findAll(query: BookingQueryDto) {
    const { page = 1, limit = 10, user_id, session_id, place_id } = query;
    let supaQuery = supabase.from('bookings').select('*', { count: 'exact' });
    if (user_id) {
      supaQuery = supaQuery.eq('user_id', user_id);
    }
    if (session_id) {
      supaQuery = supaQuery.eq('session_id', session_id);
    }
    if (place_id) {
      supaQuery = supaQuery.eq('place_id', place_id);
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
    const { data, error } = await supabase.from('bookings').select('*').eq('id', id).single();
    if (error || !data) throw new NotFoundException('Booking not found');
    return data;
  }

  async update(id: string, dto: UpdateBookingDto) {
    const { data, error } = await supabase.from('bookings').update(dto).eq('id', id).select().single();
    if (error || !data) throw new NotFoundException('Booking not found or update failed');
    return data;
  }

  async remove(id: string) {
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) throw new NotFoundException('Booking not found or delete failed');
    return { message: 'Booking deleted successfully' };
  }
} 