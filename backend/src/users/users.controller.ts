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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
  ApiExcludeEndpoint,
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
import { IfAuthIsDisabled } from 'src/auth/if-auth-is-disabled.decorator';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AvatarUploadDto } from '@dtos/avatars';
import { ConfigService } from '@nestjs/config';
import { ListFriendshipDto } from '@dtos/friendships';
import { ListBlockDto } from '@dtos/blocks';
import { ResponseAchievementsLogDto } from '@dtos/achievements-log';
import { ResponseMatchDto } from 'src/dtos/matches';
import { AuthUser } from 'src/auth/auth-user.decorator';
import {
  CaslAbilityFactory,
  Action,
  User,
} from 'src/casl/casl-ability.factory';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly abilityFactory: CaslAbilityFactory,
  ) {}

  @Public()
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  async whoAmI(@AuthUser() user: User): Promise<ResponseUserDto> {
    await this.abilityFactory.checkAbility(user, Action.Read, user);
    return user;
  }

  @Get()
  async findAll(
    @AuthUser() user: User,
    @Query() query?: QueryUserDto,
    @Query() pageOptions?: PageOptionsDto,
  ): Promise<PageDto<UserDto>> {
    await this.abilityFactory.checkAbility(user, Action.Read, User);
    return await this.usersService.findAll(query, pageOptions);
  }

  @ApiExcludeEndpoint(process.env.DISABLE_AUTHENTICATION === 'false')
  @Post('fake-create')
  @Public()
  @IfAuthIsDisabled()
  @ApiResponse({ status: 500, description: 'Record could not be created' })
  async fakeCreate(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseUserDto> {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  async update(
    @AuthUser() user: User,
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    await this.abilityFactory.checkAbility(user, Action.Update, User, { id });
    if (updateUserDto.username !== '') {
      try {
        const result = await this.usersService.update(id, updateUserDto);
        return result;
      } catch (err) {
        const response: any = {
          message: 'Username already exists',
          status: HttpStatus.FORBIDDEN,
        };
        const suggestedUsername = await this.usersService.suggestUsername(
          updateUserDto.username,
        );
        if (suggestedUsername) {
          response.suggestedUsername = suggestedUsername;
        }
        throw new HttpException(response, HttpStatus.FORBIDDEN);
      }
    }
    throw new BadRequestException('Invalid request');
  }

  @Get(':id')
  @ApiResponse({ status: 404, description: 'Record not found' })
  async findOne(
    @AuthUser() user: User,
    @Param('id') id: number,
  ): Promise<ResponseUserDto> {
    await this.abilityFactory.checkAbility(user, Action.Read, User, { id });
    return await this.usersService.findOne(+id);
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
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      }
    }
  }

  @Delete(':id')
  async remove(
    @AuthUser() user: User,
    @Param('id') id: number,
  ): Promise<DeleteResult> {
    await this.abilityFactory.checkAbility(user, Action.Delete, User, { id });
    return this.usersService.remove(+id);
  }

  @Post(':id/avatar')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ status: 201, description: 'Success' })
  @ApiResponse({ status: 400, description: 'Missing or Invalid File' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Avatar Photo',
    type: AvatarUploadDto,
  })
  async uploadAvatar(
    @AuthUser() user: User,
    @Param('id') id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    await this.abilityFactory.checkAbility(user, Action.Update, User, { id });
    if (!file || !file.filename) throw new BadRequestException('Missing file');
    if (!this.usersService.verifyMagicNum(file.path)) {
      throw new BadRequestException(
        'Invalid file: only .gif, .png or .jpg allowed',
      );
    }
    return this.usersService.updateAvatar(
      +id,
      this.configService.get<string>('UPLOADS_PATH') + file.filename,
    );
  }

  @Get(':id/avatar')
  @ApiResponse({ status: 200, description: 'Success' })
  @ApiResponse({ status: 204, description: 'No avatar found' })
  @ApiResponse({ status: 400, description: 'User does not exist' })
  async getAvatar(
    @AuthUser() user: User,
    @Param('id') id: number,
    @Response({ passthrough: true }) res,
  ): Promise<StreamableFile> {
    await this.abilityFactory.checkAbility(user, Action.Read, User, { id });
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

  @Get('/:id/friendships')
  async findFriendships(
    @AuthUser() user: User,
    @Param('id') id: number,
  ): Promise<ListFriendshipDto[]> {
    await this.abilityFactory.checkAbility(user, Action.Read, User, { id });
    return await this.usersService.findFriendships(+id, 1);
  }

  @Get('/:id/friendships/invites')
  async findFriendRequests(
    @AuthUser() user: User,
    @Param('id') id: string,
  ): Promise<ListFriendshipDto[]> {
    await this.abilityFactory.checkAbility(user, Action.Read, User, { id });
    return this.usersService.findFriendships(+id, 0);
  }

  @Get('/:id/blocks')
  async findBlocks(
    @AuthUser() user: User,
    @Param('id') id: string,
  ): Promise<ListBlockDto[]> {
    await this.abilityFactory.checkAbility(user, Action.Read, User, { id });
    return this.usersService.findBlocks(+id);
  }

  @Get('/:id/achievements')
  async findUnlockedAchievements(
    @AuthUser() user: User,
    @Param('id') id: string,
  ): Promise<ResponseAchievementsLogDto[]> {
    await this.abilityFactory.checkAbility(user, Action.Read, User, { id });
    return this.usersService.findUnlockedAchievements(+id);
  }

  @Get('/:id/matches')
  async findPlayedMatches(
    @AuthUser() user: User,
    @Param('id') id: string,
  ): Promise<ResponseMatchDto[]> {
    await this.abilityFactory.checkAbility(user, Action.Read, User, { id });
    return this.usersService.findMatches(+id);
  }
}
