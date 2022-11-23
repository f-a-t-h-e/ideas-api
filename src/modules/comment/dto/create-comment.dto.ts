import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { CustomCreateDto } from '../../../shared/dto/custom-create.dto';

export class CreateCommentDto extends CustomCreateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;
}
