import { Server } from 'socket.io';

export interface CreateGameDto {
  gameId: number;
  server?: Server;
  room?: string;
  // game options, players, etc
}
