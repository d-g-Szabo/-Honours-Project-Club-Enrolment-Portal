import { ApiProperty } from '@nestjs/swagger';
import { CreateSessionDto } from './create-session.dto';
import { CreatePlaceDto } from '../../places/dto/create-place.dto';

export class CreateSessionWithPlaceDto {
  @ApiProperty({ type: CreateSessionDto })
  session: CreateSessionDto;

  @ApiProperty({ type: CreatePlaceDto })
  place: CreatePlaceDto;
} 