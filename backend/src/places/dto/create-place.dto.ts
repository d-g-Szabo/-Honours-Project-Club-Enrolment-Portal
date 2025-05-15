import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID, IsIn, ValidateIf } from 'class-validator';

export class CreatePlaceDto {
  @ApiPropertyOptional({ example: 'uuid-of-session', required: false })
  @IsUUID()
  session_id?: string;

  @ApiProperty({ example: 'uuid-of-club' })
  @IsUUID()
  @IsNotEmpty()
  club_id: string;

  @ApiProperty({ example: 'Physical', enum: ['Physical', 'Virtual'] })
  @IsString()
  @IsIn(['Physical', 'Virtual'])
  @IsNotEmpty()
  type: string;

  @ApiProperty({ example: '123 Main St' })
  @ValidateIf(o => o.type === 'Physical')
  @IsString()
  @IsNotEmpty()
  address1?: string;

  @ApiPropertyOptional({ example: 'Suite 100' })
  @ValidateIf(o => o.type === 'Physical')
  @IsString()
  address2?: string;

  @ApiProperty({ example: 'New York' })
  @ValidateIf(o => o.type === 'Physical')
  @IsString()
  @IsNotEmpty()
  city?: string;

  @ApiProperty({ example: 'NY' })
  @ValidateIf(o => o.type === 'Physical')
  @IsString()
  @IsNotEmpty()
  state?: string;

  @ApiPropertyOptional({ example: 'Kings' })
  @ValidateIf(o => o.type === 'Physical')
  @IsString()
  county?: string;

  @ApiProperty({ example: '10001' })
  @ValidateIf(o => o.type === 'Physical')
  @IsString()
  @IsNotEmpty()
  postal_code?: string;

  @ApiPropertyOptional({ example: 'https://zoom.us/meeting/xyz' })
  @ValidateIf(o => o.type === 'Virtual')
  @IsString()
  @IsNotEmpty()
  link?: string;

  @ApiProperty({ example: 'Paid', enum: ['Paid', 'Free'] })
  @IsString()
  @IsIn(['Paid', 'Free'])
  @IsNotEmpty()
  fee_type: string;
} 