import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  Query,
  NotFoundException,
  UnauthorizedException,
  Req,
} from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import {
  UpdateMembershipDto,
  CreateMembershipDto,
  ResponseMembershipDto,
  QueryMembershipDto,
  MembershipRoleType,
} from '@dtos/memberships';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';
import { ChannelsService } from 'src/channels/channels.service';
import { ChannelType } from 'src/channels/entities/channel.entity';
import { EntityNotFoundError } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';

async function userIsAdmin(
  userId: number,
  channelId: number,
  membershipsService: MembershipsService,
): Promise<boolean> {
  const creatorMembership = await membershipsService.findAll({
    user: userId.toString(),
    channel: channelId.toString(),
  });
  if (
    creatorMembership.length === 1 &&
    (creatorMembership[0].role === MembershipRoleType.ADMIN ||
      creatorMembership[0].role === MembershipRoleType.OWNER)
  ) {
    return true;
  }
  return false;
}

async function userIsOwner(
  userId: number,
  channelId: number,
  membershipsService: MembershipsService,
): Promise<boolean> {
  const creatorMembership = await membershipsService.findAll({
    user: userId.toString(),
    channel: channelId.toString(),
  });
  if (
    creatorMembership.length === 1 &&
    creatorMembership[0].role === MembershipRoleType.OWNER
  ) {
    return true;
  }
  return false;
}

@ApiBearerAuth()
@ApiTags('channel memberships')
@Controller('memberships')
export class MembershipsController {
  constructor(
    private readonly membershipsService: MembershipsService,
    private readonly channelsService: ChannelsService,
  ) {}

  @Post()
  async create(
    @Body() createMembershipDto: CreateMembershipDto,
    @Req() req: Request,
  ): Promise<ResponseMembershipDto> {
    try {
      let isAuthorized = false;
      const channel = await this.channelsService.findOne(
        createMembershipDto.channelId,
      );
      if (createMembershipDto.role === MembershipRoleType.OWNER) {
        throw new UnauthorizedException();
      }
      if (createMembershipDto.role === MembershipRoleType.ADMIN) {
        if (
          !(await userIsOwner(
            (req.user as User).id,
            channel.id,
            this.membershipsService,
          ))
        ) {
          throw new UnauthorizedException();
        }
      }
      if (channel.type === ChannelType.PRIVATE) {
        isAuthorized = await userIsAdmin(
          (req.user as User).id,
          createMembershipDto.channelId,
          this.membershipsService,
        );
      } else if (channel.type === ChannelType.PROTECTED) {
        isAuthorized =
          createMembershipDto.password &&
          (await bcrypt.compare(
            createMembershipDto.password,
            channel.password,
          ));
      } else {
        isAuthorized = true;
      }
      if (!isAuthorized) {
        throw new UnauthorizedException();
      }
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new BadRequestException('Cannot find channel');
      }
      throw error;
    }
    try {
      return await this.membershipsService.create(createMembershipDto);
    } catch (error) {
      if (error instanceof EntityDoesNotExistError) {
        throw new BadRequestException(error.message);
      } else {
        throw error;
      }
    }
  }

  @Get()
  findAll(
    @Query() query?: QueryMembershipDto,
  ): Promise<ResponseMembershipDto[]> {
    return this.membershipsService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseMembershipDto> {
    const membership: ResponseMembershipDto =
      await this.membershipsService.findOne(+id);
    if (membership === undefined) {
      throw new NotFoundException(`Channel membership #${id} not found`);
    }
    return membership;
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMembershipDto: UpdateMembershipDto,
    @Req() req: Request,
  ) {
    if (updateMembershipDto.role === MembershipRoleType.ADMIN) {
      if (
        !(await userIsAdmin(
          (req.user as User).id,
          (
            await this.membershipsService.findOne(+id)
          ).channelId,
          this.membershipsService,
        ))
      ) {
        throw new UnauthorizedException();
      }
    }
    return await this.membershipsService.update(+id, updateMembershipDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membershipsService.remove(+id);
  }
}
