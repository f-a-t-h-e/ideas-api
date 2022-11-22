import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Logger,
  UseGuards,
  Req,
  // UsePipes,
} from '@nestjs/common';
import { IdeaService } from './idea.service';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { UpdateIdeaDto } from './dto/update-idea.dto';
import { Idea } from './entities/idea.entity';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import RequestWithUser from '../auth/types/requestWithUser.interface';
import { UserParam } from '../user/user.param.decorator';

@ApiTags('ideas')
@Controller('ideas')
export class IdeaController {
  constructor(private readonly ideaService: IdeaService) {}

  private Logger = new Logger('IdeaController');
  // private Logger = new Logger(this.constructor.name);

  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createIdeaDto: CreateIdeaDto,
    @Req() req: RequestWithUser,
  ): Promise<Idea> {
    const { user } = req;
    this.Logger.log(JSON.stringify({ user, createIdeaDto }));
    return this.ideaService.create(user, createIdeaDto);
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

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIdeaDto: UpdateIdeaDto,
    @UserParam('id') userId: string,
  ): Promise<Idea> {
    this.Logger.log(JSON.stringify({ updateIdeaDto, user: id }));
    return this.ideaService.update(userId, id, updateIdeaDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(
    @Param('id') id: string,
    @UserParam('id') userId: string,
  ): Promise<Idea> {
    return this.ideaService.remove(userId, id);
  }
}
