import { EventBus } from "../EventBus";
import Phaser, { Scene } from "phaser";
import Sprite = Phaser.Physics.Arcade.Sprite;
import Tile = Phaser.Tilemaps.Tile;

type GameObjectWithBody = Phaser.Types.Physics.Arcade.GameObjectWithBody;

export class Game extends Scene {
    private player!: Phaser.Physics.Arcade.Sprite;
    private stars!: Phaser.Physics.Arcade.Group;
    private bombs!: Phaser.Physics.Arcade.Group;
    private platforms!: Phaser.Physics.Arcade.StaticGroup;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private score: number = 0;
    private gameOver: boolean = false;
    private scoreText!: Phaser.GameObjects.Text;

    constructor() {
        super("Game");
    }

    create(): void {
        this.gameOver = false;

        this.add.image(0, 0, "forest_11").setScale(1.75);
        this.add.image(0, 0, "forest_10").setScale(1.75);
        this.add.image(0, 0, "forest_09").setScale(1.75);
        this.add.image(0, 0, "forest_08").setScale(1.75);
        this.add.image(0, 0, "forest_07").setScale(1.75);
        this.add.image(0, 0, "forest_06").setScale(1.75);
        this.add.image(0, 0, "forest_05").setScale(1.75);
        this.add.image(0, 0, "forest_04").setScale(1.75);
        this.add.image(0, 0, "forest_03").setScale(1.75);
        this.add.image(0, 0, "forest_02").setScale(1.75);
        this.add.image(0, 0, "forest_01").setScale(1.75);
        this.add.image(0, 0, "forest_00").setScale(1.75);

        // Main platform sprite
        this.add.tileSprite(400, 568, 800, 32, "woodPlatform");
        // Additional platforms
        this.add.tileSprite(600, 400, 400, 32, "woodPlatform");
        this.add.tileSprite(50, 250, 400, 32, "woodPlatform");
        this.add.tileSprite(750, 220, 400, 32, "woodPlatform");

        //  The platforms group contains the ground and the 2 ledges we can jump ons
        this.platforms = this.physics.add.staticGroup();

        //  Here we create the ground.
        this.platforms.create(400, 568, undefined).setSize(800, 32).setVisible(false);

        //  Now let's create some ledges
        this.platforms.create(600, 400, undefined).setSize(400, 32).setVisible(false);
        this.platforms.create(50, 250, undefined).setSize(400, 32).setVisible(false);
        this.platforms.create(750, 220, undefined).setSize(400, 32).setVisible(false);

        // The player and its settings
        this.player = this.physics.add.sprite(100, 450, "dude");

        //  Player physics properties. Give the little guy a slight bounce.
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        //  Our player animations, turning, walking left and walking right.
        this.anims.create({
            key: "left",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 0,
                end: 3,
            }),
            frameRate: 10,
            repeat: -1,
        });

        this.anims.create({
            key: "turn",
            frames: [{ key: "dude", frame: 4 }],
            frameRate: 20,
        });

        this.anims.create({
            key: "right",
            frames: this.anims.generateFrameNumbers("dude", {
                start: 5,
                end: 8,
            }),
            frameRate: 10,
            repeat: -1,
        });

        //  Input Events
        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
        }

        this.stars = this.physics.add.group({
            key: "star",
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 },
        });

        this.stars.children.iterate((child: any) => {
            //  Give each star a slightly different bounce
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            return false;
        });

        this.bombs = this.physics.add.group();

        //  The score
        this.scoreText = this.add.text(16, 16, "score: 0", {
            fontSize: "32px",
            color: "#FFF",
        });

        // TEMP: Add a bomb
        const a = this.player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        const b = this.player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        const bombA = this.bombs.create(a, 16, "bomb");
        const bombB = this.bombs.create(b, 16, "bomb");
        if (bombA) {
            bombA.setBounce(1);
            bombA.setCollideWorldBounds(true);
            bombA.setVelocity(Phaser.Math.Between(-200, 200), 20);
            bombA.allowGravity = false;
        }
        if (bombB) {
            bombB.setBounce(1);
            bombB.setCollideWorldBounds(true);
            bombB.setVelocity(Phaser.Math.Between(-200, 200), 20);
            bombB.allowGravity = false;
        }

        //  Collide the player and the stars with the platforms
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.bombs, this.bombs);

        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.physics.add.overlap(this.player, this.stars, this.collectStar, undefined, this);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, undefined, this);

        EventBus.emit("current-scene-ready", this);
    }

    update(): void {
        if (this.gameOver) {
            return;
        }

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);

            this.player.anims.play("left", true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);

            this.player.anims.play("right", true);
        } else {
            this.player.setVelocityX(0);

            this.player.anims.play("turn");
        }

        if (this.cursors.up.isDown && this.player.body?.touching.down) {
            this.player.setVelocityY(-330);
        }
    }

    private hitBomb(player: GameObjectWithBody | Tile, bomb: GameObjectWithBody | Tile): void {
        if (!(player instanceof Sprite && bomb instanceof Sprite)) {
            return;
        }

        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play("turn");
        this.gameOver = true;
        this.changeScene("GameOver");
    }

    private collectStar(player: GameObjectWithBody | Tile, star: GameObjectWithBody | Tile): void {
        if (!(player instanceof Sprite && star instanceof Sprite)) {
            return;
        }

        star.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText("Score: " + this.score);

        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate((child) => {
                //  A new batch of stars to collect
                if (child instanceof Sprite) {
                    child.enableBody(true, child.x, 0, true, true);
                }
                return true;
            });

            const a = player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            const b = player.x < 400 ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
            const bombA = this.bombs.create(a, 16, "bomb");
            const bombB = this.bombs.create(b, 16, "bomb");
            if (bombA) {
                bombA.setBounce(1);
                bombA.setCollideWorldBounds(true);
                bombA.setVelocity(Phaser.Math.Between(-200, 200), 20);
                bombA.allowGravity = false;
            }
            if (bombB) {
                bombB.setBounce(1);
                bombB.setCollideWorldBounds(true);
                bombB.setVelocity(Phaser.Math.Between(-200, 200), 20);
                bombB.allowGravity = false;
            }
        }
    }

    changeScene(scene?: string) {
        if (scene) {
            this.scene.start(scene);
        } else {
            this.scene.start("Boot");
        }
    }
}
