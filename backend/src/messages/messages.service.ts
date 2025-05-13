import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { supabase } from '../utils/supabase/supabase.client';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageQueryDto } from './dto/message-query.dto';

@Injectable()
export class MessagesService {
  async create(dto: CreateMessageDto) {
    // Validate sender is a participant in the conversation
    const { data: convo, error: convoError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', dto.conversation_id)
      .single();
    if (convoError || !convo) throw new NotFoundException('Conversation not found');
    if (dto.sender_id !== convo.user1_id && dto.sender_id !== convo.user2_id) {
      throw new ForbiddenException('You are not a participant in this conversation.');
    }
    const { error, data } = await supabase.from('messages').insert([dto]).select().single();
    if (error) throw new BadRequestException(error.message);
    return data;
  }

  async findAll(query: MessageQueryDto) {
    const { page = 1, limit = 10, conversation_id } = query;
    let supaQuery = supabase.from('messages').select('*', { count: 'exact' });
    if (conversation_id) {
      supaQuery = supaQuery.eq('conversation_id', conversation_id);
    }
    supaQuery = supaQuery.order('created_at', { ascending: false });
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
    const { data, error } = await supabase.from('messages').select('*').eq('id', id).single();
    if (error || !data) throw new NotFoundException('Message not found');
    return data;
  }

  async update(id: string, dto: UpdateMessageDto) {
    const { data, error } = await supabase.from('messages').update(dto).eq('id', id).select().single();
    if (error || !data) throw new NotFoundException('Message not found or update failed');
    return data;
  }

  async remove(id: string) {
    const { error } = await supabase.from('messages').delete().eq('id', id);
    if (error) throw new NotFoundException('Message not found or delete failed');
    return { message: 'Message deleted successfully' };
  }
} 