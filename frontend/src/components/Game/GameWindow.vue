<template>
	<div class="page">
    <div class="actions">
      <v-row>
        <v-btn class="button" title="Join the queue to play" @click="joinQueue">Join Queue</v-btn>
			</v-row>
      <br/>
      <v-row>
        <v-btn @click="map = 1" v-if="map == 0">Active BlackHole map</v-btn><v-btn @click="map = 0" v-if="map == 1">Deactive BlackHole map</v-btn>
      </v-row>
			<v-row>
        <select v-model="spectateGameId">
          <option value="">Choose a game to watch, and click on Spectate</option>
          <option v-for="item in matchArr" :key="item.idMatch" :value="item.idMatch">
            Match #{{item.idMatch}} -- {{item.player1}} versus {{item.player2}}
          </option>  
        </select>
        <v-btn class="button" title="Chose a game to watch" @click="() => spectateGame(+spectateGameId)">Spectate</v-btn>
			</v-row>
			<v-row>
-                       <select v-model="acceptChallengeUserId">
-          <option value="">Choose a challenge to accept, and click on Play</option>
-          <option v-for="item in challengeArr" :key="item.id" :value="item.opponentId">
-            {{item.opponentString}}
-          </option>  
-        </select>
-        <v-btn class="button" title="Choose a challenge to accept" @click="() => acceptChallengeFromUser(+acceptChallengeUserId)">Play</v-btn>
-                       </v-row>	
		</div>
		<br />
		<div>
      <v-dialog
        v-model="end"
        activator="parent"
        v-if="end"
      >
        <v-card width="600" height="150" class="v-dialog-pos">
          <v-card-text>
            <p align="center" class="winStatus">
            {{ endMessage }} </p><br />
          <p v-if="!spectateTrue" >Do you want to play again?
          </p>
            <v-row class="mt-2 ml-8">
            <v-btn v-if="!spectateTrue" class="button" title="Join the queue to play" @click="joinQueue">Yes, rejoin the queue</v-btn>
            <v-btn v-if="!spectateTrue" class="button" title="Don't replay" @click="closeGame">No, go to your profile page</v-btn>
            <v-btn v-if="spectateTrue" class="button" title="Close" @click="closeGame">Close</v-btn>
          </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
			<canvas ref="pong" width="640" height="480" style="" id="responsive-canvas" ></canvas>
			<canvas id="background" width="640" height="480" style="visibility: hidden"></canvas>
			<canvas id="paddle" width="10" height="100" style="visibility: hidden"></canvas>
      <canvas id="score" width="70" height="70" style="visibility: hidden"></canvas>
			<canvas id="ball" width="13" height="13" style="visibility: hidden"></canvas>
		</div>
	</div>
</template>

<script lang="ts">
import { Socket } from 'socket.io-client';
import { defineComponent } from 'vue';
import { Pong } from './src/pong';
import { GameOptionsDto } from '@dtos/game/game-options.dto'
import axios from 'axios';
import { MatchDto } from '@dtos/matches';
import { mapGetters } from 'vuex';
import { MatchStatusType } from '@dtos/matches';

interface DataReturnTypes {
	ctx: CanvasRenderingContext2D | null;
	x: number;
	y: number;
	pong: Pong | null;
	pongCanvas: HTMLCanvasElement | null;
	backgroundCanvas: HTMLCanvasElement | null;
	ballCanvas: HTMLCanvasElement | null;
	paddleCanvas: HTMLCanvasElement | null;
	scoreCanvas: HTMLCanvasElement | null;
	gameId: number | null;
	spectateGameId: string;
	acceptChallengeUserId: string;
  end: boolean;
  endMessage: string;
  matchArr: Array<{ idMatch: number, player1: string, player2: string }>;
  challengeArr: { opponentString: string, opponentId: number, id: number }[];
  selected: string;
	map: number
  spectateTrue: boolean;
  auth: boolean;
  interval: number;
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
			scoreCanvas: null,
			spectateGameId: "",
			acceptChallengeUserId: "",
      end: false,
      endMessage: '',
      matchArr: [],
	  challengeArr: [],
      selected: '',
	    map: 0,
      spectateTrue: false,
	  auth:false,
	  interval: 0,
		};
	},
	methods: {
    ...mapGetters(['id']),
		joinQueue() {
			const gameOptions: GameOptionsDto = {  };
			this.socket.emit('game-queue', gameOptions);
      this.resize();
      this.end = false;
		},
	async navigationHandler() {
		if (!this.auth)
			return ;
		const challengerId : number = this.$store.getters.challengeUserId;
		const spectateId : number = this.$store.getters.spectateUserId;
		this.socket.off("auth-success");
		clearInterval(this.interval);
		if (challengerId) {
			this.$store.dispatch("removeChallenge");
      		const gameOptions: GameOptionsDto = { homeId: this.$store.getters.id, awayId: challengerId};
			this.socket.emit('game-queue', gameOptions);
		}
		else if (spectateId) {
			this.$store.dispatch("removeSpectate");
			const matchId : number = (await axios.get(`/matches/spectate/${spectateId}`)).data;
			this.spectateGame(matchId);
		}
      this.resize();
    },
    challengeUser(userId: number) {      
		if (userId == 0)
			return;
		this.$store.dispatch("removeChallenge");
      const gameOptions: GameOptionsDto = { homeId: this.$store.getters.id, awayId: userId };
			this.socket.emit('game-queue', gameOptions);
      this.resize();
    },
    acceptChallengeFromUser(userId: number) {
      const gameOptions: GameOptionsDto = { homeId: userId, awayId: this.$store.getters.id };
			this.socket.emit('game-queue', gameOptions);
      this.resize();
    },
    closeGame() {
      this.end = false;
      if(!this.spectateTrue) {
        this.$router.push({
          name: 'home',
        });
      }
      this.spectateTrue = false;
    },
	  resize() {
		  const canvas = document.getElementById('responsive-canvas') as HTMLCanvasElement;
      if (canvas != null) { 
		    const canvasRatio = canvas.height / canvas.width;
		    const windowRatio = window.innerHeight / window.innerWidth;
		    let width: string | number;
		    let height: string | number;

		    if (windowRatio < canvasRatio ) {
		    	height = window.innerHeight - 64;
		    	width = height / canvasRatio;
		    }
        else {
		    	width = window.innerWidth;
		    	height = width * canvasRatio;
		    }
		    canvas.style.width = width + 'px';
		    canvas.style.height = height + 'px';
    }
		},
		spectateGame(gameId: number) {
			if (!this.pong) {
				this.pong = new Pong(
					this.pongCanvas,
					this.ballCanvas,
					this.backgroundCanvas,
					this.backgroundCanvas,
					this.paddleCanvas,
					this.scoreCanvas,
					this.socket as Socket,
					this.map,
				);
			}
			this.pong.spectate(gameId);
		},
		async startGame(gameId: number) {
			this.gameId = gameId;
			this.spectateGame(this.gameId);
			window.addEventListener("keydown", (event) => {
				if (!this.gameId) return;
				if (event.code === "ArrowUp") {
					this.socket.emit('game-move', { gameId: this.gameId, dy: -1 });
				} else if (event.code === "ArrowDown") {
					this.socket.emit('game-move', { gameId: this.gameId, dy: 1 });
				}
			});

			window.addEventListener("keyup", (event) => {
				if (!this.gameId) return;
				if (event.code === "ArrowUp") {
					this.socket.emit('game-move', { gameId: this.gameId, dy: 0 });
				} else if (event.code === "ArrowDown") {
					this.socket.emit('game-move', { gameId: this.gameId, dy: 0 });
				}
			});
		},
		async handleEndGame(match :MatchDto) {
      this.end = true;
      this.pong = null;

			if ((this.id() != match.homeId && this.id() != match.awayId)) {
				this.spectateTrue = true;
				if (match.status == "ABORTED") {
					this.endMessage = "The game is over, a player has unfortunately been disconnected";
				}
				else {
        	let winner: string;
        	if (match.status == "HOME") {
          	const responseWinner = await axios.get('/users/' + match.homeId);
          	winner = responseWinner.data.username
         	 this.endMessage = `The game is over, ${winner} won!`;
      		}
      		else if (match.status == "AWAY") {
      	  	const responseWinner = await axios.get('/users/' + match.awayId);
      	  	winner = responseWinner.data.username
      	  	this.endMessage = `The game is over, ${winner} won!`;
      		}
				}
			}
			else if (match.status == "ABORTED") {
				this.endMessage = "Oh no! Your opponent has been disconnected :(";
			}
      else if ((this.id() == match.homeId && match.status == "HOME")
      || (this.id() == match.awayId && match.status == "AWAY")) {
        this.endMessage = "Congrats! You win :)";
      }
      else {
        this.endMessage = "Oh no! You lose :(";
      }
		},
    async getMatchesToSepctacte() {
      const response = await axios.get(`/matches?status=${MatchStatusType.IN_PROGRESS}&order=DESC&take=20`);
      for (let i: number = 0 ; i < response.data.data.length ; i++) {
        const responseHome = await axios.get('/users/' + response.data.data[i].homeId);
        const responseAway = await axios.get('/users/' + response.data.data[i].awayId);
        this.matchArr.push({
          idMatch: response.data.data[i].id,
          player1: responseHome.data.username,
          player2: responseAway.data.username,
        })
      }
    },
	async getChallenges() {
		this.challengeArr = await axios.get(`/matches/challenges/${this.$store.getters.id}`)
	},
	},
	beforeUnmount() {
		this.socket.off('game-starting');
		this.socket.off('endGame');
		this.socket.off("auth-success");
	},
	mounted() {
    this.getMatchesToSepctacte();
		this.pongCanvas = document.getElementById('responsive-canvas') as HTMLCanvasElement;
		this.backgroundCanvas = document.getElementById(
			'background',
		) as HTMLCanvasElement;
		this.paddleCanvas = document.getElementById('paddle') as HTMLCanvasElement;
		this.scoreCanvas = document.getElementById('score') as HTMLCanvasElement;
		this.ballCanvas = document.getElementById('ball') as HTMLCanvasElement;
		this.ctx = this.pongCanvas.getContext('2d') as CanvasRenderingContext2D;
    window.addEventListener('resize', this.resize);
		this.socket.on('game-starting', (e: number) => this.startGame(e));
		this.socket.on('endGame', (match: MatchDto) => this.handleEndGame(match));
		this.socket.on("auth-success", () =>  {
			this.socket.off("auth-success");
			this.auth = true;
			this.socket.emit('require-challenges');
		});
		this.socket.on("get-challenges", (arr : Array<{ opponentString: string, opponentId: number, id:number }>) => {
			this.challengeArr = arr;
		});
		this.interval = window.setInterval(this.navigationHandler, 1000);
	}
});
</script>

<style scoped>
#pong, #ball, #paddle, #background {
	border: solid black 1px;
	margin-top: 50px;
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
select {
  padding: 4px 12px;
  color: rgba(0,0,0,.70);
  border: 1px solid rgba(0,0,0,.12);
  transition: .15s all ease-in-out;
  background: white;
  margin-top: 15px;
  margin-right: 20px;
}
canvas#responsive-canvas {
	width: 65%;
	position: relative;
	display: block;
	margin-left: auto;
	margin-right: auto 
}
.winStatus {
  font-weight: bold;
}
</style>
