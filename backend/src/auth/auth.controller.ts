import { Controller, Post, Body, Get, Res } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Public } from './auth.public.decorator';
import { AuthService } from './auth.service';
import { LoginUserDto } from '@dtos/auth';
import { UnauthorizedException } from '@nestjs/common';
import { get } from 'http';
import { Response } from '@nestjs/common';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  // constructor(private authService: AuthService) {}

  // @ApiBody({ type: LoginUserDto })
  // @Public()
  // @Post('login')
  // async login(@Body() userDto: LoginUserDto) {
  //   try {
  //     return await this.authService.login(userDto);
  //   } catch (EntityNotFoundError) {
  //     throw new UnauthorizedException('Username is incorrect');
  //   }
  // }

    

  /*
  * This is the road the user will visit to authenticate
  */

  @Get('login')
  login() {
    return;
  }

  /*
  * This is the redirect url the oauth2 provider will call
  */

  @Get('redirect')
  redirect(@Res() res: Response) {
    res.send(200);
  }

  /*
  * Retrieve the auth status
  */

  @Get('status')
  status() { }

  /*
  * Logging the user out
  */

  @Get('logout')
  logout() { }
}
