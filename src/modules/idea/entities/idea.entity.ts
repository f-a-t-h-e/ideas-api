import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CustomEntity } from '../../../shared/entities/id-create-update.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'ideas' })
export class Idea implements CustomEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  idea: string;

  @Column()
  description: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at', select: true })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', select: true })
  updated_at: Date;

  @ManyToOne(type => User, user => user.ideas, {
    onDelete: 'CASCADE',
    eager: true,
  })
  author: User;

  @ManyToMany(type => User, user => user.id, { cascade: true })
  @JoinTable()
  up_votes: Array<User>;

  @ManyToMany(type => User, user => user.id, { cascade: true })
  @JoinTable()
  down_votes: Array<User>;

  @OneToMany(type => Comment, comment => comment.idea, { cascade: true })
  comments: Comment[];
}
