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
import { ResponseAchievementsLogDto } from './dto/response-achievements-log.dto';
import { DeleteResult } from 'typeorm';
import { CreateAchievementLogDto } from './dto/create-achievements-log.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
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
  async create(
    @Body() dto: CreateAchievementLogDto,
  ): Promise<ResponseAchievementsLogDto> {
    try {
      return await this.achievementsLogService.create(dto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<DeleteResult> {
    return this.achievementsLogService.remove(+id);
  }
}
