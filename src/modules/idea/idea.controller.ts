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
  Logger,
  // UsePipes,
} from '@nestjs/common';
import { IdeaService } from './idea.service';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { UpdateIdeaDto } from './dto/update-idea.dto';
import { Idea } from './entities/idea.entity';

@Controller('idea')
export class IdeaController {
  constructor(private readonly ideaService: IdeaService) {}

  private Logger = new Logger('IdeaController');
  // private Logger = new Logger(this.constructor.name);

  @Post()
  create(@Body() createIdeaDto: CreateIdeaDto): Promise<Idea> {
    this.Logger.log(JSON.stringify(createIdeaDto));
    return this.ideaService.create(createIdeaDto);
  }

  @Get()
  findAll() {
    return this.ideaService.findAll();
  }

  @Get(':id')
  findOneById(@Param('id') id: string): Promise<Idea> {
    return this.ideaService.findOne(id);
  }

  @Get()
  getMany(@Query() queries: Partial<Idea>): Promise<Idea[]> {
    return this.ideaService.findMany(queries);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIdeaDto: UpdateIdeaDto,
  ): Promise<Idea> {
    this.Logger.log(JSON.stringify(updateIdeaDto));
    return this.ideaService.update(id, updateIdeaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Idea> {
    return this.ideaService.remove(id);
  }
}
