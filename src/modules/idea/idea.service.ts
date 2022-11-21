import { Injectable } from '@nestjs/common';
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
    return await this.ideaRepository.find();
  }
  /* 
    This action returns a #${id} idea
    */

  async findOne(id: string): Promise<Idea | null> {
    return await this.ideaRepository.findOneBy({ id });
  }

  async findMany(queries: Partial<Idea>): Promise<Idea[]> {
    return await this.ideaRepository.find({ where: queries });
  }

  /*
  This action updates a #${id} idea
  */
  async update(
    id: string,
    updateIdeaDto: UpdateIdeaDto,
  ): Promise<Idea | null | string> {
    if ((await this.findOne(id)) === null)
      return `The idea #${id} doesn't exist`;
    await this.ideaRepository.update({ id }, updateIdeaDto);
    return this.findOne(id);
  }

  /*
  This action removes a #${id} idea
  */
  async remove(id: string): Promise<{ deleted: boolean } | string> {
    if ((await this.findOne(id)) === null)
      return `The idea #${id} is deleted already`;
    await this.ideaRepository.delete({ id });
    return { deleted: true };
  }
}
