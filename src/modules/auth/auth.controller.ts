import {
  Controller,
  Post,
  UseGuards,
  Req,
  HttpCode,
  Body,
} from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from '../user/user.service';

import { AuthService } from './auth.service';
import LoginDto from './dto/logIn.dto';
import { LocalAuthGuard } from './guards/localAuth.guard';
import RequestWithUser from './types/requestWithUser.interface';

@ApiTags('auth')
@Controller('api/v1')
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
    return user;
  }
}
