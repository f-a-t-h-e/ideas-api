import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEmail, IsEmpty, IsNotEmpty, IsString } from 'class-validator';

export class CreateIdeaDto {
  @IsEmpty()
  @ApiHideProperty()
  id: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  idea: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  description: string;
}
