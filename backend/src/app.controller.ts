import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Public } from './auth/auth.public.decorator';
import { AuthService } from './auth/auth.service';
import { LoginUserDto } from './auth/dto/login-user.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
  ) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @ApiTags('auth')
  @ApiBody({ type: LoginUserDto })
  @Public()
  @Post('auth/login')
  async login(@Body() userDto: LoginUserDto) {
    return this.authService.login(userDto);
  }
}
