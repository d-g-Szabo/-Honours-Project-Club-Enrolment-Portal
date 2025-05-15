import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty({ example: 'uuid-of-user1' })
  @IsUUID()
  @IsNotEmpty()
  user1_id: string;

  @ApiProperty({ example: 'uuid-of-user2' })
  @IsUUID()
  @IsNotEmpty()
  user2_id: string;
} 