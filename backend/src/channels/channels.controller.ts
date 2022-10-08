import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PageDto, PageOptionsDto } from '@dtos/pages';
import {
  ResponseChannelDto,
  CreateChannelDto,
  UpdateChannelDto,
  QueryChannelDto,
} from '@dtos/channels';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ChannelsService } from './channels.service';
import { AuthUser, User } from 'src/auth/auth-user.decorator';
import { Channel, ChannelType } from './entities/channel.entity';
import { CaslAbilityFactory, Action } from 'src/casl/casl-ability.factory';
import { MembershipsService } from 'src/memberships/memberships.service';
import { MembershipRoleType } from 'src/memberships/entities/membership.entity';
import { EntityNotFoundError } from 'typeorm';

@ApiBearerAuth()
@ApiTags('channels')
@Controller('channels')
export class ChannelsController {
  constructor(
    private readonly channelsService: ChannelsService,
    private readonly membershipsService: MembershipsService,
    private readonly abilityFactory: CaslAbilityFactory,
  ) {}

  @ApiBody({ type: CreateChannelDto })
  @Post()
  async create(
    @AuthUser() user: User,
    @Body() createChannelDto: CreateChannelDto,
  ): Promise<ResponseChannelDto> {
    await this.abilityFactory.checkAbility(user, Action.Create, Channel);
    let ret: ResponseChannelDto;

    try {
      ret = await this.channelsService.create(createChannelDto);
    } catch (err: any) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }

    return ret;
  }

  // TODO: ignore the PRIVATE and DIRECT channels
  @Get()
  async findAll(
    @AuthUser() user: User,
    @Query() query?: QueryChannelDto,
    @Query() pageOptions?: PageOptionsDto,
  ): Promise<PageDto<ResponseChannelDto>> {
    await this.abilityFactory.checkAbility(user, Action.Read, Channel);
    return await this.channelsService.findAll(query, pageOptions);
  }

  @Get(':id')
  @ApiNotFoundResponse({ description: 'Channel Not Found' })
  async findOne(
    @AuthUser() user: User,
    @Param('id') id: string,
  ): Promise<ResponseChannelDto> {
    const channel = await this.channelsService.findOne(+id);
    if (
      channel.type === ChannelType.PRIVATE ||
      channel.type === ChannelType.DIRECT
    ) {
      try {
        await this.membershipsService.isUserCapableInChannel(user, id, {
          banned: undefined,
          muted: undefined,
        });
      } catch (e) {
        throw new EntityNotFoundError(Channel, '');
      }
    }
    const ret: ResponseChannelDto = {
      id: channel.id,
      type: channel.type,
      name: channel.name,
    };
    return ret;
  }

  @Patch(':id')
  update(
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body() updateChannelDto: UpdateChannelDto,
  ): Promise<UpdateResult> {
    this.membershipsService.hasUserRoleInChannel(
      user,
      MembershipRoleType.OWNER,
      id,
    );
    return this.channelsService.update(+id, updateChannelDto);
  }

  @Delete(':id')
  remove(
    @AuthUser() user: User,
    @Param('id') id: string,
  ): Promise<DeleteResult> {
    this.membershipsService.hasUserRoleInChannel(
      user,
      MembershipRoleType.OWNER,
      id,
    );
    return this.channelsService.remove(+id);
  }
}
