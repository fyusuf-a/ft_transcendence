import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ForbiddenException,
} from '@nestjs/common';
import { FriendshipsService } from './friendships.service';
import {
  QueryFriendshipDto,
  CreateFriendshipDto,
  UpdateFriendshipDto,
  ResponseFriendshipDto,
} from '@dtos/friendships';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DeleteResult, UpdateResult } from 'typeorm';
import { PageDto } from '@dtos/pages';
import { AuthUser, User } from 'src/auth/auth-user.decorator';
import {
  CaslAbilityFactory,
  Action,
  Friendship,
} from 'src/casl/casl-ability.factory';

@ApiBearerAuth()
@ApiTags('friendships')
@Controller('friendships')
export class FriendshipsController {
  constructor(
    private readonly friendshipsService: FriendshipsService,
    private readonly abilityFactory: CaslAbilityFactory,
  ) {}

  #isUserCreator(user: User, sourceId: number) {
    if (user.id !== sourceId)
      throw new ForbiddenException(
        'You can only create friendships for yourself',
      );
  }

  @Post()
  async create(
    @AuthUser() user: User,
    @Body() createfriendshipDto: CreateFriendshipDto,
  ): Promise<ResponseFriendshipDto> {
    this.#isUserCreator(user, createfriendshipDto.sourceId);
    return await this.friendshipsService.create(createfriendshipDto);
  }

  @Post(':username')
  async createFromUsername(
    @AuthUser() user: User,
    @Param('username') username: string,
    @Body() createfriendshipDto: CreateFriendshipDto,
  ): Promise<ResponseFriendshipDto> {
    this.#isUserCreator(user, createfriendshipDto.sourceId);
    return await this.friendshipsService.createFromUsername(
      username,
      createfriendshipDto,
    );
  }

  @Get()
  findAll(
    @AuthUser() user: User,
    @Query() query?: QueryFriendshipDto,
  ): Promise<PageDto<ResponseFriendshipDto>> {
    if (user.id !== +query.sourceId && user.id !== +query.targetId) {
      throw new ForbiddenException(
        'You can only fetch friendships that concern you',
      );
    }
    return this.friendshipsService.findAll(query);
  }

  @Get(':id')
  async findOne(
    @AuthUser() user: User,
    @Param('id') id: string,
  ): Promise<ResponseFriendshipDto> {
    const friendship = await this.friendshipsService.findOne(+id);
    await this.abilityFactory.checkAbility(user, Action.Read, friendship);
    return friendship;
  }

  @Patch(':id')
  async update(
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body() updatefriendshipDto: UpdateFriendshipDto,
  ): Promise<UpdateResult> {
    await this.abilityFactory.checkAbility(user, Action.Update, Friendship, {
      id,
    });
    return this.friendshipsService.update(+id, updatefriendshipDto);
  }

  @Delete(':id')
  async remove(
    @AuthUser() user: User,
    @Param('id') id: string,
  ): Promise<DeleteResult> {
    await this.abilityFactory.checkAbility(user, Action.Delete, Friendship, {
      id,
    });
    return this.friendshipsService.remove(+id);
  }
}
