import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async findUserFromMarvinId(marvinId: string): Promise<any> {
    try {
      return await this.usersService.findByMarvinId(marvinId);
    } catch {
      throw new UnauthorizedException();
    }
  }
}
