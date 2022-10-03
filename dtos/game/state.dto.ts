import { ScoreDto } from './score.dto';
import { BallDto } from './ball.dto';
import { PlayerDto } from './player.dto';

export interface StateDto {
  ball: BallDto;
  player1: PlayerDto;
  player2: PlayerDto;
  scoreP1: ScoreDto;
  scoreP2: ScoreDto;
  winner: number;
  gameMode: number;
}
