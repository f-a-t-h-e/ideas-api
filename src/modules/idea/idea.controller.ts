import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { IdeaService } from './idea.service';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { UpdateIdeaDto } from './dto/update-idea.dto';
import { Idea } from './entities/idea.entity';
import { ClassTransformer } from 'class-transformer';

@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(ClassTransformer)
@Controller('idea')
export class IdeaController {
  constructor(private readonly ideaService: IdeaService) {}

  @Post()
  create(@Body() createIdeaDto: CreateIdeaDto) {
    return this.ideaService.create(createIdeaDto);
  }

  @Get()
  findAll() {
    return this.ideaService.findAll();
  }

  @Get(':id')
  findOneById(@Param('id') id: string): Promise<Idea | null> {
    return this.ideaService.findOne(id);
  }

  @Get()
  getMany(@Query() queries: Partial<Idea>): Promise<Idea[] | []> {
    return this.ideaService.findMany(queries);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIdeaDto: UpdateIdeaDto) {
    return this.ideaService.update(id, updateIdeaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<{ deleted: boolean } | string> {
    return this.ideaService.remove(id);
  }
}
