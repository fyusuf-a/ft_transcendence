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
import { EntityNotFoundError } from 'typeorm';
import { Request } from 'express';
import { User } from 'src/users/entities/user.entity';
import { ChannelsService } from 'src/channels/channels.service';

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
      await this.membershipsService.isAuthorized(
        createMembershipDto,
        req.user as User,
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
    @Param('id') id: string,
    @Body() updateMembershipDto: UpdateMembershipDto,
    @Req() req: Request,
  ) {
    if (updateMembershipDto.role === MembershipRoleType.ADMIN) {
      if (
        !(await this.membershipsService.userIsAdmin(
          (req.user as User).id,
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
