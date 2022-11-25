import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Idea } from '../idea/entities/idea.entity';
import { User } from '../user/entities/user.entity';
// import { CommentResolver } from './comment.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Idea, User])],
  controllers: [CommentController],
  providers: [CommentService /*, CommentResolver*/],
  exports: [CommentService],
})
export class CommentModule {}
