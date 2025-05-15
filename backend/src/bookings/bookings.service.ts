// Service for handling booking-related operations
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { supabase } from '../utils/supabase/supabase.client';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingForClubQueryDto, BookingQueryDto } from './dto/booking-query.dto';

@Injectable()
export class BookingsService {
  // Create a new booking
  async create(dto: CreateBookingDto) {
    // Fetch the session to check if it's free or paid
    const session = await supabase.from('sessions').select('*').eq('id', dto.session_id).single();
    // If the session is free, mark booking as completed and set amount/currency
    if (session.data.price === 0) {
      dto.status = 'completed';
      dto.amount = 0;
      dto.currency = 'USD';
    }
    // Prepare booking data, using defaults if not provided
    const { status, payment_id, amount, currency, ...rest } = dto;
    const bookingData = {
      ...rest,
      status: status || 'pending', // Default to 'pending' if not set
      payment_id,
      amount,
      currency: currency || 'USD',
    };
    // Insert booking into the database
    const { error, data } = await supabase.from('bookings').insert([bookingData]).select().single();
    if (error) throw new BadRequestException(error.message);
    return data;
  }

  // Get all bookings for a user, session, or place (with pagination)
  async findAll(query: BookingQueryDto) {
    const { page = 1, limit = 10, user_id, session_id, place_id } = query;
    // Build the query with optional filters
    let supaQuery = supabase.from('bookings').select('*, sessions(*, users(*)), places(*), users(*)', { count: 'exact' });
    if (user_id) {
      supaQuery = supaQuery.eq('user_id', user_id);
    }
    if (session_id) {
      supaQuery = supaQuery.eq('session_id', session_id);
    }
    if (place_id) {
      supaQuery = supaQuery.eq('place_id', place_id);
    }
    // Pagination logic
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    // Execute the query
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

  // Get all bookings for a club (sessions owned by a specific user/club)
  async findAllForClub(query: BookingForClubQueryDto) {
    const { page = 1, limit = 10, user_id, session_id, place_id } = query;
    // Build the query for club-owned sessions
    let supaQuery = supabase.from('bookings').select('*, sessions(*, users(*)), places(*), users(*)', { count: 'exact' });
    console.log(user_id, 'user_id'); // Debug: log the user_id
    if (user_id) {
      // Filter bookings where the session is owned by this user/club
      supaQuery = supaQuery.eq('sessions.user_id', user_id);
    }
    if (session_id) {
      supaQuery = supaQuery.eq('session_id', session_id);
    }
    if (place_id) {
      supaQuery = supaQuery.eq('place_id', place_id);
    }
    // Pagination logic
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    // Execute the query
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

  // Get a single booking by its ID
  async findOne(id: string) {
    const { data, error } = await supabase.from('bookings').select('*').eq('id', id).single();
    if (error || !data) throw new NotFoundException('Booking not found');
    return data;
  }

  // Update a booking by its ID
  async update(id: string, dto: UpdateBookingDto) {
    const { data, error } = await supabase.from('bookings').update(dto).eq('id', id).select().single();
    if (error || !data) throw new NotFoundException('Booking not found or update failed');
    return data;
  }

  // Delete a booking by its ID
  async remove(id: string) {
    const { error } = await supabase.from('bookings').delete().eq('id', id);
    if (error) throw new NotFoundException('Booking not found or delete failed');
    return { message: 'Booking deleted successfully' };
  }
} 