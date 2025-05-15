import { Body, Controller, Get, Post, Patch, Delete, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ConversationsService } from './conversations.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { ConversationQueryDto } from './dto/conversation-query.dto';

@ApiTags('conversations')
@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new conversation' })
  @ApiResponse({ status: 201, description: 'Conversation created' })
  async create(@Body() dto: CreateConversationDto) {
    return this.conversationsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all conversations with pagination and filters' })
  @ApiResponse({ status: 200, description: 'List of conversations' })
  async findAll(@Query() query: ConversationQueryDto) {
    return this.conversationsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get conversation by ID' })
  @ApiResponse({ status: 200, description: 'Conversation details' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.conversationsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a conversation' })
  @ApiResponse({ status: 200, description: 'Conversation updated' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateConversationDto
  ) {
    return this.conversationsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a conversation' })
  @ApiResponse({ status: 200, description: 'Conversation deleted' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.conversationsService.remove(id);
  }
} 