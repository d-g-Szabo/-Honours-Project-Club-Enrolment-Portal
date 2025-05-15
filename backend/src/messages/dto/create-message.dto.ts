import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsString } from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ example: 'uuid-of-conversation' })
  @IsUUID()
  @IsNotEmpty()
  conversation_id: string;

  @ApiProperty({ example: 'uuid-of-sender' })
  @IsUUID()
  @IsNotEmpty()
  sender_id: string;

  @ApiProperty({ example: 'Hello there!' })
  @IsString()
  @IsNotEmpty()
  content: string;
} 