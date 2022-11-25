// import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
// import { Idea } from '../idea/entities/idea.entity';
// import { User } from '../user/entities/user.entity';
// import { CommentService } from './comment.service';

// @Resolver()
// export class CommentResolver {
//   constructor(private commentService: CommentService) {}
//   @ResolveField()
//   commentsOfUser(@Parent() user: User) {
//     const { id } = user;
//     return this.commentService.getAllForUser(id);
//   }

//   @ResolveField()
//   commentsOfIdea(@Parent() idea: Idea) {
//     const { id } = idea;
//     return this.commentService.getAllForIdea(id);
//   }
// }
