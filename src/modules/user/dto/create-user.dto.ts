import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { CustomCreateDto } from '../../../shared/dto/custom-create.dto';

export class CreateUserDto extends CustomCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
