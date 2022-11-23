import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomEntity } from '../../../shared/entities/id-create-update.entity';
import { Idea } from '../../idea/entities/idea.entity';
import { User } from '../../user/entities/user.entity';

@Entity('comments')
export class Comment implements CustomEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(type => User, user => user.id, { onDelete: 'CASCADE' })
  writer: User;

  @ManyToOne(type => Idea, idea => idea.comments, { onDelete: 'CASCADE' })
  idea: Idea;

  @Column('text')
  content: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updated_at: Date;
}
