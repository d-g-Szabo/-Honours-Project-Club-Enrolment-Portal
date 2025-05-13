import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { supabase } from '../utils/supabase/supabase.client';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { PlaceQueryDto } from './dto/place-query.dto';

@Injectable()
export class PlacesService {
  async create(dto: CreatePlaceDto) {
    const { error, data } = await supabase.from('places').insert([dto]).select().single();
    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async findAll(query: PlaceQueryDto) {
    const { page = 1, limit = 10, search, type, fee_type, city, state } = query;
    let supaQuery = supabase.from('places').select('*', { count: 'exact' });
    if (search) {
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
    const { data, error } = await supabase.from('places').select('*').eq('id', id).single();
    if (error || !data) throw new NotFoundException('Place not found');
    return data;
  }

  async update(id: string, dto: UpdatePlaceDto) {
    const { data, error } = await supabase.from('places').update(dto).eq('id', id).select().single();
    if (error || !data) throw new NotFoundException('Place not found or update failed');
    return data;
  }

  async remove(id: string) {
    const { error } = await supabase.from('places').delete().eq('id', id);
    if (error) throw new NotFoundException('Place not found or delete failed');
    return { message: 'Place deleted successfully' };
  }
} 