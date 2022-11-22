import { Controller, Post, UseGuards, Req, HttpCode } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import LoginDto from './dto/logIn.dto';
import { LocalAuthGuard } from './localAuth.guard';
import RequestWithUser from './types/requestWithUser.interface';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
