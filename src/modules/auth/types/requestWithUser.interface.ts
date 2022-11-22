import { Request } from 'express';
import { User } from '../../user/entities/user.entity';

interface RequestWithUser extends Request {
  user: User; // remove this Partial<T> and use User after making password optional
}

export default RequestWithUser;
