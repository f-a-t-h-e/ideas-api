import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { CommentService } from '../comment/comment.service';
import { IdeaService } from '../idea/idea.service';
import { Idea } from '../idea/entities/idea.entity';
import { Comment } from '../comment/entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Comment, Idea])],
  controllers: [UserController],
  providers: [UserService, UserResolver, CommentService, IdeaService],
  exports: [UserService],
})
export class UserModule {}
