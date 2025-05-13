import { Body, Controller, Get, Post, Patch, Delete, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { PlaceQueryDto } from './dto/place-query.dto';

@ApiTags('places')
@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new place' })
  @ApiResponse({ status: 201, description: 'Place created' })
  async create(@Body() dto: CreatePlaceDto) {
    return this.placesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all places with pagination and filters' })
  @ApiResponse({ status: 200, description: 'List of places' })
  async findAll(@Query() query: PlaceQueryDto) {
    return this.placesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get place by ID' })
  @ApiResponse({ status: 200, description: 'Place details' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.placesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a place' })
  @ApiResponse({ status: 200, description: 'Place updated' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdatePlaceDto
  ) {
    return this.placesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a place' })
  @ApiResponse({ status: 200, description: 'Place deleted' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.placesService.remove(id);
  }
} 