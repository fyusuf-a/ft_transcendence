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
  Response,
  StreamableFile,
  UploadedFile,
  UseInterceptors,
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
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AvatarUploadDto } from '@dtos/avatars';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';
import { ConfigService } from '@nestjs/config';
import { ResponseFriendshipDto } from '@dtos/friendships';
import { ResponseBlockDto } from '@dtos/blocks';
import { ResponseAchievementsLogDto } from '@dtos/achievements-log';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

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
    if (!file || !file.filename) {
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
      if (
        error instanceof EntityDoesNotExistError &&
        error.message === 'Avatar does not exist'
      ) {
        throw new HttpException(error.message, HttpStatus.NO_CONTENT);
      }
      throw new BadRequestException(error.message);
    }
  }

  @ApiBearerAuth()
  @Get('/:id/friendships')
  findFriendships(@Param('id') id: string): Promise<ResponseFriendshipDto[]> {
    return this.usersService.findFriendships(+id);
  }

  @ApiBearerAuth()
  @Get('/:id/friendships/invites')
  findFriendRequests(
    @Param('id') id: string,
  ): Promise<ResponseFriendshipDto[]> {
    return this.usersService.findFriendRequests(+id);
  }

  @ApiBearerAuth()
  @Get('/:id/blocks')
  findBlocks(@Param('id') id: string): Promise<ResponseBlockDto[]> {
    return this.usersService.findBlocks(+id);
  }

  @ApiBearerAuth()
  @Get('/:id/achievements')
  findUnlockedAchievements(
    @Param('id') id: string,
  ): Promise<ResponseAchievementsLogDto[]> {
    return this.usersService.findUnlockedAchievements(+id);
  }
}
