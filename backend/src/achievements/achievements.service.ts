import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Achievement } from './entities/achievements.entity';
import { AchievementRepository } from './repository/achievements.repository';
import { AchievementDto, ResponseAchievementDto } from '@dtos/achievements';
import { DeleteResult } from 'typeorm';

@Injectable()
export class AchievementsService {
  constructor(
    @InjectRepository(AchievementRepository)
    private achievementsRepository: AchievementRepository,
  ) {}

  async findAll(): Promise<ResponseAchievementDto[]> {
    return await this.achievementsRepository.findAll();
  }

  async findById(id: number): Promise<Achievement> {
    return await this.achievementsRepository.findOneOrFail({
      where: { id: id },
    });
  }

  create(achievementdto: AchievementDto): Promise<Achievement> {
    achievementdto.icon =
      achievementdto.icon == ''
        ? '/assets/images/achievements/default.png'
        : achievementdto.icon;
    return this.achievementsRepository.save(achievementdto);
  }

  remove(id: number): Promise<DeleteResult> {
    return this.achievementsRepository.delete(id);
  }
}
