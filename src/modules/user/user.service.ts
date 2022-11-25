import {
  NotFoundException,
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import RegisterDto from '../auth/dto/register.dto';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getOneBy(condition: Partial<UpdateUserDto>): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { ...condition },
      select: [
        'id',
        'email',
        'username',
        'created_at',
        'updated_at',
        'password',
        'bookmarks',
      ],
    });
    return user;
  }

  /*
   * This is for login
   */
  // async login({ email, password }: LoginDto): Promise<'token'> {
  //   const user = await this.userRepository
  //     .createQueryBuilder('user')
  //     .where({ email })
  //     .addSelect('user.password')
  //     .getOne();

  //   if (!user) {
  //     throw new NotFoundException(`No user found for email: ${email}`); // Send "Wrong credentials provided"
  //   }
  //   if (!User.comparePassword(password, user.password)) {
  //     // Send "Wrong credentials provided"
  //     throw new BadRequestException('Invalid password');
  //   } // To secure "brute-forcing" attacks
  //   return 'token';
  // }

  async register(createUserDto: CreateUserDto | RegisterDto): Promise<User> {
    try {
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);
      return await this.findOne(user.id);
    } catch (e) {
      /**
       * enum PostgresErrorCode {
       * UniqueViolation = '23505'
       * }
       */
      // if (e?.code === PostgresErrorCode.UniqueViolation) {
      if (e.code && e.code === '23505') {
        throw new ConflictException(
          `Email ${createUserDto.email} already used.`,
        );
      }

      throw new Error(e);
    }
  }

  async findAll(page = 1): Promise<User[]> {
    const users = await this.userRepository.find({
      order: { username: 'ASC', id: 'DESC' },
      take: 10,
      skip: 10 * (page - 1),
      relations: { ideas: true, comments: true, bookmarks: true },
    });

    if (users.length === 0) throw new NotFoundException('There are no users');

    return users;
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      select: ['id', 'username', 'created_at'],
    });

    if (!user)
      throw new NotFoundException(`There is no user with this id #${id}`);

    return user;
  }

  async read(username: string) {
    return this.userRepository.findOne({
      where: { username },
      relations: ['ideas', 'bookmarks', 'comments'],
    });
  }

  async findMany(queries: UpdateUserDto): Promise<User[]> {
    const users = await this.userRepository.find({
      where: queries,
      order: { username: 'ASC', id: 'DESC' },
      select: ['id', 'username', 'created_at'],
    });
    if (users.length === 0)
      throw new NotFoundException(`No users for these filters`);
    return users;
  }

  async update(id: string, updateuserDto: UpdateUserDto): Promise<User> {
    await this.findOne(id);
    await this.userRepository.update({ id }, updateuserDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<User> {
    const user = await this.findOne(id);
    await this.userRepository.delete({ id });
    return user;
  }
}
