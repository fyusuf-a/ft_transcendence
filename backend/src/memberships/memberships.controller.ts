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
import { MembershipsService } from './memberships.service';
import {
  UpdateMembershipDto,
  CreateMembershipDto,
  ResponseMembershipDto,
  QueryMembershipDto,
  MembershipRoleType,
} from '@dtos/memberships';
import { ApiBearerAuth, ApiTags, ApiExcludeEndpoint } from '@nestjs/swagger';
import { ChannelType } from 'src/channels/entities/channel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityNotFoundError, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Channel } from 'src/channels/entities/channel.entity';

@ApiBearerAuth()
@ApiTags('channel memberships')
@Controller('memberships')
export class MembershipsController {
  constructor(
    private readonly membershipsService: MembershipsService,
    @InjectRepository(Channel)
    private channelsRepository: Repository<Channel>,
  ) {}

  @Post()
  async create(
    @AuthUser() user: User,
    @Body() createMembershipDto: CreateMembershipDto,
  ): Promise<ResponseMembershipDto> {
    if (createMembershipDto.role === MembershipRoleType.OWNER)
      throw new ForbiddenException('Cannot create a new owner');
    if (createMembershipDto.role === MembershipRoleType.ADMIN) {
      await this.membershipsService.hasUserRoleInChannel(
        user,
        MembershipRoleType.OWNER,
        createMembershipDto.channelId.toString(),
      );
    }
    const channel = await this.channelsRepository.findOneByOrFail({
      id: createMembershipDto.channelId,
    });
    if (channel.type === ChannelType.PRIVATE)
      await this.membershipsService.isUserAtLeastAdmin(
        user,
        createMembershipDto.channelId.toString(),
      );
    if (channel.type === ChannelType.PROTECTED) {
      if (!createMembershipDto.password)
        throw new ForbiddenException(
          'Password is required for protected channels',
        );
      if (!bcrypt.compare(createMembershipDto.password, channel.password))
        throw new ForbiddenException('Bad password');
    }
    return this.membershipsService.create(createMembershipDto);
  }

  // TODO: determine if this route should be removed (authorization is hard)
  @ApiExcludeEndpoint(process.env.DISABLE_AUTHENTICATION === 'false')
  @Get()
  findAll(
    @Query() query?: QueryMembershipDto,
  ): Promise<ResponseMembershipDto[]> {
    return this.membershipsService.findAll(query);
  }

  @Get(':id')
  async findOne(
    @AuthUser() user: User,
    @Param('id') id: string,
  ): Promise<ResponseMembershipDto> {
    const membership = await this.membershipsService.findOne(+id);
    if (membership.userId !== user.id)
      throw new EntityNotFoundError('Membership', '');
    return membership;
  }

  @Patch(':id')
  async update(
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body() updateMembershipDto: UpdateMembershipDto,
  ) {
    if (updateMembershipDto.role === MembershipRoleType.OWNER)
      throw new ForbiddenException('Cannot create a new owner');
    if (updateMembershipDto.role === MembershipRoleType.ADMIN) {
      await this.membershipsService.hasUserRoleInChannel(
        user,
        MembershipRoleType.OWNER,
        id,
      );
    }
    if (updateMembershipDto.bannedUntil || updateMembershipDto.mutedUntil)
      await this.membershipsService.isUserAtLeastAdmin(user, id);
    return await this.membershipsService.update(+id, updateMembershipDto);
  }

  @Delete(':id')
  async remove(@AuthUser() user: User, @Param('id') id: string) {
    await this.membershipsService.hasUserRoleInChannel(
      user,
      MembershipRoleType.OWNER,
      id,
    );
    return this.membershipsService.remove(+id);
  }
}
