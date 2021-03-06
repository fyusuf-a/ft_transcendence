import {
  Body,
  Controller,
  Delete,
  Get,
  BadRequestException,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DeleteResult, UpdateResult } from 'typeorm';
import { MatchesService } from './matches.service';
import { EntityDoesNotExistError } from 'src/errors/entityDoesNotExist';
import { PageDto, PageOptionsDto } from '@dtos/pages';
import {
  ResponseMatchDto,
  CreateMatchDto,
  UpdateMatchDto,
  QueryMatchDto,
} from '@dtos/matches';

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
    if (user === undefined) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  @ApiBearerAuth()
  @Post()
  @ApiResponse({ status: 500, description: 'Record could not be created.' })
  async create(
    @Body() createUserDto: CreateMatchDto,
  ): Promise<ResponseMatchDto> {
    try {
      return await this.matchesService.create(createUserDto);
    } catch (error) {
      if (error instanceof EntityDoesNotExistError) {
        throw new BadRequestException(error.message);
      } else if (error instanceof RangeError) {
        throw new BadRequestException(error.message);
      } else throw error;
    }
  }

  @ApiBearerAuth()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMatchDto: UpdateMatchDto,
  ): Promise<UpdateResult> {
    return this.matchesService.update(+id, updateMatchDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.matchesService.remove(+id);
  }
}
