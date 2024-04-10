import { Scene } from "phaser";

export class Preloader extends Scene {
    constructor() {
        super("Preloader");
    }

    init() {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, "background");

        //  A simple progress bar. This is the outline of the bar.
        this.add.rectangle(512, 384, 468, 32).setStrokeStyle(1, 0xffffff);

        //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
        const bar = this.add.rectangle(512 - 230, 384, 4, 28, 0xffffff);

        //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
        this.load.on("progress", (progress: number) => {
            //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
            bar.width = 4 + 460 * progress;
        });
    }

    preload() {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath("assets");

        this.load.image("sky", "bg2.png");
        this.load.image("forest_00", "Forest/Layer_0000.png");
        this.load.image("forest_01", "Forest/Layer_0001.png");
        this.load.image("forest_02", "Forest/Layer_0002.png");
        this.load.image("forest_03", "Forest/Layer_0003.png");
        this.load.image("forest_04", "Forest/Layer_0004.png");
        this.load.image("forest_05", "Forest/Layer_0005.png");
        this.load.image("forest_06", "Forest/Layer_0006.png");
        this.load.image("forest_07", "Forest/Layer_0007.png");
        this.load.image("forest_08", "Forest/Layer_0008.png");
        this.load.image("forest_09", "Forest/Layer_0009.png");
        this.load.image("forest_10", "Forest/Layer_0010.png");
        this.load.image("forest_11", "Forest/Layer_0011.png");
        this.load.image("woodPlatform", "Wood_15-128x128.png");

        this.load.image("ground", "platform.png");
        this.load.image("star", "star.png");
        this.load.image("bomb", "bomb.png");
        this.load.spritesheet("dude", "dude.png", {
            frameWidth: 32,
            frameHeight: 48,
        });
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        //  Move to the MainMenu. You could also swap this for a Scene Transition, such as a camera fade.
        this.scene.start("Game");
    }
}

