import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { supabase } from '../utils/supabase/supabase.client';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { PlaceQueryDto } from './dto/place-query.dto';

@Injectable()
export class PlacesService {
  // Create a new place
  async create(dto: CreatePlaceDto) {
    const { error, data } = await supabase.from('places').insert([dto]).select().single();
    if (error) throw new BadRequestException(error.message);
    return data;
  }

  // Get all places with optional filters and pagination
  async findAll(query: PlaceQueryDto) {
    const { page = 1, limit = 10, search, type, fee_type, city, state } = query;
    // Build the query with optional filters
    let supaQuery = supabase.from('places').select('*', { count: 'exact' });
    if (search) {
      // Search across multiple address fields
      supaQuery = supaQuery.or(`address1.ilike.%${search}%,address2.ilike.%${search}%,city.ilike.%${search}%,state.ilike.%${search}%,county.ilike.%${search}%,postal_code.ilike.%${search}%,link.ilike.%${search}%`);
    }
    if (type) {
      supaQuery = supaQuery.eq('type', type);
    }
    if (fee_type) {
      supaQuery = supaQuery.eq('fee_type', fee_type);
    }
    if (city) {
      supaQuery = supaQuery.eq('city', city);
    }
    if (state) {
      supaQuery = supaQuery.eq('state', state);
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

  // Get a single place by its ID
  async findOne(id: string) {
    const { data, error } = await supabase.from('places').select('*').eq('id', id).single();
    if (error || !data) throw new NotFoundException('Place not found');
    return data;
  }

  // Update a place by its ID
  async update(id: string, dto: UpdatePlaceDto) {
    const { data, error } = await supabase.from('places').update(dto).eq('id', id).select().single();
    if (error || !data) throw new NotFoundException('Place not found or update failed');
    return data;
  }

  // Delete a place by its ID
  async remove(id: string) {
    const { error } = await supabase.from('places').delete().eq('id', id);
    if (error) throw new NotFoundException('Place not found or delete failed');
    return { message: 'Place deleted successfully' };
  }
} 