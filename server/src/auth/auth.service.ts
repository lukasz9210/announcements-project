import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dtos/user-create.dto';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './jwt.strategy';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from 'src/users/dtos/login-user.dto';

export interface RegistrationStatus {
  success: boolean;
  message: string;
}

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  public async register(createUserDto: CreateUserDto) {
    let status: RegistrationStatus = {
      success: true,
      message: 'User registered',
    };
    try {
      await this.usersService.create(createUserDto);
    } catch (error) {
      status = {
        success: false,
        message: error.message,
      };
    }
    return status;
  }

  public async login(loginUser: LoginUserDto) {
    const user = await this.usersService.findByLogin(loginUser);

    const token = this._createToken(user);

    return {
      login: user.login,
      ...token,
    };
  }

  public async validateUser(payload: JwtPayload) {
    const user = this.usersService.findByPayload(payload);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  private _createToken({ login }: any) {
    const user: JwtPayload = { login };
    const accessToken = this.jwtService.sign(user);
    return { expiresIn: 9999999999999999999999999, accessToken }; // TODO use process.env for expiresIn
  }
}
