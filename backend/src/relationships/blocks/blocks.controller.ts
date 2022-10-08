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
import { BlocksService } from './blocks.service';
import {
  CreateBlockDto,
  UpdateBlockDto,
  ResponseBlockDto,
  QueryBlockDto,
} from '@dtos/blocks';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { DeleteResult, UpdateResult } from 'typeorm';
import {
  CaslAbilityFactory,
  Action,
  Block,
} from 'src/casl/casl-ability.factory';
import { AuthUser, User } from 'src/auth/auth-user.decorator';

@ApiBearerAuth()
@ApiTags('blocks')
@Controller('blocks')
export class BlocksController {
  constructor(
    private readonly blocksService: BlocksService,
    private readonly abilityFactory: CaslAbilityFactory,
  ) {}

  #isUserCreator(user: User, sourceId: number) {
    if (user.id !== sourceId)
      throw new ForbiddenException(
        'You can only create friendships for yourself',
      );
  }

  // TODO: remove sourceId from CreateBlockDto
  @Post()
  async create(
    @AuthUser() user: User,
    @Body() createblockDto: CreateBlockDto,
  ): Promise<ResponseBlockDto> {
    this.#isUserCreator(user, createblockDto.sourceId);
    return await this.blocksService.create(createblockDto);
  }

  @Post(':username')
  async createFromUsername(
    @AuthUser() user: User,
    @Param('username') username: string,
    @Body() createfriendshipDto: CreateBlockDto,
  ): Promise<ResponseBlockDto> {
    this.#isUserCreator(user, createfriendshipDto.sourceId);
    return await this.blocksService.createFromUsername(
      username,
      createfriendshipDto,
    );
  }

  @Get()
  findAll(
    @AuthUser() user: User,
    @Query() query?: QueryBlockDto,
  ): Promise<ResponseBlockDto[]> {
    if (user.id !== +query.sourceId) {
      throw new ForbiddenException('You can only fetch blocks that you made');
    }
    return this.blocksService.findAll(query);
  }

  @Get(':id')
  async findOne(
    @AuthUser() user: User,
    @Param('id') id: string,
  ): Promise<ResponseBlockDto> {
    const block = await this.blocksService.findOne(+id);
    await this.abilityFactory.checkAbility(user, Action.Read, block);
    return block;
  }

  @Patch(':id')
  async update(
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body() updateblockDto: UpdateBlockDto,
  ): Promise<UpdateResult> {
    await this.abilityFactory.checkAbility(user, Action.Update, Block, {
      id,
    });
    return this.blocksService.update(+id, updateblockDto);
  }

  @Delete(':id')
  async remove(
    @AuthUser() user: User,
    @Param('id') id: string,
  ): Promise<DeleteResult> {
    await this.abilityFactory.checkAbility(user, Action.Delete, Block, {
      id,
    });
    return this.blocksService.remove(+id);
  }
}
