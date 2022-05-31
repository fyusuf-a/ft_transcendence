import { Controller, Post, Body } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Public } from './auth.public.decorator';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: LoginUserDto })
  @Public()
  @Post('login')
  async login(@Body() userDto: LoginUserDto) {
    return this.authService.login(userDto);
  }
}
