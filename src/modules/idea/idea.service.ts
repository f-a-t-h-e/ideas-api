import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';

import { CreateIdeaDto } from './dto/create-idea.dto';
import { UpdateIdeaDto } from './dto/update-idea.dto';
import { Idea } from './entities/idea.entity';

@Injectable()
export class IdeaService {
  constructor(
    @InjectRepository(Idea) private ideaRepository: Repository<Idea>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  /* 
    This action adds a new idea
    */

  async create(user: User, createIdeaDto: CreateIdeaDto): Promise<Idea> {
    try {
      let author = await this.userRepository.findOneBy({ id: user.id });
      author = author ? author : user;
      const idea = this.ideaRepository.create({
        ...createIdeaDto,
        author,
      });
      await this.ideaRepository.save(idea);
      return await this.findOne(idea.id);
    } catch (e) {
      throw new Error("can't create a new idea" + JSON.stringify(e));
    }
  }

  /* 
    This action returns all idea
    */
  async findAll(page = 1): Promise<any> {
    const ideas = await this.ideaRepository.find({
      order: { created_at: 'DESC', updated_at: 'DESC' },
      loadRelationIds: true,
      take: 25,
      skip: 25 * (page - 1),
    });
    if (!ideas)
      throw new HttpException('There are no ideas', HttpStatus.NOT_FOUND);
    return ideas;
  }
  /* 
    This action returns a #${id} idea
    */

  async findOne(id: string): Promise<Idea> {
    const idea = await this.ideaRepository.findOne({
      where: { id },
      relations: {
        author: true,
        up_votes: true,
        down_votes: true,
        comments: true,
      },
    });
    if (!idea)
      throw new HttpException(
        `There is no idea with this id #${id}`,
        HttpStatus.NOT_FOUND,
      );
    return idea;
  }

  async findMany(queries: Partial<CreateIdeaDto>): Promise<Idea[]> {
    const ideas = await this.ideaRepository.find({
      where: queries,
      relations: ['author'],
    });
    if (!ideas)
      throw new HttpException(
        `No ideas for these filters`,
        HttpStatus.NOT_FOUND,
      );
    return ideas;
  }

  /*
  This action updates a #${id} idea
  */
  async update(
    userId: string,
    id: string,
    updateIdeaDto: UpdateIdeaDto,
  ): Promise<Idea> {
    const idea = await this.findOne(id);

    if (!idea.author) {
      throw new NotFoundException(`Idea #${id} doesn't belong to any author`);
    }
    if (!idea.author.id) {
      throw new NotFoundException(`Idea #${id} 's author doesn't have an id`);
    }
    if (!(idea.author.id === userId)) {
      throw new NotFoundException(`You don't have access to this idea #${id}`);
    }
    await this.ideaRepository.update({ id }, updateIdeaDto);
    return this.findOne(id);
  }

  /*
  This action removes a #${id} idea
  */
  async remove(userId: string, id: string): Promise<Idea> {
    const idea = await this.findOne(id);

    if (!idea.author) {
      throw new NotFoundException(`Idea #${id} doesn't belong to any author`);
    }
    if (!idea.author.id) {
      throw new NotFoundException(`Idea #${id} 's author doesn't have an id`);
    }
    if (!(idea.author.id === userId)) {
      throw new NotFoundException(`You don't have access to this idea #${id}`);
    }
    await this.ideaRepository.delete({ id });
    return idea;
  }

  async bookmark(userId: string, id: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { bookmarks: true },
      select: { bookmarks: true },
    });
    if (!!user) {
      const idea = await this.ideaRepository.findOneBy({ id });
      if (idea) {
        user.bookmarks.push(idea);
        return await this.userRepository.save(user);
      }
      throw new NotFoundException("Couldn't find this idea");
    }
    throw new InternalServerErrorException("coodn't bookmark");
  }

  async unbookmark(userId: string, id: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: { bookmarks: true },
      select: { bookmarks: true },
    });
    if (!!user) {
      user.bookmarks = user.bookmarks.filter(idea => idea.id !== id);
      return await this.userRepository.save(user);
    }
    throw new InternalServerErrorException("coodn't unbookmark");
  }

  async upVote(userId: string, id: string) {
    const idea = await this.ideaRepository.findOne({
      select: { up_votes: true, down_votes: true },
      where: { id },
      relations: { up_votes: true, down_votes: true },
    });
    if (!!idea) {
      idea.down_votes.map(user => {
        if (user.id === userId) return undefined;
        return user;
      });
      if (idea.up_votes.filter(user => user.id === userId).length < 1) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (user) {
          idea.up_votes.push(user);
        } else {
          throw new InternalServerErrorException(
            `Couldn't UpVote, the user maybe deleted`,
          );
        }
      }
      return await this.ideaRepository.save(idea); // you don't need to return this
    }
    throw new InternalServerErrorException(
      `Couldn't UpVote, the idea maybe deleted`,
    );
  }

  async downVote(userId: string, id: string) {
    const idea = await this.ideaRepository.findOne({
      select: { up_votes: true, down_votes: true },
      where: { id },
      relations: { up_votes: true, down_votes: true },
    });
    if (!!idea) {
      idea.up_votes.map(user => {
        if (user.id === userId) return undefined;
        return user;
      });
      if (idea.down_votes.filter(user => user.id === userId).length < 1) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (user) {
          idea.down_votes.push(user);
        } else {
          throw new InternalServerErrorException(
            `Couldn't downVote, the user maybe deleted`,
          );
        }
      }
      return await this.ideaRepository.save(idea); // you don't need to return this
    }
    throw new InternalServerErrorException(
      `Couldn't downVote, the idea maybe deleted`,
    );
  }

  async unUpVote(userId: string, id: string) {
    const idea = await this.ideaRepository.findOne({
      select: { up_votes: true },
      where: { id },
      relations: { up_votes: true },
    });
    if (idea) {
      idea.up_votes = idea.up_votes.filter(user => user.id !== userId);

      return await this.ideaRepository.save(idea);
    }
    throw new InternalServerErrorException(
      `couldn't unUpVote, the idea maybe doesn't exist`,
    );
  }

  async unDownVote(userId: string, id: string) {
    const idea = await this.ideaRepository.findOne({
      select: { down_votes: true },
      where: { id },
      relations: { down_votes: true },
    });
    if (idea) {
      idea.down_votes = idea.down_votes.filter(user => user.id !== userId);
      return await this.ideaRepository.save(idea);
    }
    throw new InternalServerErrorException(`couldn't unDownVote`);
  }
}
