import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IdeaService } from './idea.service';
import { IdeaController } from './idea.controller';
import { Idea } from './entities/idea.entity';
import { User } from '../user/entities/user.entity';
import { IdeaResolver } from './idea.resolver';
import { CommentService } from '../comment/comment.service';
import { Comment } from '../comment/entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Idea, User, Comment])],
  controllers: [IdeaController],
  providers: [IdeaService, IdeaResolver, CommentService],
})
export class IdeaModule {}
