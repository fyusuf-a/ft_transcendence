import { Achievement } from '../entities/achievements.entity';
import { Injectable } from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { ResponseAchievementDto } from '../dto/response-achievement.dto';

@Injectable()
@EntityRepository(Achievement)
export class AchievementRepository extends Repository<Achievement> {
  async findAll(): Promise<ResponseAchievementDto[]> {
    return await this.find();
  }
}
