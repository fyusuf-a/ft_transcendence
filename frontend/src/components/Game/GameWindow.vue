<template>
  <canvas ref="pong" id="pong" width="640px" height="480px"></canvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Pong } from './src/pong';

export default defineComponent({
  data: function () {
    return {};
  },
  updated() {
    // const background = new Image();
    // background.src = 'src/assets/images/background.png';

    // // const canvas = document.getElementById('pong') as HTMLCanvasElement;
    // const canvas = this.$refs.pong as HTMLCanvasElement;
    // const ctx: CanvasRenderingContext2D = canvas.getContext(
    //   '2d',
    // ) as CanvasRenderingContext2D;
    // ctx.beginPath();
    // ctx.lineWidth = 5;
    // ctx.lineCap = "round";
    // ctx.strokeStyle = "green";
    // ctx.rect(20, 20, 150, 150);
    // ctx.fill();
    const pong = new Pong();
    pong.start();
  },
});
</script>

<style scoped>
#pong {
  border: solid black 1px;
  width: 640px;
  height: 480px;
  margin-left: 10px;
}
</style>
