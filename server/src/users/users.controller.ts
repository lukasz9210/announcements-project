import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dtos/user-create.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  public getAll() {
    return this.usersService.getAll();
  }

  @Post()
  public create(@Body() createUser: CreateUserDto) {
    return this.usersService.create(createUser);
  }
}
