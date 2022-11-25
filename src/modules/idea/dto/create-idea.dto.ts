import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEmail, IsEmpty, IsNotEmpty, IsString } from 'class-validator';
import { User } from '../../user/entities/user.entity';

export class CreateIdeaDto {
  @IsEmpty()
  @ApiHideProperty()
  id?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  idea: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;
}
