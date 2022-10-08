import { AchievementsLogService } from './achievements-log.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  CreateAchievementLogDto,
  ResponseAchievementsLogDto,
} from '@/dtos/achievements-log';
import { DeleteResult, QueryFailedError } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthUser, User } from 'src/auth/auth-user.decorator';
import {
  CaslAbilityFactory,
  Action,
  AchievementsLog,
} from 'src/casl/casl-ability.factory';

@ApiBearerAuth()
@ApiTags('achievements log')
@Controller('achievements-log')
export class AchievementsLogController {
  constructor(
    private readonly achievementsLogService: AchievementsLogService,
    private readonly abilityFactory: CaslAbilityFactory,
  ) {}

  @Get()
  async findAll(@AuthUser() user: User): Promise<ResponseAchievementsLogDto[]> {
    await this.abilityFactory.checkAbility(user, Action.Read, AchievementsLog);
    return await this.achievementsLogService.findAll();
  }

  @Get(':id')
  @ApiResponse({ status: 404, description: 'Record not found.' })
  async findById(
    @AuthUser() user: User,
    @Param('id') id: string,
  ): Promise<ResponseAchievementsLogDto> {
    await this.abilityFactory.checkAbility(user, Action.Read, AchievementsLog, {
      id,
    });
    return await this.achievementsLogService.findById(+id);
  }

  @Post()
  @ApiResponse({
    status: 500,
    description: 'Achievement log could not be created.',
  })
  async create(
    @AuthUser() user: User,
    @Body() dto: CreateAchievementLogDto,
  ): Promise<ResponseAchievementsLogDto> {
    await this.abilityFactory.checkAbility(
      user,
      Action.Create,
      AchievementsLog,
    );
    try {
      return await this.achievementsLogService.create(dto);
    } catch (err) {
      if (err instanceof QueryFailedError)
        throw new HttpException(err.driverError.detail, HttpStatus.BAD_REQUEST);
      else throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async remove(
    @AuthUser() user: User,
    @Param('id') id: string,
  ): Promise<DeleteResult> {
    await this.abilityFactory.checkAbility(
      user,
      Action.Delete,
      AchievementsLog,
    );
    return this.achievementsLogService.remove(+id);
  }
}
