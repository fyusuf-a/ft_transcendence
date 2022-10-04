import { CreateAchievementDto } from 'src/dtos/achievements';

export const achievementsData: CreateAchievementDto[] = [
  {
    name: 'Ping',
    description: 'Play your first game of Pong.',
    icon: 'src/assets/achievements/default.png',
  },
  {
    name: 'Pong',
    description: 'Play ten games of Pong.',
    icon: 'src/assets/achievements/default.png',
  },
  {
    name: 'Addict',
    description: 'Play fifty games of Pong.',
    icon: 'src/assets/achievements/default.png',
  },
  {
    name: 'Beginners luck',
    description: 'Win a game.',
    icon: 'src/assets/achievements/default.png',
  },
  {
    name: 'Players diff',
    description: 'Win 10 games.',
    icon: 'src/assets/achievements/default.png',
  },
  {
    name: 'Mastery',
    description: 'Win 50 games.',
    icon: 'src/assets/achievements/default.png',
  },
  {
    name: 'King Pong',
    description: 'Unlock every other achievements.',
    icon: 'src/assets/achievements/default.png',
  },
];
