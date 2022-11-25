import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Idea } from './entities/idea.entity';

import { CommentService } from '../comment/comment.service';
import { IdeaService } from './idea.service';

@Resolver('Idea')
export class IdeaResolver {
  constructor(
    private ideaService: IdeaService,
    private commentService: CommentService,
  ) {}

  @Query()
  ideas(@Args('page') page: number) {
    return this.ideaService.findAll(page);
  }

  @ResolveField()
  comments(@Parent() idea: Idea) {
    const { id } = idea;

    return this.commentService.getAllForIdea(id);
  }
}
