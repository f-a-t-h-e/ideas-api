import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        req => {
          return req?.cookies?.Authentication;
        },
      ]),
      ignoreExpiration: false, // default already
      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
      // secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET, // same value
    });
  }
  async validate(payload: { sub: string; username: string }) {
    const user = await this.authService.validateUserJWT(payload.sub);
    // if (!user)
    //   throw new UnauthorizedException(`You don't have access to this services`);
    return user;
  }
}
