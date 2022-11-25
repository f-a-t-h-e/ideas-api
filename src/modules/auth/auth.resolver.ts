import { UseGuards } from '@nestjs/common';
import {
  Args,
  Context,
  GqlExecutionContext,
  Mutation,
  Resolver,
} from '@nestjs/graphql';
import { AuthService } from '../auth/auth.service';
import RequestWithUser from '../auth/types/requestWithUser.interface';
import { UserService } from '../user/user.service';
import LoginDto from './dto/logIn.dto';
import RegisterDto from './dto/register.dto';
import { GraphqlJwtAuthGuard } from './guards/graphql-jwt-auth.guard';
import { GraphqlLocalAuthGuard } from './guards/graphql-local-auth.guard';
import { LocalAuthGuard } from './guards/localAuth.guard';

@Resolver('Auth')
export class AuthResolver {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  // @UseGuards(GraphqlLocalAuthGuard)
  @Mutation()
  signIn(
    @Args('email') email: string,
    @Args('password') password: string,
    @Context() req: any,
  ) {
    const user = this.authService.validateUserLocal({ email, pass: password });
    if (user) {
      const args: LoginDto = { email, password };
      const cookie = this.authService.getCookieWithJwtAccessToken(args);

      req.res?.setHeader('Set-Cookie', cookie);
      return user;
    } else {
      return null;
    }
  }

  @Mutation()
  async signUp(
    @Args('email') email: string,
    @Args('password') password: string,
    @Args('username') username: string,
    @Context('req') req: RequestWithUser,
  ) {
    const args: RegisterDto = { email, username, password };
    const user = await this.userService.register(args);

    const cookie = this.authService.getCookieWithJwtAccessToken(user);
    req.res?.setHeader('Set-Cookie', cookie);

    return user;
  }
}
