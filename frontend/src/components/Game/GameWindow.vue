<template>
	<div class="page">
		<div class="actions">
      <v-row>
        <v-btn class="button" title="Join the queue to play" @click="joinQueue">Join Queue</v-btn>
      </v-row>
      <v-row>
        <v-btn class="button" title="Enter the id of the game you want to watch" @click="() => spectateGame(+spectateGameId)">Spectate Server-side Game</v-btn>
        <input v-model="spectateGameId">
      </v-row>
      <v-row>
        <v-btn class="button" title="Enter the name of the user you want to challenge" @click="() => challengeUser(+userIdField)">Issue Challenge To User</v-btn>
        <input id="userInput" v-model="userIdField">
      </v-row>
      <v-row>
        <v-btn class="button" title="Accept challenge from user" @click="() => acceptChallengeFromUser(+userIdField)">Accept Challenge From User</v-btn>
      </v-row>
		</div>
    <div align="center">
		  <canvas ref="pong" width="640" height="480" style="width:80%; height:80%" id="pong" ></canvas>
		  <canvas id="background" width="640" height="480" style="visibility: hidden"></canvas>
		  <canvas id="paddle" width="10" height="100" style="visibility: hidden"></canvas>
		  <canvas id="ball" width="13" height="13" style="visibility: hidden"></canvas>
    </div>
	</div>
</template>

<script lang="ts">
import { Socket } from 'socket.io-client';
import { defineComponent } from 'vue';
import { Pong } from './src/pong';
import { GameOptionsDto } from '@dtos/game/game-options.dto'

interface DataReturnTypes {
	ctx: CanvasRenderingContext2D | null;
	x: number;
	y: number;
	pong: Pong | null;
	pongCanvas: HTMLCanvasElement | null;
	backgroundCanvas: HTMLCanvasElement | null;
	ballCanvas: HTMLCanvasElement | null;
	paddleCanvas: HTMLCanvasElement | null;
	gameId: number | null;
	spectateGameId: string;
  userIdField: string;
}

export default defineComponent({
	props: {
		socket: {
			type: Object,
			required: true,
		},
	},
	data: function (): DataReturnTypes {
		return {
			ctx: null,
			x: 0,
			y: 0,
			pong: null,
			pongCanvas: null,
			backgroundCanvas: null,
			ballCanvas: null,
			paddleCanvas: null,
			gameId: null,
			spectateGameId: "1",
      userIdField: "1",
		};
	},
	methods: {
		joinQueue() {
			const gameOptions: GameOptionsDto = {  };
			this.socket.emit('game-queue', gameOptions);
		},
    challengeUser(userId: number) {
      const gameOptions: GameOptionsDto = { homeId: this.$store.getters.id, awayId: userId };
			this.socket.emit('game-queue', gameOptions);
    },
    acceptChallengeFromUser(userId: number) {
      const gameOptions: GameOptionsDto = { homeId: userId, awayId: this.$store.getters.id };
			this.socket.emit('game-queue', gameOptions);
    },
		spectateGame(gameId: number) {
			if (!this.pong) {
				this.pong = new Pong(
					this.pongCanvas,
					this.ballCanvas,
					this.backgroundCanvas,
					this.paddleCanvas,
					this.socket as Socket,
				);
			}
			this.pong.spectate(gameId);
		},
		startGame(gameId: number) {
			console.log("Starting game #" + gameId);
			this.gameId = gameId;

			this.spectateGame(this.gameId);

			window.addEventListener("keydown", (event) => {
				console.log("key down detected!!");
				console.log("key: " + event.code);
				if (!this.gameId) return;
				if (event.code === "ArrowUp") {
					this.socket.emit('game-move', { gameId: this.gameId, dy: -1 });
				} else if (event.code === "ArrowDown") {
					this.socket.emit('game-move', { gameId: this.gameId, dy: 1 });
				}
				console.log("message sent");
			});

			window.addEventListener("keyup", (event) => {
				console.log("key up detected!!");
				console.log("key: " + event.code);
				if (!this.gameId) return;
				if (event.code === "ArrowUp") {
					this.socket.emit('game-move', { gameId: this.gameId, dy: 0 });
				} else if (event.code === "ArrowDown") {
					this.socket.emit('game-move', { gameId: this.gameId, dy: 0 });
				}
			});
		}
	},
	mounted() {
		console.log('mounted');
		this.pongCanvas = document.getElementById('pong') as HTMLCanvasElement;
		this.backgroundCanvas = document.getElementById(
			'background',
		) as HTMLCanvasElement;
		this.ballCanvas = document.getElementById('ball') as HTMLCanvasElement;
		this.paddleCanvas = document.getElementById('paddle') as HTMLCanvasElement;
		this.ctx = this.pongCanvas.getContext('2d') as CanvasRenderingContext2D;

		this.socket.on('game-starting', (e: number) => this.startGame(e));

	},
});
</script>

<style scoped>
#pong, #ball, #paddle, #background {
	border: solid black 1px;
	margin-top: 80px;
	margin-left: 10px;
}
.page {
	padding-top: 30px;
}
.actions {
  margin: 15px 0px 5px 100px;
}
.button {
  margin: 15px 2px 5px 0;
}
#userInput {
  margin-left: 20px;
}
input {
  padding: 4px 12px;
  color: rgba(0,0,0,.70);
  border: 1px solid rgba(0,0,0,.12);
  transition: .15s all ease-in-out;
  background: white;
  margin-top: 15px;
  margin-right: 20px;
}
</style>
