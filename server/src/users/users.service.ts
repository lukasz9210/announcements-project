import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/user-create.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  public getAll() {
    return this.userRepository.find();
  }

  public async create(createUserDto: CreateUserDto) {
    const { login, password } = createUserDto;
    const user = await this.userRepository.create({ login, password });
    await this.userRepository.save(user);
    return user;
  }
}
