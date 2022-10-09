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
  Patch,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateResult, DeleteResult } from 'typeorm';
import { MatchesService } from './matches.service';
import { PageDto, PageOptionsDto } from '@dtos/pages';
import {
  ResponseMatchDto,
  CreateMatchDto,
  UpdateMatchDto,
  QueryMatchDto,
} from '@dtos/matches';
import { AuthUser } from 'src/auth/auth-user.decorator';
import {
  CaslAbilityFactory,
  Action,
  User,
  Match,
} from 'src/casl/casl-ability.factory';

@ApiTags('matches')
@Controller('matches')
export class MatchesController {
  constructor(
    private readonly matchesService: MatchesService,
    private readonly abilityFactory: CaslAbilityFactory,
  ) {}

  @ApiBearerAuth()
  @Get()
  async findAll(
    @AuthUser() user: User,
    @Query() query?: QueryMatchDto,
    @Query() pageOptions?: PageOptionsDto,
  ): Promise<PageDto<ResponseMatchDto>> {
    await this.abilityFactory.checkAbility(user, Action.Read, Match);
    return await this.matchesService.findAll(query, pageOptions);
  }

  @ApiBearerAuth()
  @Get(':id')
  @ApiResponse({ status: 404, description: 'Record not found.' })
  async findOne(
    @AuthUser() user: User,
    @Param('id') id: string,
  ): Promise<ResponseMatchDto> {
    await this.abilityFactory.checkAbility(user, Action.Read, Match, { id });
    return await this.matchesService.findOne(+id);
  }

  @ApiBearerAuth()
  @Post()
  @ApiResponse({ status: 500, description: 'Record could not be created.' })
  async create(
    @AuthUser() user: User,
    @Body() createUserDto: CreateMatchDto,
  ): Promise<ResponseMatchDto> {
    await this.abilityFactory.checkAbility(user, Action.Create, Match);
    return await this.matchesService.create(createUserDto);
  }

  @ApiBearerAuth()
  @Patch(':id')
  async update(
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body() updateMatchDto: UpdateMatchDto,
  ): Promise<UpdateResult> {
    const match = await this.matchesService.findOne(+id);
    await this.abilityFactory.checkAbility(user, Action.Update, match);
    return this.matchesService.update(match, updateMatchDto);
  }

  @ApiBearerAuth()
  @Delete(':id')
  async remove(
    @AuthUser() user: User,
    @Param('id') id: string,
  ): Promise<DeleteResult> {
    await this.abilityFactory.checkAbility(user, Action.Delete, Match, { id });
    return this.matchesService.remove(+id);
  }

  @ApiBearerAuth()
  @Get('/spectate/:id')
  async findSpectate(@Param('id') id: string): Promise<number> {
    let ret: number;
    try {
      ret = await this.matchesService.findSpectate(+id);
    } catch {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
    return ret;
  }
}
