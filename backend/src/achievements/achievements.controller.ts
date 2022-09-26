import { AchievementsService } from './achievements.service';
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
import { ResponseAchievementDto, AchievementDto } from '@dtos/achievements';
import { DeleteResult } from 'typeorm';

@ApiBearerAuth()
@ApiTags('achievements')
@Controller('achievements')
export class AchievementsController {
  constructor(private readonly achievementsService: AchievementsService) {}

  @Public()
  @Get()
  async findAll(): Promise<ResponseAchievementDto[]> {
    return await this.achievementsService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiResponse({ status: 404, description: 'Record not found.' })
  async findById(@Param('id') id: string): Promise<AchievementDto> {
    return await this.achievementsService.findById(+id);
  }

  @Post()
  @ApiResponse({
    status: 500,
    description: 'Achievement could not be created.',
  })
  create(@Body() dto: AchievementDto): Promise<ResponseAchievementDto> {
    return this.achievementsService.create(dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.achievementsService.remove(+id);
  }
}
