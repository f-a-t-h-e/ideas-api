import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { CustomEntity } from '../../../shared/entities/id-create-update.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'ideas' })
export class Idea extends CustomEntity {
  @Column()
  idea: string;

  @Column()
  description: string;

  @ManyToOne(type => User, author => author.ideas)
  author: User;

  @ManyToMany(type => User, user => user.id, { cascade: true })
  @JoinTable()
  up_votes: Array<User>;

  @ManyToMany(type => User, user => user.id, { cascade: true })
  @JoinTable()
  down_votes: Array<User>;

  @OneToMany(type => Comment, comment => comment.idea, { cascade: true })
  comments: Array<Comment>;
}
