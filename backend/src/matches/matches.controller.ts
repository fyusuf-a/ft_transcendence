import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
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
  constructor(
    private readonly matchesService: MatchesService, //@Inject(GameGateway) //private readonly gameGateway: GameGateway)
  ) {}

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

  @ApiBearerAuth()
  @Get('/spectate/:id')
  async findSpectate(@Param('id') id: string): Promise<number> {
    let ret: number;
    console.log(id);
    try {
      ret = await this.matchesService.findSpectate(+id);
    } catch {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
    return ret;
  }
}
