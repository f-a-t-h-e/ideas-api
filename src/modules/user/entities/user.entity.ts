import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  static comparePassword(password0: string, password1: string): boolean {
    return bcrypt.compareSync(password0, password1);
  }

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  username: string;

  @Exclude()
  @Column({ select: false })
  password: string; // make this optional when you implement external email login

  @Column({ unique: true, select: false })
  email: string;

  @CreateDateColumn({ type: 'timestamp', name: 'ceated_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', select: false })
  updatedAt: Date;

  @BeforeInsert()
  encrypt() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
