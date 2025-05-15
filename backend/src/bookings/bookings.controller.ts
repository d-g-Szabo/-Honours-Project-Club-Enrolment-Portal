import { Body, Controller, Get, Post, Patch, Delete, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingForClubQueryDto, BookingQueryDto } from './dto/booking-query.dto';

@ApiTags('bookings')
@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({ status: 201, description: 'Booking created' })
  async create(@Body() dto: CreateBookingDto) {
    return this.bookingsService.create(dto);
  }

  @Get('booking-for-club')
  @ApiOperation({ summary: 'Get all bookings with pagination and filters' })
  @ApiResponse({ status: 200, description: 'List of bookings' })
  async findAllForClub(@Query() query: BookingForClubQueryDto) {
    return this.bookingsService.findAllForClub(query);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookings with pagination and filters' })
  @ApiResponse({ status: 200, description: 'List of bookings' })
  async findAll(@Query() query: BookingQueryDto) {
    return this.bookingsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get booking by ID' })
  @ApiResponse({ status: 200, description: 'Booking details' })
  async findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.bookingsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a booking' })
  @ApiResponse({ status: 200, description: 'Booking updated' })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateBookingDto
  ) {
    return this.bookingsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a booking' })
  @ApiResponse({ status: 200, description: 'Booking deleted' })
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.bookingsService.remove(id);
  }
} 