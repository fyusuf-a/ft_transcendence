import { AchievementsLogService } from './achievements-log.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { Public } from 'src/auth/auth.public.decorator';
import { AchievementsLogDto } from './dto/achievements-log.dto';
import { ResponseAchievementsLogDto } from './dto/response-achievements-log.dto';
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
  async findById(@Param('id') id: string): Promise<AchievementsLogDto> {
    const num: number = +id;

    try {
      return await this.achievementsLogService.findById(num);
    } catch (EntityNotFoundError) {
      throw new NotFoundException('Found no achievement log with matching id.');
    }
  }

  @Post()
  @ApiResponse({
    status: 500,
    description: 'Achievement log could not be created.',
  })
  create(@Body() dto: AchievementsLogDto): Promise<ResponseAchievementsLogDto> {
    return this.achievementsLogService.create(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.achievementsLogService.remove(+id);
  }
}
