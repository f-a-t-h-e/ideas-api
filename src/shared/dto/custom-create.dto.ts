import { IsEmpty } from 'class-validator';

export class CustomCreateDto {
  @IsEmpty()
  id: string;

  @IsEmpty()
  created_at: Date;

  @IsEmpty()
  updated_at: Date;

  @IsEmpty()
  bookmarks: any;

  @IsEmpty()
  up_votes: any;

  @IsEmpty()
  down_votes: any;
}
