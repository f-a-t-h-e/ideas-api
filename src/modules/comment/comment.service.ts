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
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(
    idea: string,
    theUser: User,
    createCommentDto: CreateCommentDto,
  ) {
    const user = await this.userRepository.findOneBy({ id: theUser.id });
    const writer = user ? user : theUser;
    const comment = this.commentRepository.create({
      idea: { id: idea },
      writer,
      ...createCommentDto,
    });
    await this.commentRepository.save(comment);
    return await this.findOne(comment.id);
  }

  async getAllForIdea(idea: string, page = 1): Promise<Comment[] | []> {
    const theIdea = await this.ideaRepository.findOne({
      order: { comments: { created_at: 'DESC', updated_at: 'DESC' } },
      where: { id: idea },
      loadEagerRelations: false,
      relations: { comments: true },
      select: ['comments'],
    });

    if (theIdea) {
      return theIdea.comments.slice(25 * (page - 1), 25 * page);
    }
    return [];
  }

  async getAllForUser(user: string, page = 1): Promise<Comment[] | []> {
    // const userComments = await this.userRepository
    //   .createQueryBuilder('users')
    //   .loadAllRelationIds()
    //   .where({ id: user })
    //   .leftJoinAndSelect(
    //     qb =>
    //       qb
    //         .select()
    //         .from('comments', 'r')
    //         .where({ writer: user })
    //         .orderBy({ 'r.created_at': 'DESC' })
    //         .limit(5),
    //     'comments',
    //     '"comments"."id" = ANY("users"."comments")',
    //   )
    //   .getOne();
    // console.log(userComments);

    // if (userComments) return userComments.comments;
    // return [];
    const userComments = await this.userRepository.findOne({
      order: { comments: { created_at: 'DESC', updated_at: 'DESC' } },
      where: { id: user },
      loadEagerRelations: false,
      relations: { comments: true },
      select: ['comments'],
    });

    if (userComments) {
      return userComments.comments.slice(25 * (page - 1), 25 * page);
    }
    return [];
  }

  async findOne(id: string) {
    return await this.commentRepository.findOne({
      where: { id },
      loadRelationIds: true,
    });
  }

  async update(user: string, id: string, updateCommentDto: UpdateCommentDto) {
    await this.commentRepository.update({ id }, updateCommentDto);
    return this.findOne(id);
  }

  async remove(user: string, id: string) {
    const comment = await this.commentRepository.findOne({
      where: { id, writer: { id: user } },
    });
    if (comment) {
      this.commentRepository.delete({ id });
      return comment;
    }
    throw new UnauthorizedException(`you have no access to this comment`);
  }

  async getLatest(page = 1) {
    return await this.userRepository.find({
      order: { created_at: 'DESC', updated_at: 'DESC' },
      take: 25,
      skip: 25 * (page - 1),
    });
  }
}
