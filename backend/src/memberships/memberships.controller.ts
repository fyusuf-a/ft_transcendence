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
} from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResponseMembershipDto } from './dto/response-membership.dto';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';
import { QueryMembershipDto } from './dto/query-membership.dto';

@ApiBearerAuth()
@ApiTags('channel memberships')
@Controller('memberships')
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Post()
  async create(
    @Body() createMembershipDto: CreateMembershipDto,
  ): Promise<ResponseMembershipDto> {
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
  update(
    @Param('id') id: string,
    @Body() updateMembershipDto: UpdateMembershipDto,
  ) {
    return this.membershipsService.update(+id, updateMembershipDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.membershipsService.remove(+id);
  }
}
