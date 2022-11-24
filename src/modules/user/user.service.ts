import {
  NotFoundException,
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async getByEmail(email: string) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where({ email })
      .addSelect('user.password')
      .getOne();
    if (user) {
      return user;
    }
    return null;
    // throw new NotFoundException('User with this email does not exist'); // We will make it secret
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

  /* 
    This action adds a new user
    */

  async register(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.userRepository.create(createUserDto);
      return await this.userRepository.save(user);
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

  /* 
    This action returns all user
    */
  async findAll(page = 1): Promise<User[]> {
    const users = await this.userRepository.find({
      order: { username: 'ASC', id: 'DESC' },
      take: 10,
      skip: 10 * (page - 1),
    });

    if (users.length === 0) throw new NotFoundException('There are no users');

    return users;
  }
  /* 
    This action returns a #${id} user
    */

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { ideas: true },
    });

    if (!user)
      throw new NotFoundException(`There is no user with this id #${id}`);

    return user;
  }

  async findMany(queries: UpdateUserDto): Promise<User[]> {
    const users = await this.userRepository.find({
      where: queries,
      order: { username: 'ASC', id: 'DESC' },
    });
    if (users.length === 0)
      throw new NotFoundException(`No users for these filters`);
    return users;
  }

  /*
  This action updates a #${id} user
  */
  async update(id: string, updateuserDto: UpdateUserDto): Promise<User> {
    await this.findOne(id);
    await this.userRepository.update({ id }, updateuserDto);
    return this.findOne(id);
  }

  /*
  This action removes a #${id} user
  */
  async remove(id: string): Promise<User> {
    const user = await this.findOne(id);
    await this.userRepository.delete({ id });
    return user;
  }
}
