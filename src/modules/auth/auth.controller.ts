import {
  Controller,
  Post,
  UseGuards,
  Req,
  HttpCode,
  Body,
  Get,
  Res,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/entities/user.entity';
import { UserParam } from '../user/user.param.decorator';
import { UserService } from '../user/user.service';
import { Response } from 'express';

import { AuthService } from './auth.service';
import LoginDto from './dto/logIn.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/localAuth.guard';
import RequestWithUser from './types/requestWithUser.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(
    @Body() createUserDto: CreateUserDto,
    @Req() req: RequestWithUser,
  ) {
    const user = await this.userService.register(createUserDto);

    const cookie = this.authService.getCookieWithJwtAccessToken(user);
    req.res?.setHeader('Set-Cookie', cookie);
    console.log(user);

    return user;
  }

  @ApiBody({ type: LoginDto })
  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Req() req: RequestWithUser,
    // @Res({ passthrough: true }) res: Response,
  ) {
    const { user } = req;
    const cookie = this.authService.getCookieWithJwtAccessToken(user);
    // res.cookie('Set-Cookie', cookie);
    req.res?.setHeader('Set-Cookie', cookie);
    return user; // TO_DO Make sure if you want to return the email
  }

  @Get('whoami')
  @UseGuards(JwtAuthGuard)
  showMe(@UserParam() user: User) {
    return this.userService.findOne(user.id);
  }

  @Get('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('Authentication');
    console.log('logedout');

    return 'LogedOut';
  }
}
