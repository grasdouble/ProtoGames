import { EventBus } from "../EventBus";
import { Scene } from "phaser";

export class GameOver extends Scene {
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    gameOverText: Phaser.GameObjects.Text;
    gameOverSubText: Phaser.GameObjects.Text;
    score: number = 0;

    constructor() {
        super("GameOver");
    }

    init(data: { score?: number }) {
        this.score = data?.score || 0;
    }

    create() {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0xff0000);

        this.background = this.add.image(400, 300, "background");
        this.background.setAlpha(0.5);

        this.gameOverText = this.add
            .text(400, 300, "Game Over", {
                fontFamily: "Arial Black",
                fontSize: 64,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        this.gameOverSubText = this.add
            .text(400, 360, `Score: ${this.score}`, {
                fontFamily: "Arial Black",
                fontSize: 44,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        this.scene.start("Boot");
    }
}
