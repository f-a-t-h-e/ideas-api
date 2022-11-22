import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class CustomEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp', name: 'ceated_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at', select: false })
  updated_at: Date;
}
