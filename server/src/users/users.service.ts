import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/user-create.dto';
import { User } from './entities/user.entity';
import { comparePasswords } from '../shared/utils';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  public getAll() {
    return this.userRepository.find();
  }

  public async create(createUserDto: CreateUserDto) {
    const { login, password } = createUserDto;
    const userInDB = await this.userRepository.findOne({ where: { login } });
    if (userInDB) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userRepository.create({ login, password });
    await this.userRepository.save(user);
    return user;
  }

  public async findOne(options: object) {
    const user = await this.userRepository.findOne(options);
    return user;
  }

  public async findByLogin({ login, password }) {
    const user = await this.userRepository.findOne({ where: { login } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }

    const areEqual = await comparePasswords(user.password, password);
    if (!areEqual) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return user; // TODO - użyć mappera i zwrócić bez hasła!!
  }

  public async findByPayload({ login }) {
    return await this.userRepository.findOne({ where: { login } });
  }
}
