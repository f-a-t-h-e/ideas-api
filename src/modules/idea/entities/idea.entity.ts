import { ApiProperty } from '@nestjs/swagger';
import {
  // BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  // UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'ideas' })
export class Idea {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column('text')
  idea: string;

  @ApiProperty()
  @Column('text')
  description: string;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;
}
