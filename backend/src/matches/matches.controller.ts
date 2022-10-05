import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteResult } from 'typeorm';
import { MatchesService } from './matches.service';
import { PageDto, PageOptionsDto } from '@dtos/pages';
import { ResponseMatchDto, CreateMatchDto, QueryMatchDto } from '@dtos/matches';

@ApiTags('matches')
@Controller('matches')
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @ApiBearerAuth()
  @Get()
  async findAll(
    @Query() query?: QueryMatchDto,
    @Query() pageOptions?: PageOptionsDto,
  ): Promise<PageDto<ResponseMatchDto>> {
    return await this.matchesService.findAll(query, pageOptions);
  }

  @ApiBearerAuth()
  @Get(':id')
  @ApiResponse({ status: 404, description: 'Record not found.' })
  async findOne(@Param('id') id: string): Promise<ResponseMatchDto> {
    const user: ResponseMatchDto = await this.matchesService.findOne(+id);

    return user;
  }

  @ApiBearerAuth()
  @Post()
  @ApiResponse({ status: 500, description: 'Record could not be created.' })
  async create(
    @Body() createUserDto: CreateMatchDto,
  ): Promise<ResponseMatchDto> {
    return await this.matchesService.create(createUserDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.matchesService.remove(+id);
  }
}
