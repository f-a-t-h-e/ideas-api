import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Idea } from '../idea/entities/idea.entity';
import { User } from '../user/entities/user.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectRepository(Idea) private ideaRepository: Repository<Idea>,
  ) {}

  async create(idea: string, writer: User, createCommentDto: CreateCommentDto) {
    const comment = this.commentRepository.create({
      idea: { id: idea },
      writer,
      ...createCommentDto,
    });
    await this.commentRepository.save(comment);
    return await this.findOne(comment.id);
  }

  async findAll(idea: string): Promise<Comment[] | []> {
    const theIdea = await this.ideaRepository.findOne({
      where: { id: idea },
      loadEagerRelations: false,
      relations: { comments: true },
    });
    if (theIdea) {
      return theIdea.comments;
    }
    throw new NotFoundException(`Idea #${idea} is not found`);
  }

  async findOne(id: string) {
    return await this.commentRepository.findOne({
      where: { id },
      loadRelationIds: true,
    });
  }

  async update(user: string, id: string, updateCommentDto: UpdateCommentDto) {
    const comment = await this.commentRepository.update(
      { id },
      updateCommentDto,
    );
    return this.findOne(id);
  }

  async remove(user: string, id: string) {
    const comment = await this.findOne(id);
    if (comment?.writer.id === user) {
      return this.commentRepository.delete({ id });
    }
    throw new UnauthorizedException(`you have no access to this comment`);
  }
}
