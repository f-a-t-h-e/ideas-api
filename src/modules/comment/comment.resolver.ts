import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphqlJwtAuthGuard } from '../auth/guards/graphql-jwt-auth.guard';
import { User } from '../user/entities/user.entity';
import { UserParam } from '../user/user.param.decorator';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Resolver('comment')
export class CommentResolver {
  constructor(private commentService: CommentService) {}

  @Query()
  comment(@Args('id') id: string) {
    return this.commentService.findOne(id);
  }

  @UseGuards(GraphqlJwtAuthGuard)
  @Mutation()
  async createComment(
    @Args('idea') idea: string,
    @Args('content') content: string,
    @UserParam() theUser: any,
  ) {
    return await this.commentService.create({ idea, theUser, content });
  }

  @UseGuards(GraphqlJwtAuthGuard)
  @Mutation()
  async deleteComment(@Args('id') id: string, @UserParam() theUser: User) {
    return await this.commentService.remove(theUser.id, id);
  }
}
