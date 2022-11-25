import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Idea } from './entities/idea.entity';

import { CommentService } from '../comment/comment.service';
import { IdeaService } from './idea.service';
import { GraphqlJwtAuthGuard } from '../auth/guards/graphql-jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { UserParam } from '../user/user.param.decorator';

@Resolver('Idea')
export class IdeaResolver {
  constructor(
    private ideaService: IdeaService,
    private commentService: CommentService,
  ) {}

  @Query()
  async ideas(@Args('page') page: number) {
    return await this.ideaService.findAll(page);
  }

  @Query()
  async idea(@Args('id') id: string) {
    return await this.ideaService.findOne(id);
  }

  @ResolveField()
  async comments(@Parent() idea: Idea) {
    const { id } = idea;

    return await this.commentService.getAllForIdea(id);
  }

  @UseGuards(GraphqlJwtAuthGuard)
  @Mutation()
  async createIdea(
    @Args('idea') idea: string,
    @Args('description') description: string,
    @UserParam() user: any,
  ) {
    return await this.ideaService.create(user, { idea, description });
  }

  @UseGuards(GraphqlJwtAuthGuard)
  @Mutation()
  async updateIdea(
    @Args('id') id: string,
    @Args('idea') idea: string,
    @Args('description') description: string,
    @UserParam() user: any,
  ) {
    return await this.ideaService.update(user.id, id, { idea, description });
  }

  @UseGuards(GraphqlJwtAuthGuard)
  @Mutation()
  async deleteIdea(@Args('id') id: string, @UserParam() user: any) {
    return await this.ideaService.remove(user.id, id);
  }

  @UseGuards(GraphqlJwtAuthGuard)
  @Mutation()
  async upvote(@Args('id') id: string, @UserParam() user: any) {
    return await this.ideaService.upVote(user.id, id);
  }
  @UseGuards(GraphqlJwtAuthGuard)
  @Mutation()
  async downvote(@Args('id') id: string, @UserParam() user: any) {
    return await this.ideaService.downVote(user.id, id);
  }
  @UseGuards(GraphqlJwtAuthGuard)
  @Mutation()
  async bookmark(@Args('id') id: string, @UserParam() user: any) {
    return await this.ideaService.bookmark(user.id, id);
  }
  @UseGuards(GraphqlJwtAuthGuard)
  @Mutation()
  async unbookmark(@Args('id') id: string, @UserParam() user: any) {
    return await this.ideaService.unbookmark(user.id, id);
  }
}
