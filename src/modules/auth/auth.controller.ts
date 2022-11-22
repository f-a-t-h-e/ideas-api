import {
  Controller,
  Post,
  UseGuards,
  Req,
  HttpCode,
  // Res,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { LoginDto } from '../user/dto/login.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './localAuth.guard';
import RequestWithUser from './types/requestWithUser.interface';
// import { Response } from 'express';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @ApiBody({ type: RegisterDto })
  // @Post('register')
  // async register(@Body() registerDto: RegisterDto): Promise<'token'> {
  //   return this.authService.
  // }

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
    return user;
  }
}
