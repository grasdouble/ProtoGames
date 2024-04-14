<script setup lang="ts">
import Phaser from "phaser";
import { onMounted, ref, toRaw } from "vue";
import { EventBus } from "./game/EventBus";
import { Game } from "./game/scenes/Game";
import PhaserGame from "./game/PhaserGame.vue";

//  References to the PhaserGame component (game and scene are exposed)
const phaserRef = ref();
const scene = ref();
const data = ref({ highScore: 0 });

onMounted(() => {
    EventBus.on("highscore", (scene_instance: Phaser.Scene) => {
        scene.value = scene_instance;
        // Manage High Score
        if (scene.value instanceof Game) {
            (scene.value as Game).updateHighScore(({ highScore }: { highScore: number }) => {
                if (highScore > data.value.highScore) {
                    data.value = { highScore };
                }
            });
        }
    });
});

const changeScene = () => {
    const scene = toRaw(phaserRef.value.scene) as Game;

    if (scene) {
        scene.changeScene();
    }
};

// Event emitted from the PhaserGame component
const currentScene = (scene: Game) => {};

defineExpose({ scene });
</script>

<template>
    <PhaserGame ref="phaserRef" @current-active-scene="currentScene" />
    <div>
        <div>
            <button class="button" @click="changeScene">Restart Game</button>
        </div>
        <div class="spritePosition">High Score: {{ data.highScore }}</div>
    </div>
</template>
