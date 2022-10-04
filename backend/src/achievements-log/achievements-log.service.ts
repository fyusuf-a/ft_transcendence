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
    try {
      newLog.userId = achievementsLogdto.userId;

      newLog.achievement = await this.achievementRepository.findOneByOrFail({
        id: achievementsLogdto.achievementId,
      });

      const ret = await this.achievementsLogRepository.save(newLog);
      return ret;
    } catch {
      console.log(
        `user ${achievementsLogdto.userId} has already unlocked achievement ${achievementsLogdto.achievementId}`,
      );
      return null;
    }
  }

  remove(id: number): Promise<DeleteResult> {
    return this.achievementsLogRepository.delete(id);
  }

  async unlockAchievements(user: User) {
    switch (user.wins) {
      case 50: {
        this.create({ userId: user.id, achievementId: 6 });
      }
      case 10: {
        this.create({ userId: user.id, achievementId: 5 });
      }
      case 1: {
        this.create({ userId: user.id, achievementId: 4 });
      }
    }
    const played: number = user.wins + user.losses;
    switch (played) {
      case 50: {
        this.create({ userId: user.id, achievementId: 3 });
      }
      case 10: {
        this.create({ userId: user.id, achievementId: 2 });
      }
      case 1: {
        this.create({ userId: user.id, achievementId: 1 });
      }
    }
    if (
      (await this.achievementsLogRepository.countBy({ userId: user.id })) == 6
    )
      this.create({ userId: user.id, achievementId: 7 });
  }

  async handlePostMatch(users: Array<User>) {
    if (users[0]) this.unlockAchievements(users[0]);
    if (users[1]) this.unlockAchievements(users[1]);
  }
}
