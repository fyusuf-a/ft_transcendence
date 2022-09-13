import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AchievementsLog } from './entities/achievements-log.entity';
import { ResponseAchievementsLogDto } from '../dtos/achievements-log/response-achievements-log.dto';
import { DeleteResult, Repository } from 'typeorm';
import { CreateAchievementLogDto } from '@dtos/achievements-log';
import { User } from 'src/users/entities/user.entity';
import { Achievement } from 'src/achievements/entities/achievements.entity';

@Injectable()
export class AchievementsLogService {
  constructor(
    @InjectRepository(AchievementsLog)
    private achievementsLogRepository: Repository<AchievementsLog>,
    @InjectRepository(Achievement)
    private achievementRepository: Repository<Achievement>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<ResponseAchievementsLogDto[]> {
    return await this.achievementsLogRepository.find();
  }

  async findById(id: number): Promise<AchievementsLog> {
    return await this.achievementsLogRepository.findOneByOrFail({ id: id });
  }

  async create(
    achievementsLogdto: CreateAchievementLogDto,
  ): Promise<AchievementsLog> {
    const newLog = new AchievementsLog();
    await this.userRepository.findOneByOrFail({
      id: achievementsLogdto.userId,
    });
    newLog.userId = achievementsLogdto.userId;

    newLog.achievement = await this.achievementRepository.findOneByOrFail({
      id: achievementsLogdto.achievementId,
    });
    return this.achievementsLogRepository.save(newLog);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.achievementsLogRepository.delete(id);
  }
}
