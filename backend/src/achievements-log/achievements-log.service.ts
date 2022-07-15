import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AchievementsLog } from './entities/achievements-log.entity';
import { AchievementsLogRepository } from './repository/achievements-log.repository';
import { ResponseAchievementsLogDto } from './dto/response-achievements-log.dto';
import { DeleteResult } from 'typeorm';
import { CreateAchievementLogDto } from './dto/create-achievements-log.dto';
import { AchievementRepository } from 'src/achievements/repository/achievements.repository';
import UserRepository from 'src/users/repository/user.repository';

@Injectable()
export class AchievementsLogService {
  constructor(
    @InjectRepository(AchievementsLogRepository)
    private achievementsLogRepository: AchievementsLogRepository,
    @InjectRepository(AchievementRepository)
    private achievementRepository: AchievementRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
  ) {}

  async findAll(): Promise<ResponseAchievementsLogDto[]> {
    return await this.achievementsLogRepository.findAll();
  }

  async findById(id: number): Promise<AchievementsLog> {
    return await this.achievementsLogRepository.findOneOrFail({
      where: { id: id },
    });
  }

  async create(
    achievementsLogdto: CreateAchievementLogDto,
  ): Promise<AchievementsLog> {
    if (
      (await this.achievementsLogRepository.findOne({
        where: {
          achievementId: achievementsLogdto.achievementId,
          userId: achievementsLogdto.userId,
        },
      })) !== undefined
    )
      throw 'Achievements already unlocked.';
    const newLog = new AchievementsLog();
    await this.userRepository.findOneOrFail(achievementsLogdto.userId);
    newLog.userId = achievementsLogdto.userId;

    newLog.achievement = await this.achievementRepository.findOneOrFail(
      achievementsLogdto.achievementId,
    );
    console.log(newLog);
    return this.achievementsLogRepository.save(newLog);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.achievementsLogRepository.delete(id);
  }
}
