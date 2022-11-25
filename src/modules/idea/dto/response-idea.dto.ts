import { Comment } from '../../comment/entities/comment.entity';
import { User } from '../../user/entities/user.entity';

export class ResIdeaDto {
  id: string;
  idea: string;
  description: string;
  author: User;
  up_votes: number;
  down_votes: number;
  comments: Comment[];

  created_at: Date;
  updated_at: Date;
}
