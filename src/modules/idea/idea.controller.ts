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
  // UsePipes,
} from '@nestjs/common';
import { IdeaService } from './idea.service';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { UpdateIdeaDto } from './dto/update-idea.dto';
import { Idea } from './entities/idea.entity';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserParam } from '../user/user.param.decorator';

@Controller('api/v1/ideas')
export class IdeaController {
  constructor(private readonly ideaService: IdeaService) {}

  private Logger = function (data: unknown) {
    Logger.log('IdeaController', JSON.stringify(data));
  };
  // private Logger = new Logger(this.constructor.name);

  @ApiTags('ideas')
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() createIdeaDto: CreateIdeaDto,
    @UserParam() user: any,
  ): Promise<Idea> {
    this.Logger({ username: user.username, createIdeaDto });
    console.log(user);

    return this.ideaService.create(user, createIdeaDto);
  }

  @ApiTags('ideas')
  @Get()
  findAll(@Query('page') page: number) {
    return this.ideaService.findAll(page);
  }

  @ApiTags('ideas')
  @Get(':id')
  findOneById(@Param('id') id: string): Promise<Idea> {
    return this.ideaService.findOne(id);
  }

  @ApiTags('ideas')
  @Get()
  getMany(@Query() queries: Partial<Idea>): Promise<Idea[]> {
    return this.ideaService.findMany(queries);
  }

  @ApiTags('ideas')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateIdeaDto: UpdateIdeaDto,
    @UserParam() user: any,
  ): Promise<Idea> {
    const { id: userId } = user;
    this.Logger({ updateIdeaDto, user: user });
    return this.ideaService.update(userId, id, updateIdeaDto);
  }

  @ApiTags('ideas')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @UserParam() user: any): Promise<Idea> {
    const { id: userId } = user;
    return this.ideaService.remove(userId, id);
  }

  @ApiTags('reactions')
  @Post(':id/bookmark')
  @UseGuards(JwtAuthGuard)
  bookmarkIdea(@Param('id') id: string, @UserParam() user: any) {
    const { id: userId } = user;
    this.Logger({ id, userId });
    return this.ideaService.bookmark(userId, id);
  }

  @ApiTags('reactions')
  @Delete(':id/bookmark')
  @UseGuards(JwtAuthGuard)
  unbookmarkIdea(@Param('id') id: string, @UserParam() user: any) {
    const { id: userId } = user;
    this.Logger({ id, userId });
    return this.ideaService.bookmark(userId, id);
  }

  @ApiTags('reactions')
  @Post(':id/upv_ote')
  @UseGuards(JwtAuthGuard)
  upVoteIdea(@Param('id') id: string, @UserParam() user: any) {
    const { id: userId } = user;
    this.Logger({ id, userId });
    return this.ideaService.upVote(userId, id);
  }

  @ApiTags('reactions')
  @Delete(':id/upv_ote')
  @UseGuards(JwtAuthGuard)
  unUpVoteIdea(@Param('id') id: string, @UserParam() user: any) {
    const { id: userId } = user;
    this.Logger({ id, userId });
    return this.ideaService.unUpVote(userId, id);
  }

  @ApiTags('reactions')
  @Post(':id/down_vote')
  @UseGuards(JwtAuthGuard)
  downVoteIdea(@Param('id') id: string, @UserParam() user: any) {
    const { id: userId } = user;
    this.Logger({ id, userId });
    return this.ideaService.downVote(userId, id);
  }

  @ApiTags('reactions')
  @Delete(':id/down_vote')
  @UseGuards(JwtAuthGuard)
  unDownVoteIdea(@Param('id') id: string, @UserParam() user: any) {
    const { id: userId } = user;
    this.Logger({ id, userId });
    return this.ideaService.unDownVote(userId, id);
  }
}
