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
  UnauthorizedException,
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
import { EntityNotFoundError } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { ChannelsService } from 'src/channels/channels.service';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AuthUser } from 'src/auth/user.decorator';

@ApiBearerAuth()
@ApiTags('channel memberships')
@Controller('memberships')
export class MembershipsController {
  constructor(
    private readonly membershipsService: MembershipsService,
    private readonly channelsService: ChannelsService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  async create(
    @AuthUser() user: User,
    @Body() createMembershipDto: CreateMembershipDto,
  ): Promise<ResponseMembershipDto> {
    try {
      await this.membershipsService.isAuthorized(
        createMembershipDto,
        user as User,
        await this.channelsService.findOne(createMembershipDto.channelId),
      );
      return await this.membershipsService.create(createMembershipDto);
    } catch (error) {
      if (error instanceof EntityNotFoundError) {
        throw new BadRequestException(error.message);
      }
      throw error;
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
    return membership;
  }

  @Patch(':id')
  async update(
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body() updateMembershipDto: UpdateMembershipDto,
  ) {
    if (updateMembershipDto.role === MembershipRoleType.ADMIN) {
      if (this.configService.get('DISABLE_AUTHENTICATION') === 'true') {
        return await this.membershipsService.update(+id, updateMembershipDto);
      }
      if (
        !(await this.membershipsService.userIsAdmin(
          user.id,
          (
            await this.membershipsService.findOne(+id)
          ).channelId,
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
