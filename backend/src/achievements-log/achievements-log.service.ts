import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AchievementsLog } from './entities/achievements-log.entity';
import { AchievementsLogRepository } from './repository/achievements-log.repository';
import { AchievementsLogDto } from './dto/achievements-log.dto';
import { ResponseAchievementsLogDto } from './dto/response-achievements-log.dto';
import { DeleteResult } from 'typeorm';

@Injectable()
export class AchievementsLogService {
  constructor(
    @InjectRepository(AchievementsLogRepository)
    private achievementsLogRepository: AchievementsLogRepository,
  ) {}

  async findAll(): Promise<ResponseAchievementsLogDto[]> {
    return await this.achievementsLogRepository.findAll();
  }

  async findById(id: number): Promise<AchievementsLog> {
    return await this.achievementsLogRepository.findOneOrFail({
      where: { id: id },
    });
  }

  create(achievementsLogdto: AchievementsLogDto): Promise<AchievementsLog> {
    return this.achievementsLogRepository.save(achievementsLogdto);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.achievementsLogRepository.delete(id);
  }
}
