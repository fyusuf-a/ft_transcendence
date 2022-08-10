import { Ball } from './ball';
import { Grid } from './grid';
import { Player } from './player';

export enum Winner {
  TBD = -1,
  PLAYER_0 = 0,
  PLAYER_1 = 1,
  ABORTED,
}

export enum CheckResult {
  NONE = 0, // no score
  PLAYER_0, // player 0 scored
  PLAYER_1, // player 1 scored
}

export class GameState {
  grid: Grid;
  ball: Ball;
  players: [Player, Player];
  score: [number, number];
  winner: Winner;

  constructor() {
    this.players = [new Player(), new Player()];
    this.grid = new Grid();
    this.ball = new Ball();
    this.score = [0, 0];
    this.winner = Winner.TBD;
  }

  move(player: number, dy: number) {
    this.players[player].move(dy);
    // doesn't account for paddle size
    if (this.players[player].y < 0) this.players[player].y = 0;
    if (this.players[player].y > this.grid.height)
      this.players[player].y = this.grid.height;
  }

  resetBall() {
    const sum = this.score[0] + this.score[1];
    this.ball.x = this.grid.width / 2;
    this.ball.y = this.grid.height / 2;
    this.ball.vy = 0;
    this.ball.vx = 1 - 2 * (sum % 2);
  }

  checkForPoints(): CheckResult {
    // check if someone has lost a point
    let result = CheckResult.NONE;
    if (this.ball.x <= 0) {
      this.score[1] += 1;
      this.resetBall();
      result = CheckResult.PLAYER_1;
    } else if (this.ball.x >= this.grid.width) {
      this.score[0] += 1;
      this.resetBall();
      result = CheckResult.PLAYER_0;
    }

    if (this.score[0] >= 10) {
      this.winner = Winner.PLAYER_0;
    } else if (this.score[1] >= 10) {
      this.winner = Winner.PLAYER_1;
    }

    return result;
  }
}
