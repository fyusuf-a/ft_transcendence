import { AchievementsService } from './achievements.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Public } from 'src/auth/auth.public.decorator';
import { ResponseAchievementDto, AchievementDto } from '@dtos/achievements';
import { DeleteResult } from 'typeorm';
import { AuthUser, User } from 'src/auth/auth-user.decorator';
import {
  CaslAbilityFactory,
  Action,
  Achievement,
} from 'src/casl/casl-ability.factory';

@ApiBearerAuth()
@ApiTags('achievements')
@Controller('achievements')
export class AchievementsController {
  constructor(
    private readonly achievementsService: AchievementsService,
    private readonly abilityFactory: CaslAbilityFactory,
  ) {}

  @Public()
  @Get()
  async findAll(@AuthUser() user: User): Promise<ResponseAchievementDto[]> {
    await this.abilityFactory.checkAbility(user, Action.Read, Achievement);
    return await this.achievementsService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiResponse({ status: 404, description: 'Record not found.' })
  async findById(
    @AuthUser() user: User,
    @Param('id') id: string,
  ): Promise<AchievementDto> {
    await this.abilityFactory.checkAbility(user, Action.Read, Achievement, {
      id,
    });
    return await this.achievementsService.findById(+id);
  }

  @Post()
  @ApiResponse({
    status: 500,
    description: 'Achievement could not be created.',
  })
  async create(
    @AuthUser() user: User,
    @Body() dto: AchievementDto,
  ): Promise<ResponseAchievementDto> {
    await this.abilityFactory.checkAbility(user, Action.Create, Achievement);
    return this.achievementsService.create(dto);
  }

  @Delete(':id')
  async remove(
    @AuthUser() user: User,
    @Param('id') id: string,
  ): Promise<DeleteResult> {
    await this.abilityFactory.checkAbility(user, Action.Delete, Achievement, {
      id,
    });
    return this.achievementsService.remove(+id);
  }
}
