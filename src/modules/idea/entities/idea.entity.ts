import { Column, Entity, ManyToOne } from 'typeorm';
import { CustomEntity } from '../../../shared/entities/id-create-update.entity';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'ideas' })
export class Idea extends CustomEntity {
  @Column()
  idea: string;

  @Column()
  description: string;

  @Column({ select: true })
  updated_at: Date;

  @ManyToOne(type => User, user => user.ideas)
  author: User;
}
