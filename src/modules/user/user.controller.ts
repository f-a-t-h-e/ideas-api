import {
  Controller,
  Get,
  // Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';

import { UserService } from './user.service';
// import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('api/v1')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post('register')
  // register(@Body() createUserDto: CreateUserDto) {
  //   return this.userService.register(createUserDto);
  // }

  @Get('users')
  findAll(@Query('page') page: number) {
    return this.userService.findAll(page);
  }

  @Get('users/:id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch('users/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete('users/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
