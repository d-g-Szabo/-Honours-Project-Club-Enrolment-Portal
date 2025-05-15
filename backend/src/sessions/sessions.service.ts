import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { supabase } from '../utils/supabase/supabase.client';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SessionQueryDto } from './dto/session-query.dto';
import { CreateSessionWithPlaceDto } from './dto/create-session-with-place.dto';
import { CreatePlaceDto } from '../places/dto/create-place.dto';

@Injectable()
export class SessionsService {
  // Create a new session
  async create(dto: CreateSessionDto) {
    const { error, data } = await supabase.from('sessions').insert([dto]).select().single();
    if (error) throw new BadRequestException(error.message);
    return data;
  }

  // Get all sessions with optional filters and pagination
  async findAll(query: SessionQueryDto) {
    console.log(query);
    const { page = 1, limit = 10, search, status, dateFrom, dateTo } = query;
    // Build the query with optional filters
    let supaQuery = supabase.from('sessions').select('*, places(*)', { count: 'exact' });
    supaQuery.eq('is_delete', false); // Only fetch sessions not marked as deleted
    if (query.user_id) {
      supaQuery.eq('user_id', query.user_id);
    }
    if (search) {
      // Search by title or description
      supaQuery = supaQuery.ilike('title', `%${search}%`).or(`description.ilike.%${search}%`);
    }
    if (status) {
      supaQuery = supaQuery.eq('status', status);
    }
    if (dateFrom) {
      supaQuery = supaQuery.gte('date', dateFrom);
    }
    if (dateTo) {
      supaQuery = supaQuery.lte('date', dateTo);
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

  // Get a single session by its ID (with place info)
  async findOne(id: string) {
    const { data, error } = await supabase.from('places').select('*, sessions(*)').eq('session_id', id).single();
    if (error || !data) throw new NotFoundException('Session not found');
    return data;
  }

  // Update a session by its ID
  async update(id: string, dto: UpdateSessionDto) {
    const { data, error } = await supabase.from('sessions').update(dto).eq('id', id).select().single();
    if (error || !data) throw new NotFoundException('Session not found or update failed');
    return data;
  }

  // Delete a session by its ID
  async remove(id: string) {
    const { error } = await supabase.from('sessions').delete().eq('id', id);
    if (error) throw new NotFoundException('Session not found or delete failed');
    return { message: 'Session deleted successfully' };
  }

  // Create a session and its associated place in a single operation
  async createWithPlace(dto: CreateSessionWithPlaceDto) {
    const { session, place } = dto;
    // Create the session
    const { data: sessionData, error: sessionError } = await supabase.from('sessions').insert([session]).select().single();
    if (sessionError) throw new BadRequestException(sessionError.message);
    // Create the place with the session_id
    const placeWithSession: CreatePlaceDto = { ...place, session_id: sessionData.id };
    const { data: placeData, error: placeError } = await supabase.from('places').insert([placeWithSession]).select().single();
    if (placeError) throw new BadRequestException(placeError.message);
    return { session: sessionData, place: placeData };
  }
} 