let bgm;
let burger;
let ldPoop;
let isStart = true;
let poop;
let flower;
let pinkFlower;
let yellowFlower;
let grass_r;
let l1_static_flower = [];
let l2_yellow_flower_r;
let l2_grass_r;
let l2_grass_c;
let l2_grass_l;
let l2_static_grass = [];
let l3_pink_flower;
let l3_grass_r;
let l3_grass_l;
let l3_static_flower = [];
let l3_static_grass = [];
let l4_yellow_flower;
let l4_white_flower;
let l4_static_flower = [];
let l4_static_grass = [];
let l5_yellow_flower;
let l5_static_grass = [];
let l5_static_flower = [];

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
        this.load.svg("burger", './images/index/loading/burger.svg');
        this.load.spritesheet("bg-empty", "./images/layout/bg.png", { frameWidth: 1920, frameHeight: 1080 });
        this.load.spritesheet("poop", "./images/index/l1/poop.png", { frameWidth: 250, frameHeight: 180 });
        this.load.spritesheet("loading-poop", './images/index/loading/loading-spritesheet.svg', { frameWidth: 217, frameHeight: 147 });
        this.load.image("guideTxtBG", "./images/index/guideTxtBG.png");

        // layer 1
        this.load.spritesheet("flower", './images/index/l1/flower.png', { frameWidth: 700, frameHeight: 1070 });
        this.load.spritesheet("pinkFlower_l", "./images/index/l1/pinkFlower_l.png", { frameWidth: 500, frameHeight: 320 });
        this.load.spritesheet("yellowFlower_l", "./images/index/l1/yellowFlower_l.png", { frameWidth: 500, frameHeight: 470 });
        this.load.spritesheet("grass_r", "./images/index/l1/grass_r.png", { frameWidth: 500, frameHeight: 730 });

        // layer 2
        this.load.spritesheet("l2_yellow_flower_r", "./images/index/l1/l2_yellow_flower_r.png", { frameWidth: 270, frameHeight: 460 });
        this.load.spritesheet("l2_grass_r", "./images/index/l1/l2_grass_r.png", { frameWidth: 140, frameHeight: 200 });
        this.load.spritesheet("l2_grass_c", "./images/index/l1/l2_grass_c.png", { frameWidth: 450, frameHeight: 470 });
        this.load.spritesheet("l2_grass_l", "./images/index/l1/l2_grass_l.png", { frameWidth: 470, frameHeight: 530 });
        this.load.image("2g", "./images/index/l1/2g.png");
        this.load.image("2g2", "./images/index/l1/2g2.png");
        this.load.image("2g3", "./images/index/l1/2g3.png");
        this.load.image("2g4", "./images/index/l1/2g4.png");

        // layer 3
        this.load.spritesheet("l3_pink_flower", "./images/index/l1/l3_pink_flower.png", { frameWidth: 500, frameHeight: 330 });
        this.load.spritesheet("l3_grass_r", "./images/index/l1/l3_grass_r.png", { frameWidth: 250, frameHeight: 340 });
        this.load.spritesheet("l3_grass_l", "./images/index/l1/l3_grass_l.png", { frameWidth: 100, frameHeight: 150 });
        this.load.image("3f", "./images/index/l1/3f.png");
        this.load.image("3f2", "./images/index/l1/3f2.png");
        this.load.image("3g", "./images/index/l1/3g.png");
        this.load.image("3g2", "./images/index/l1/3g2.png");
        this.load.image("3g3", "./images/index/l1/3g3.png");
        this.load.image("3g4", "./images/index/l1/3g4.png");
        this.load.image("3g5", "./images/index/l1/3g5.png");
        this.load.image("3g6", "./images/index/l1/3g6.png");

        // layer 4
        this.load.spritesheet("l4_yellow_flower", "./images/index/l1/l4_yellow_flower.png", { frameWidth: 350, frameHeight: 640 });
        this.load.spritesheet("l4_white_flower", "./images/index/l1/l4_white_flower.png", { frameWidth: 580, frameHeight: 1110 });
        this.load.image("4f", "./images/index/l1/4f.png");
        this.load.image("4g", "./images/index/l1/4g.png");
        this.load.image("4g2", "./images/index/l1/4g2.png");

        // layer 5
        this.load.spritesheet("l5_yellow_flower", "./images/index/l1/l5_yellow_flower.png", { frameWidth: 400, frameHeight: 650 });
        this.load.image("5f", "./images/index/l1/5f.png");
        this.load.image("5g", "./images/index/l1/5g.png");
        this.load.image("5g2", "./images/index/l1/5g2.png");

        this.load.svg("nextBtn", "./images/index/NEXT_btn.svg");

        this.load.audio('bgm', './music/bgm.mp3');
    },
    create: function () {
        // BG
        bg = this.physics.add.staticSprite(config.width / 2, config.height / 2, "bg-empty");
        bg.setDisplaySize(config.width, config.height);
        bg.anims.create({
            key: "bg",
            frames: this.anims.generateFrameNumbers("bg-empty", { start: 0, end: 7 }),
            frameRate: 8,
            repeat: -1
        });
        bg.anims.play("bg");

        // bgm = this.sound.add('bgm', {
        //     volumn: 1,
        //     loop: true
        // });
        // bgm.play();

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

                                // layer 5
                                l5_static_grass[0] = this.add.image(20, config.height - 40, "5g").setScale(0.25);
                                l5_static_flower[1] = this.add.image(980, config.height - 120, "5f").setScale(0.23);;
                                l5_yellow_flower = this.physics.add.sprite(390, config.height - 250, "l5_yellow_flower").setScale(0.8);
                                l5_yellow_flower.anims.create({
                                    key: "l5_yellow_flower",
                                    frames: this.anims.generateFrameNumbers("l5_yellow_flower", { start: 0, end: 19 }),
                                    frameRate: 5,
                                    yoyo: true,
                                    repeat: -1
                                });

                                // layer 4
                                l4_static_grass[0] = this.add.image(700, config.height - 30, "4g").setScale(0.25);
                                l4_static_grass[1] = this.add.image(1280, config.height - 30, "4g2").setScale(0.25);
                                l4_static_flower[0] = this.add.image(750, config.height - 60, "4f").setScale(0.25);
                                l4_yellow_flower = this.physics.add.sprite(1450, 850, "l4_yellow_flower").setScale(0.75);
                                l4_yellow_flower.anims.create({
                                    key: "l4_yellow_flower",
                                    frames: this.anims.generateFrameNumbers("l4_yellow_flower", { start: 0, end: 14 }),
                                    frameRate: 7.8,
                                    yoyo: true,
                                    repeat: -1
                                });
                                l4_white_flower = this.physics.add.sprite(config.width - 280, 700, "l4_white_flower").setScale(0.75);
                                l4_white_flower.anims.create({
                                    key: "l4_white_flower",
                                    frames: this.anims.generateFrameNumbers("l4_white_flower", { start: 0, end: 19 }),
                                    frameRate: 10,
                                    yoyo: true,
                                    repeat: -1
                                });

                                // layer 3
                                l3_static_grass[0] = this.add.image(config.width - 435, config.height - 30, "3g").setScale(0.15);
                                l3_static_grass[1] = this.add.image(config.width / 2 - 100, config.height - 30, "3g2").setScale(0.2);
                                l3_static_grass[2] = this.add.image(config.width / 2 + 440, config.height - 50, "3g3").setScale(0.2);
                                l3_static_grass[3] = this.add.image(config.width / 2 + 380, config.height - 70, "3g4").setScale(0.25);
                                l3_static_grass[4] = this.add.image(1790, config.height - 15, "3g5").setScale(0.4);
                                l3_static_grass[5] = this.add.image(1630, config.height - 10, "3g6").setScale(0.2);
                                l3_static_grass[6] = this.add.image(250, config.height - 30, "2g4").setScale(0.2);
                                l3_static_grass[6].flipX = true;
                                l3_static_flower[0] = this.add.image(390, config.height - 60, "3f").setScale(0.2);
                                l3_grass_l = this.physics.add.sprite(config.width / 2 - 170, config.height - 60, "l3_grass_l").setScale(0.8);
                                l3_grass_l.anims.create({
                                    key: "l3_grass_l",
                                    frames: this.anims.generateFrameNumbers("l3_grass_l", { start: 0, end: 29 }),
                                    frameRate: 15,
                                    yoyo: true,
                                    repeat: -1
                                });
                                l3_grass_r = this.physics.add.sprite(config.width - 350, config.height - 130, "l3_grass_r").setScale(0.8);
                                l3_grass_r.anims.create({
                                    key: "l3_grass_r",
                                    frames: this.anims.generateFrameNumbers("l3_grass_r", { start: 0, end: 19 }),
                                    frameRate: 8,
                                    yoyo: true,
                                    repeat: -1
                                });
                                l3_pink_flower = this.physics.add.sprite(config.width - 175, config.height - 110, "l3_pink_flower").setScale(0.8);
                                l3_pink_flower.anims.create({
                                    key: "l3_pink_flower",
                                    frames: this.anims.generateFrameNumbers("l3_pink_flower", { start: 0, end: 14 }),
                                    frameRate: 8,
                                    yoyo: true,
                                    repeat: -1
                                });
                                poop = this.physics.add.sprite(config.width / 2 - 1, config.height / 2 - 100, "poop").setScale(0.4);
                                poop.anims.create({
                                    key: "poop",
                                    frames: this.anims.generateFrameNumbers('poop', { start: 0, end: 29 }),
                                    frameRate: 12,
                                    repeat: -1
                                });
                                poop.setInteractive({ cursor: `url(./images/index/l1/cursor.svg) 30 30, pointer`, draggable: true })
                                    .on('drag', (pointer, dragX, dragY) => {
                                        // Change layer to top
                                        poop.depth = 999;
                                        poop.setPosition(dragX, dragY);
                                    });
                                // .on('dragend', (pointer, dragX, dragY) => {
                                //     poop.depth = 0;
                                // });

                                // layer 2
                                l1_static_flower[0] = this.add.image(config.width / 2 + 230, config.height - 90, "3f2").setScale(0.25);
                                l2_yellow_flower_r = this.physics.add.sprite(config.width - 540, config.height - 170, "l2_yellow_flower_r").setScale(0.8);
                                l2_yellow_flower_r.anims.create({
                                    key: "l2_yellow_flower_r",
                                    frames: this.anims.generateFrameNumbers("l2_yellow_flower_r", { start: 0, end: 14 }),
                                    frameRate: 8,
                                    yoyo: true,
                                    repeat: -1
                                });
                                l2_grass_r = this.physics.add.sprite(config.width - 230, config.height - 80, "l2_grass_r").setScale(0.8);
                                l2_grass_r.anims.create({
                                    key: "l2_grass_r",
                                    frames: this.anims.generateFrameNumbers("l2_grass_r", { start: 0, end: 19 }),
                                    frameRate: 10,
                                    yoyo: true,
                                    repeat: -1
                                });
                                l2_grass_c = this.physics.add.sprite(config.width / 2 + 70, config.height - 190, "l2_grass_c").setScale(0.9);
                                l2_grass_c.anims.create({
                                    key: "l2_grass_c",
                                    frames: this.anims.generateFrameNumbers("l2_grass_c", { start: 0, end: 19 }),
                                    frameRate: 10,
                                    yoyo: true,
                                    repeat: -1
                                });
                                l2_grass_l = this.physics.add.sprite(175, config.height - 170, "l2_grass_l").setScale(0.85);
                                l2_grass_l.anims.create({
                                    key: "l2_grass_l",
                                    frames: this.anims.generateFrameNumbers("l2_grass_l", { start: 0, end: 19 }),
                                    frameRate: 10,
                                    yoyo: true,
                                    repeat: -1
                                });
                                l2_static_grass[0] = this.add.image(430, config.height - 50, "2g").setScale(0.2);
                                l2_static_grass[1] = this.add.image(600, config.height - 95, "2g2").setScale(0.25);
                                l2_static_grass[2] = this.add.image(1200, config.height - 35, "2g3").setScale(0.2);
                                l2_static_grass[3] = this.add.image(900, config.height - 30, "2g4").setScale(0.2);

                                // layer 1
                                pinkFlower = this.physics.add.sprite(550, config.height - 110, "pinkFlower_l").setScale(0.8);
                                pinkFlower.anims.create({
                                    key: "pinkFlower_l",
                                    startFrame: 7,
                                    frames: this.anims.generateFrameNumbers('pinkFlower_l', { start: 0, end: 14 }),
                                    frameRate: 8,
                                    yoyo: true,
                                    repeat: -1
                                });

                                yellowFlower = this.physics.add.sprite(95, config.height - 180, "yellowFlower_l").setScale(0.8);
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

                                flower = this.physics.add.sprite(config.width / 2, config.height - 280, "flower").setScale(0.6);
                                flower.anims.create({
                                    key: "flower",
                                    frames: this.anims.generateFrameNumbers('flower', { start: 0, end: 14 }),
                                    frameRate: 9,
                                    yoyo: true,
                                    repeat: -1
                                });

                                flower.anims.play('flower');
                                pinkFlower.anims.play('pinkFlower_l');
                                yellowFlower.anims.play('yellowFlower_l');
                                grass_r.anims.play('grass_r');
                                l2_yellow_flower_r.anims.play('l2_yellow_flower_r');
                                l2_grass_r.anims.play('l2_grass_r');
                                l2_grass_c.anims.play('l2_grass_c');
                                l2_grass_l.anims.play('l2_grass_l');
                                l3_pink_flower.anims.play('l3_pink_flower');
                                l3_grass_r.anims.play('l3_grass_r');
                                l3_grass_l.anims.play('l3_grass_l');
                                l4_white_flower.anims.play('l4_white_flower');
                                l4_yellow_flower.anims.play('l4_yellow_flower');
                                l5_yellow_flower.anims.play('l5_yellow_flower');
                                poop.anims.play("poop");

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

        // bg.x += pointerDeltaX * depth1;
        // bg.y += pointerDeltaY * depth1;

        lastPointerX = this.input.activePointer.x;
        lastPointerY = this.input.activePointer.y;
    }
});