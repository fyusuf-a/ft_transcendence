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
    try {
      const user = await this.usersService.findByName(userDto.username);
      const payload = { id: user.id, username: user.username };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (EntityNotFoundError) {
      throw new UnauthorizedException('Username is incorrect');
    }
  }
}
