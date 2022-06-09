import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';
import { UsersService } from 'src/users/users.service';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async login(userDto: LoginUserDto) {
    const userList = await this.usersService.findAll({
      username: userDto.username,
    });
    if (userList.data.length !== 1) {
      throw new EntityDoesNotExistError(`User: ${userDto.username}`);
    }
    const user = userList.data[0];
    const payload = { id: user.id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
