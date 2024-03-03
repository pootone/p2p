let burger;
let ldPoop;
let isStart = true;
let poop;
let flower;
let pinkFlower;
let yellowFlower;
let grass_r;
const startState = {
    before: 0,
    ing: 1,
    after: 2
}
let stState = startState.before;
let sideText;

var L1 = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function () {
        Phaser.Scene.call(this, { "key": "L1" });
    },
    init: function () { },
    preload: function () {
        this.load.image("l1-bg", './images/index/l1/l1-bg.png');
        this.load.svg("burger", './images/index/loading/burger.svg');
        this.load.image("bg-empty", "./images/layout/bg.png");
        this.load.spritesheet("poop", "./images/index/l1/poop.svg", { frameWidth: 109, frameHeight: 75.01 });
        this.load.spritesheet("loading-poop", './images/index/loading/loading-spritesheet.svg', { frameWidth: 217, frameHeight: 147 });
        this.load.image("guideTxtBG", "./images/index/guideTxtBG.png");

        this.load.spritesheet("flower", './images/index/l1/flower.png', { frameWidth: 700, frameHeight: 1070 });
        this.load.spritesheet("pinkFlower_l", "./images/index/l1/pinkFlower_l.png", { frameWidth: 500, frameHeight: 320 });
        this.load.spritesheet("yellowFlower_l", "./images/index/l1/yellowFlower_l.png", { frameWidth: 500, frameHeight: 470 });
        this.load.spritesheet("grass_r", "./images/index/l1/grass_r.png", { frameWidth: 500, frameHeight: 730 });

        this.load.svg("nextBtn", "./images/index/NEXT_btn.svg");
    },
    create: function () {
        // BG
        bg = this.add.image(config.width / 2, config.height / 2, "bg-empty");

        burger = this.physics.add.staticSprite(config.width / 2, config.height / 2 - 100, "burger");

        ldPoop = this.physics.add.sprite(config.width - 1, config.height / 2 - 100, "loading-poop").setScale(0.8);
        ldPoop.anims.create({
            key: "loading-poop",
            frames: this.anims.generateFrameNumbers('loading-poop', { start: 0, end: 1 }),
            frameRate: 6,
            repeat: -1 //-1: infinite
        });

        // Before
        this.tweens.add({
            targets: ldPoop,
            x: (burger.body.x + burger.body.width + 120),
            duration: 1000,
            ease: 'Power2',
            // Eating
            onComplete: function () {
                ldPoop.anims.play("loading-poop", true);
                this.tweens.add({
                    targets: ldPoop,
                    x: burger.body.x - 5,
                    duration: 650,
                    ease: 'linear',
                    onUpdate: function (tween, target) {
                        if (tween.progress >= 0.65) {
                            burger.visible = false;
                        }
                    },
                    // After
                    onComplete: function () {
                        ldPoop.anims.stop();
                        ldPoop.setFrame(0);
                        this.tweens.add({
                            targets: ldPoop,
                            x: -ldPoop.width / 2,
                            duration: 4000,
                            ease: 'Power3',
                            onComplete: function () {
                                burger.destroy();
                                ldPoop.destroy();
                                bg = this.add.image(config.width / 2, config.height / 2 - 83, "l1-bg");

                                flower = this.physics.add.sprite(config.width / 2, config.height - 280, "flower").setScale(0.6);
                                flower.anims.create({
                                    key: "flower",
                                    frames: this.anims.generateFrameNumbers('flower', { start: 0, end: 14 }),
                                    frameRate: 9,
                                    yoyo: true,
                                    repeat: -1
                                });

                                pinkFlower = this.physics.add.sprite(500, config.height - 110, "pinkFlower_l").setScale(0.8);
                                pinkFlower.anims.create({
                                    key: "pinkFlower_l",
                                    startFrame: 7,
                                    frames: this.anims.generateFrameNumbers('pinkFlower_l', { start: 0, end: 14 }),
                                    frameRate: 8,
                                    yoyo: true,
                                    repeat: -1
                                });

                                yellowFlower = this.physics.add.sprite(0, config.height - 200, "yellowFlower_l").setScale(0.8);
                                yellowFlower.anims.create({
                                    key: "yellowFlower_l",
                                    startFrame: 7,
                                    frames: this.anims.generateFrameNumbers('yellowFlower_l', { start: 0, end: 14 }),
                                    frameRate: 8,
                                    yoyo: true,
                                    repeat: -1
                                });

                                grass_r = this.physics.add.sprite(config.width - 1, config.height - 200, "grass_r").setScale(0.7);
                                grass_r.anims.create({
                                    key: "grass_r",
                                    startFrame: 7,
                                    frames: this.anims.generateFrameNumbers('grass_r', { start: 0, end: 19 }),
                                    frameRate: 8,
                                    yoyo: true,
                                    repeat: -1
                                });

                                flower.anims.play('flower');
                                pinkFlower.anims.play('pinkFlower_l');
                                yellowFlower.anims.play('yellowFlower_l');
                                grass_r.anims.play('grass_r');

                                let guideContainer = this.add.container();
                                let guideTxtBG = this.add.image(0, 0, "guideTxtBG").setScale(isPortrait ? 0.75 : 0.85, 0.9);

                                sideText = this.add.text(0, 0, "請將賽賽拖進馬桶裡，開啟便電之旅...", {
                                    // fontFamily: "",
                                    fontSize: "24px",
                                    color: "#000"
                                });
                                sideText.setOrigin(0.5);
                                guideContainer.add(guideTxtBG);
                                guideContainer.add(sideText);
                                guideContainer.setPosition(-guideTxtBG.width, 190);
                                this.time.delayedCall(1000, () => { // Use arrow func to use 'this'
                                    this.tweens.add({
                                        targets: guideContainer,
                                        x: isPortrait ? config.width / 2 : 390,
                                        duration: 1100,
                                        ease: 'Back.out'
                                    });
                                },);

                                poop = this.physics.add.sprite(config.width / 2 - 1, config.height / 2 - 100, "poop").setScale(0.8);
                                poop.anims.create({
                                    key: "poop",
                                    frames: this.anims.generateFrameNumbers('poop', { start: 0, end: 1 }),
                                    frameRate: 6,
                                    repeat: -1
                                });
                                poop.setInteractive({ cursor: `url(./images/index/l1/hover.svg) 30 30, pointer`, draggable: true })
                                    .on('drag', (pointer, dragX, dragY) => {
                                        poop.setPosition(dragX, dragY);
                                    });

                                nextBtn = this.add.image(config.width / 2, config.height - 130, "nextBtn").setScale(0.9);
                                nextBtn.setInteractive({ useHandCursor: true }).on('pointerdown', (pointer, localX, localY, event) => {
                                    this.scene.start("L2");
                                });
                            },
                            callbackScope: this
                        });
                    },
                    callbackScope: this
                });
            },
            callbackScope: this
        });

        // Keep current pointer position
        lastPointerX = this.input.activePointer.x;
        lastPointerY = this.input.activePointer.y;
    },
    update: function () {
        // Move the bg by pointer position
        let pointerDeltaX = lastPointerX - this.input.activePointer.x;
        let pointerDeltaY = lastPointerY - this.input.activePointer.y;

        bg.x += pointerDeltaX * depth1;
        bg.y += pointerDeltaY * depth1;

        lastPointerX = this.input.activePointer.x;
        lastPointerY = this.input.activePointer.y;
    }
});