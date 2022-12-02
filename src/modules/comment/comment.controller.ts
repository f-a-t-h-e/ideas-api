import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserParam } from '../user/user.param.decorator';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('comments')
@Controller('api/v1/')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('ideas/:idea/comment')
  create(
    @Param('idea') idea: string,
    @UserParam() user: any,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return this.commentService.create({
      idea,
      theUser: user,
      content: createCommentDto.content,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete('comment/:comment')
  remove(@Param('comment') id: string, @UserParam() user: any) {
    return this.commentService.remove(user.id, id);
  }

  @Get('ideas/:idea/comments')
  getCommentsByIdea(@Param('idea') idea: string, @Query('page') page: number) {
    return this.commentService.getAllForIdea(idea, page);
  }

  @Get('users/:user/comments')
  getCommentsByUser(@Param('user') user: string, @Query('page') page: number) {
    return this.commentService.getAllForUser(user, page);
  }

  @Get('comment/:id')
  getOneComment(@Param('id') id: string) {
    return this.commentService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('comment/:id')
  update(
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @UserParam() user: any,
  ) {
    return this.commentService.update(user.id, id, updateCommentDto);
  }
}
