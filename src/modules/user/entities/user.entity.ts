import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';

import { CustomEntity } from '../../../shared/entities/id-create-update.entity';
import { Idea } from '../../idea/entities/idea.entity';

@Entity('users')
export class User extends CustomEntity {
  static comparePassword(password0: string, password1: string): boolean {
    return bcrypt.compareSync(password0, password1);
  }

  @Column()
  username: string;

  @Exclude()
  @Column({ select: false })
  password: string; // make this optional when you implement external email login

  @Column({ unique: true, select: false })
  email: string;

  @OneToMany(type => Idea, idea => idea.author)
  ideas: Array<Idea>;

  @BeforeInsert()
  encrypt() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
