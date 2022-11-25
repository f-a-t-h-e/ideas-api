import { UseGuards } from '@nestjs/common';
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { GraphqlJwtAuthGuard } from '../auth/guards/graphql-jwt-auth.guard';
import { CommentService } from '../comment/comment.service';
import { User } from './entities/user.entity';
import { UserParam } from './user.param.decorator';
import { UserService } from './user.service';

@Resolver('User')
export class UserResolver {
  constructor(
    private userService: UserService,
    private commentService: CommentService,
  ) {}

  @Query() // if you wanna use other name put the corresponding name in @Query('The_Corresponding_name_that_you_set')
  users(@Args('page') page: number) {
    return this.userService.findAll(page);
  }

  @Query()
  user(@Args('username') username: string) {
    return this.userService.read(username);
  }

  @UseGuards(GraphqlJwtAuthGuard)
  @Query('whoami')
  whoAmI(@UserParam() user: User) {
    return user;
  }

  // @UseGuards(GraphqlJwtAuthGuard)
  @ResolveField()
  comments(@Parent() user: User) {
    const { id } = user;
    return this.commentService.getAllForUser(id);
  }
}
