import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUserLocal({
    email,
    pass,
  }: {
    email: string;
    pass: string;
  }): Promise<Partial<User> | null> {
    const user = await this.userService.getOneBy({ email });
    if (user && user.password && User.comparePassword(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateUserJWT(id: string): Promise<Partial<User> | null> {
    const user = await this.userService.getOneBy({ id });
    return user;
  }

  getCookieWithJwtAccessToken(user: any) {
    const payload = { username: user.username, sub: user.id };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_EXPIRATION_TIME')}s`,
    });
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}`;
  }
}
