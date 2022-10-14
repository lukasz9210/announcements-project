import { Controller, Get, Post, Body, HttpStatus, HttpException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { get } from 'http';
import { LoginUserDto } from 'src/users/dtos/login-user.dto';
import { CreateUserDto } from 'src/users/dtos/user-create.dto';
import { AuthService, RegistrationStatus } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  public async register(@Body() createUser: CreateUserDto) {
    const result: RegistrationStatus = await this.authService.register(createUser);
    if (!result.success) {
      throw new HttpException('User creation failed', HttpStatus.BAD_REQUEST);
    }
    return result;
  }

  @Post('login')
  public async login(@Body() loginUser: LoginUserDto) {
    return await this.authService.login(loginUser);
  }

  @Get('protected')
  @UseGuards(AuthGuard())
  public protedtedRoute() {
    return 'You are in!';
  }
}
