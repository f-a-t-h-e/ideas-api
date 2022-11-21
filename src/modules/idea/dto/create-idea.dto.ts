import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { IsEmail, IsEmpty } from 'class-validator';

export class CreateIdeaDto {
  @IsEmail()
  @ApiProperty()
  idea: string;

  @ApiProperty()
  @Exclude()
  description: string;
}
