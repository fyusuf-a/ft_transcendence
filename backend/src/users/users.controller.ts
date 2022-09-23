import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Response,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PageDto, PageOptionsDto } from '@dtos/pages';
import {
  UserDto,
  ResponseUserDto,
  CreateUserDto,
  UpdateUserDto,
  QueryUserDto,
} from '@dtos/users';
import { DeleteResult, EntityNotFoundError, UpdateResult } from 'typeorm';
import { Public } from 'src/auth/auth.public.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AvatarUploadDto } from '@dtos/avatars';
import { ConfigService } from '@nestjs/config';
import { ListFriendshipDto } from '@dtos/friendships';
import { ListBlockDto } from '@dtos/blocks';
import { ResponseAchievementsLogDto } from '@dtos/achievements-log';
import { RequestWithUser } from 'src/auth/types';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  @ApiBearerAuth()
  @Public()
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async whoAmI(@Req() req: RequestWithUser): Promise<ResponseUserDto> {
    if (!req.user) {
      throw new BadRequestException();
    }
    let user: ResponseUserDto;
    try {
      user = await this.usersService.findOne(req.user.id);
    } catch (error) {
      throw new BadRequestException();
    }
    return user;
  }

  @ApiBearerAuth()
  @Get()
  async findAll(
    @Query() query?: QueryUserDto,
    @Query() pageOptions?: PageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    return await this.usersService.findAll(query, pageOptions);
  }

  @Public()
  @Post()
  @ApiResponse({ status: 500, description: 'Record could not be created' })
  create(@Body() createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    return this.usersService.create(createUserDto);
  }

  @ApiBearerAuth()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiBearerAuth()
  @Get(':id')
  @ApiResponse({ status: 404, description: 'Record not found' })
  async findOne(@Param('id') id: string): Promise<ResponseUserDto> {
    try {
      return await this.usersService.findOne(+id);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException('Not Found');
      }
    }
  }

  @ApiBearerAuth()
  @Get('/name/:username')
  @ApiResponse({ status: 404, description: 'Record not found' })
  async findOneByUsername(
    @Param('username') username: string,
  ): Promise<ResponseUserDto> {
    try {
      return await this.usersService.findByName(username);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new NotFoundException('Not Found');
      }
    }
  }

  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.usersService.remove(+id);
  }

  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Missing or Invalid File' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Avatar Photo',
    type: AvatarUploadDto,
  })
  uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (
      !file ||
      !file.filename ||
      !this.usersService.verifyMagicNum(file.path)
    ) {
      throw new BadRequestException('Missing or Invalid File');
    }
    return this.usersService.updateAvatar(
      +id,
      this.configService.get<string>('UPLOADS_PATH') + file.filename,
    );
  }

  @Get(':id/avatar')
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 204, description: 'No avatar found' })
  @ApiResponse({ status: 400, description: 'User does not exist' })
  async getAvatar(
    @Param('id') id: string,
    @Response({ passthrough: true }) res,
  ): Promise<StreamableFile> {
    try {
      const file = await this.usersService.getAvatar(+id);
      res.set({
        'Content-Type': `image/${file.ext}`,
        'Content-Disposition': `inline`,
      });
      return file.fileStream;
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new HttpException(error.message, HttpStatus.NO_CONTENT);
      }
      throw new BadRequestException(error.message);
    }
  }

  @ApiBearerAuth()
  @Get('/:id/friendships')
  async findFriendships(@Param('id') id: string): Promise<ListFriendshipDto[]> {
    return await this.usersService.findFriendships(+id, 1);
  }

  @ApiBearerAuth()
  @Get('/:id/friendships/invites')
  findFriendRequests(@Param('id') id: string): Promise<ListFriendshipDto[]> {
    return this.usersService.findFriendships(+id, 0);
  }

  @ApiBearerAuth()
  @Get('/:id/blocks')
  async findBlocks(@Param('id') id: string): Promise<ListBlockDto[]> {
    return await this.usersService.findBlocks(+id);
  }

  @ApiBearerAuth()
  @Get('/:id/achievements')
  findUnlockedAchievements(
    @Param('id') id: string,
  ): Promise<ResponseAchievementsLogDto[]> {
    return this.usersService.findUnlockedAchievements(+id);
  }
}
