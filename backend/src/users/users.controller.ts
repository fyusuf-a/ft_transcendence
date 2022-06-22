import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
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
import { DeleteResult, UpdateResult } from 'typeorm';
import { PageDto } from '../common/dto/page.dto';
import { PageOptionsDto } from '../common/dto/page-options.dto';
import { UserDto } from './dto/user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUserDto } from './dto/query-user.dto';
import { Public } from 'src/auth/auth.public.decorator';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AvatarUploadDto } from './dto/upload-avatar.dto';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';
import { ConfigService } from '@nestjs/config';

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
    const user: ResponseUserDto = await this.usersService.findOne(+id);
    if (user === undefined) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return user;
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
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Avatar Photo',
    type: AvatarUploadDto,
  })
  uploadAvatar(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.usersService.updateAvatar(
      +id,
      `${this.configService.get<string>('UPLOADS_PATH')}` + file.filename,
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
        'Content-Disposition': `inline; filename="avatar.${file.ext}"`,
      });
      return file.fileStream;
    } catch (error) {
      if (error instanceof EntityDoesNotExistError) {
        if (error.message === 'Avatar does not exist') {
          throw new HttpException(error.message, HttpStatus.NO_CONTENT);
        }
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
}
