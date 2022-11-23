import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { IdeaService } from './idea.service';
import { IdeaController } from './idea.controller';
import { Idea } from './entities/idea.entity';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Idea, User])],
  controllers: [IdeaController],
  providers: [IdeaService],
})
export class IdeaModule {}
