import { Body, Controller, Get, Post, Patch, Delete, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SessionsService } from './sessions.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SessionQueryDto } from './dto/session-query.dto';
import { CreateSessionWithPlaceDto } from './dto/create-session-with-place.dto';

@ApiTags('sessions')
@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new session with place' })
  @ApiResponse({ status: 201, description: 'Session and place created' })
  async create(@Body() dto: CreateSessionWithPlaceDto) {
    return this.sessionsService.createWithPlace(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all sessions with pagination and filters' })
  @ApiResponse({ status: 200, description: 'List of sessions' })
  async findAll(@Query() query: SessionQueryDto) {
    return this.sessionsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get session by ID' })
  @ApiResponse({ status: 200, description: 'Session details' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.sessionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a session' })
  @ApiResponse({ status: 200, description: 'Session updated' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateSessionDto
  ) {
    return this.sessionsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a session' })
  @ApiResponse({ status: 200, description: 'Session deleted' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.sessionsService.remove(id);
  }
} 