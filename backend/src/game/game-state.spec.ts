import { CheckResult, GameState, Winner, SCORE_TO_WIN } from './game-state';

describe('GameState', () => {
  it('should exist', () => {
    expect(GameState).toBeDefined();
  });

  describe('constructor', () => {
    let state: GameState;

    beforeAll(() => {
      state = new GameState();
    });

    it('should initialize with 0-0 score', () => {
      expect(state.score).toEqual([0, 0]);
    });

    it('should initialize with no winner', () => {
      expect(state.winner).toEqual(Winner.TBD);
    });

    it('should initialize with a ball', () => {
      expect(state.ball).toBeDefined();
    });
  });

  describe('checkForPoints', () => {
    let state: GameState;

    beforeEach(() => {
      state = new GameState();
    });

    it('should not increment score if ball is in middle', () => {
      state.checkForPoints();
      expect(state.score).toEqual([0, 0]);
      expect(state.lastResult).toEqual(CheckResult.NONE);
    });

    it('should increment score[0] if player[0] scores', () => {
      state.ball.x = state.grid.width;
      state.checkForPoints();
      expect(state.score).toEqual([1, 0]);
      expect(state.lastResult).toEqual(CheckResult.PLAYER_0);
    });

    it('should increment score[1] if player[1] scores', () => {
      state.ball.x = 0;
      state.checkForPoints();
      expect(state.score).toEqual([0, 1]);
      expect(state.lastResult).toEqual(CheckResult.PLAYER_1);
    });

    it(`should have no winner if points are less than ${SCORE_TO_WIN}`, () => {
      state.score = [SCORE_TO_WIN - 1, SCORE_TO_WIN - 1];
      state.checkForPoints();
      expect(state.winner).toEqual(Winner.TBD);
    });

    it(`should have winner if score[0] is ${SCORE_TO_WIN}`, () => {
      state.score = [SCORE_TO_WIN, SCORE_TO_WIN - 1];
      state.checkForPoints();
      expect(state.winner).toEqual(Winner.PLAYER_0);
    });

    it(`should have winner if score[1] is ${SCORE_TO_WIN}`, () => {
      state.score = [SCORE_TO_WIN - 1, SCORE_TO_WIN];
      state.checkForPoints();
      expect(state.winner).toEqual(Winner.PLAYER_1);
    });

    it(`should have winner if player scores when having ${
      SCORE_TO_WIN - 1
    } points`, () => {
      state.score = [SCORE_TO_WIN - 1, SCORE_TO_WIN - 1];
      state.ball.x = 0;
      state.checkForPoints();
      expect(state.winner).toEqual(Winner.PLAYER_1);
      expect(state.lastResult).toEqual(CheckResult.PLAYER_1);
    });

    it('should reset ball toward player[0] after first score', () => {
      state.ball.x = 0;
      state.checkForPoints();
      expect(state.score).toEqual([0, 1]);
      expect(state.ball.x).toEqual(state.grid.width / 2);
      expect(state.ball.vx).toBeGreaterThan(0);
    });

    it('should reset ball toward player[1] after second score', () => {
      state.score = [0, 1];
      state.ball.x = 0;
      state.checkForPoints();
      expect(state.score).toEqual([0, 2]);
      expect(state.ball.x).toEqual(state.grid.width / 2);
      expect(state.ball.vx).toBeGreaterThan(0);
    });
  });
});
