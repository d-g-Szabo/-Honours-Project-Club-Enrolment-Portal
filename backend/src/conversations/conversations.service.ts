import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { supabase } from '../utils/supabase/supabase.client';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { ConversationQueryDto } from './dto/conversation-query.dto';

@Injectable()
export class ConversationsService {
  // Create a new conversation between two users
  async create(dto: CreateConversationDto) {
    // Ensure user1_id != user2_id (no self-conversations)
    if (dto.user1_id === dto.user2_id) {
      throw new BadRequestException('Cannot create a conversation with yourself.');
    }
    // Ensure order-agnostic uniqueness: check if a conversation already exists between these two users
    const { data: existing, error: findError } = await supabase
      .from('conversations')
      .select('*')
      .or(`and(user1_id.eq.${dto.user1_id},user2_id.eq.${dto.user2_id}),and(user1_id.eq.${dto.user2_id},user2_id.eq.${dto.user1_id})`)
      .maybeSingle();
    if (findError) throw new BadRequestException(findError.message);
    if (existing) throw new BadRequestException('Conversation already exists between these users.');
    // Insert the new conversation (user_a_id and user_b_id are for consistent ordering)
    const { error, data } = await supabase.from('conversations').insert([{ user1_id: dto.user1_id, user2_id: dto.user2_id, user_a_id: dto.user1_id, user_b_id: dto.user2_id }]).select().single();
    if (error) throw new BadRequestException(error.message);
    return data;
  }

  // Get all conversations for a user (with pagination)
  async findAll(query: ConversationQueryDto) {
    const { page = 1, limit = 10, user_id } = query;
    // Build the query, optionally filtering by user_id
    let supaQuery = supabase.from('conversations').select('*, conversations_user1_id_fkey(id, full_name), conversations_user2_id_fkey(id, full_name)', { count: 'exact' });
    if (user_id) {
      // Find conversations where the user is either user1 or user2
      supaQuery = supaQuery.or(`user1_id.eq.${user_id},user2_id.eq.${user_id}`);
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

  // Get a single conversation by its ID
  async findOne(id: string) {
    const { data, error } = await supabase.from('conversations').select('*').eq('id', id).single();
    if (error || !data) throw new NotFoundException('Conversation not found');
    return data;
  }

  // Update a conversation by its ID
  async update(id: string, dto: UpdateConversationDto) {
    const { data, error } = await supabase.from('conversations').update(dto).eq('id', id).select().single();
    if (error || !data) throw new NotFoundException('Conversation not found or update failed');
    return data;
  }

  // Delete a conversation by its ID
  async remove(id: string) {
    const { error } = await supabase.from('conversations').delete().eq('id', id);
    if (error) throw new NotFoundException('Conversation not found or delete failed');
    return { message: 'Conversation deleted successfully' };
  }
} 