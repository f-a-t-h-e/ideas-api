import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  async create(createIdeaDto: CreateIdeaDto): Promise<Idea> {
    const idea = this.ideaRepository.create(createIdeaDto);
    return await this.ideaRepository.save(idea);
  }

  /* 
    This action returns all idea
    */
  async findAll(): Promise<Idea[]> {
    const ideas = await this.ideaRepository.find();
    if (!ideas)
      throw new HttpException('There are no ideas', HttpStatus.NOT_FOUND);
    return ideas;
  }
  /* 
    This action returns a #${id} idea
    */

  async findOne(id: string): Promise<Idea> {
    const idea = await this.ideaRepository.findOne({ where: { id } });
    if (!idea)
      throw new HttpException(
        `There is no idea with this id #${id}`,
        HttpStatus.NOT_FOUND,
      );
    return idea;
  }

  async findMany(queries: Partial<Idea>): Promise<Idea[]> {
    const ideas = await this.ideaRepository.find({ where: queries });
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
  async update(id: string, updateIdeaDto: UpdateIdeaDto): Promise<Idea> {
    await this.findOne(id);
    await this.ideaRepository.update({ id }, updateIdeaDto);
    return this.findOne(id);
  }

  /*
  This action removes a #${id} idea
  */
  async remove(id: string): Promise<Idea> {
    const idea = await this.findOne(id);
    await this.ideaRepository.delete({ id });
    return idea;
  }
}
