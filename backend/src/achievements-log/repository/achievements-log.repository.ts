import { AchievementsLog } from '../entities/achievements-log.entity';
import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ResponseAchievementsLogDto } from '@dtos/achievements-log';

@Injectable()
@EntityRepository(AchievementsLog)
export class AchievementsLogRepository extends Repository<AchievementsLog> {
  async findAll(): Promise<ResponseAchievementsLogDto[]> {
    return await this.find();
  }
}
