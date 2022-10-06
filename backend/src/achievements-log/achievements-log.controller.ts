import { AchievementsLogService } from './achievements-log.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { Public } from 'src/auth/auth.public.decorator';
import { ResponseAchievementsLogDto } from '@/dtos/achievements-log';
import { DeleteResult } from 'typeorm';

@ApiBearerAuth()
@ApiTags('achievements log')
@Controller('achievements-log')
export class AchievementsLogController {
  constructor(
    private readonly achievementsLogService: AchievementsLogService,
  ) {}

  @Public()
  @Get()
  async findAll(): Promise<ResponseAchievementsLogDto[]> {
    return await this.achievementsLogService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiResponse({ status: 404, description: 'Record not found.' })
  async findById(@Param('id') id: string): Promise<ResponseAchievementsLogDto> {
    try {
      return await this.achievementsLogService.findById(+id);
    } catch (EntityNotFoundError) {
      throw new NotFoundException('Found no achievement log with matching id.');
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.achievementsLogService.remove(+id);
  }
}
