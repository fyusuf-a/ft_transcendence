import { BallDto } from './ball.dto';
import { PlayerDto } from './player.dto';

export interface StateDto {
  gameId: number;
  ball: BallDto;
  player1: PlayerDto;
  player2: PlayerDto;
}
