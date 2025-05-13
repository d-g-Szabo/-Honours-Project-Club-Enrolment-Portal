import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { supabase } from '../utils/supabase/supabase.client';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { ConversationQueryDto } from './dto/conversation-query.dto';

@Injectable()
export class ConversationsService {
  async create(dto: CreateConversationDto) {
    // Ensure user1_id != user2_id
    if (dto.user1_id === dto.user2_id) {
      throw new BadRequestException('Cannot create a conversation with yourself.');
    }
    // Ensure order-agnostic uniqueness
    const { data: existing, error: findError } = await supabase
      .from('conversations')
      .select('*')
      .or(`and(user1_id.eq.${dto.user1_id},user2_id.eq.${dto.user2_id}),and(user1_id.eq.${dto.user2_id},user2_id.eq.${dto.user1_id})`)
      .maybeSingle();
    if (findError) throw new BadRequestException(findError.message);
    if (existing) throw new BadRequestException('Conversation already exists between these users.');
    const { error, data } = await supabase.from('conversations').insert([dto]).select().single();
    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async findAll(query: ConversationQueryDto) {
    const { page = 1, limit = 10, user_id } = query;
    let supaQuery = supabase.from('conversations').select('*', { count: 'exact' });
    if (user_id) {
      supaQuery = supaQuery.or(`user1_id.eq.${user_id},user2_id.eq.${user_id}`);
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
    const { data, error } = await supabase.from('conversations').select('*').eq('id', id).single();
    if (error || !data) throw new NotFoundException('Conversation not found');
    return data;
  }

  async update(id: string, dto: UpdateConversationDto) {
    const { data, error } = await supabase.from('conversations').update(dto).eq('id', id).select().single();
    if (error || !data) throw new NotFoundException('Conversation not found or update failed');
    return data;
  }

  async remove(id: string) {
    const { error } = await supabase.from('conversations').delete().eq('id', id);
    if (error) throw new NotFoundException('Conversation not found or delete failed');
    return { message: 'Conversation deleted successfully' };
  }
} 