import {
  HttpException,
  HttpStatus,
  Injectable,
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
  ) {}

  /* 
    This action adds a new idea
    */

  async create(user: User, createIdeaDto: CreateIdeaDto): Promise<Idea> {
    try {
      const idea = this.ideaRepository.create({
        ...createIdeaDto,
        author: user,
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
  async findAll(): Promise<Idea[]> {
    const ideas = await this.ideaRepository.find({ relations: ['author'] });
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
      relations: ['author'],
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
}
