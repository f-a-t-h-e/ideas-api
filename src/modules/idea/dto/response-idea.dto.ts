import { User } from '../../user/entities/user.entity';

export class ResIdeaDto {
  id: string;
  idea: string;
  description: string;
  author: User;
  up_votes: number;
  down_votes: number;
  comments: number;

  created_at: Date;
  updated_at: Date;
}
