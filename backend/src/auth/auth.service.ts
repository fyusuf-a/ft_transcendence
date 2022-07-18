import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from '@dtos/auth';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(userDto: LoginUserDto) {
    const user = await this.usersService.findByName(userDto.username);
    const payload = { id: user.id, username: user.username };
    return {
      id: user.id,
      access_token: this.jwtService.sign(payload),
    };
  }
}
