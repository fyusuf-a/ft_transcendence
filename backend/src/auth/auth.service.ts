import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(userDto: LoginUserDto) {
    const users = await this.usersService.findAll({
      username: userDto.username,
    });
    if (users.length === 1) {
      const payload = { username: users[0].username };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    throw new UnauthorizedException(`Could not log in as ${userDto.username}`);
  }
}
