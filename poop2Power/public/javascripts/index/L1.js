let bg;
let burger;
let ldPoop;
let isStart = true;
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
        this.load.image("burger", './images/index/loading/burger.svg');
        this.load.image("bg-empty", "./images/layout/bg.png");
        this.load.spritesheet("loading-poop", './images/index/loading/loading-spritesheet.svg', { frameWidth: 217, frameHeight: 147 });
        this.load.image("guideTxtBG", "./images/index/guideTxtBG.png");
        this.load.image("nextBtn", "./images/index/NEXT_btn.svg");
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
                            x: -ldPoop.width/2,
                            duration: 4000,
                            ease: 'Power3',
                            onComplete: function () {
                                burger.destroy();
                                ldPoop.destroy();
                                bg = this.add.image(config.width / 2, config.height / 2 - 83, "l1-bg");

                                let guideContainer = this.add.container();
                                let guideTxtBG = this.add.image(390, 140, "guideTxtBG").setScale(0.95, 0.9);

                                sideText = this.add.text(guideTxtBG.x, guideTxtBG.y, "請將賽賽拖進馬桶裡，開啟便電之旅...", {
                                    // fontFamily: "",
                                    fontSize: "24px",
                                    color: "#000"
                                });
                                sideText.setOrigin(0.5);
                                guideContainer.add(guideTxtBG);
                                guideContainer.add(sideText);


                                nextBtn = this.add.image(config.width / 2, config.height - 230, "nextBtn").setScale(0.9);
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

    },
    update: function () {
        // if(isStart) {
        //     if(burger.body.x < ldPoop.body.x && ldPoop.body.x < (burger.body.x + burger.body.width + 50)) {
        //         stState = startState.ing;
        //     } else if(0 < ldPoop.body.x && (ldPoop.body.x + ldPoop.body.width) < burger.body.x + 135) {
        //         stState = startState.after;
        //     } else if((ldPoop.body.x + ldPoop.body.width) < 0) {
        //         isStart = false;
        //     }

        //     switch(stState) {
        //         case startState.before: 
        //             ldPoop.setVelocityX(-500);
        //             break;
        //         case startState.ing:
        //             ldPoop.setVelocityX(-10);
        //             setTimeout(function() {
        //                 ldPoop.setVelocityX(-500);
        //                 ldPoop.anims.play("loading-poop", true);
        //             }, 250);
        //             break;
        //         case startState.after:
        //             burger.visible = false;
        //             ldPoop.anims.stop();
        //             break;
        //         default:
        //             ldPoop.anims.stop();
        //             break;
        //     }
        // } else {
        //     burger.destroy();
        //     ldPoop.destroy();
        //     bg = this.add.image(config.width/2, config.height/2-83, "l1-bg").setScale(0.9, 0.9);

        //     let guideContainer = this.add.container();
        //     let guideTxtBG = this.add.image(400, 140, "guideTxtBG").setScale(0.95, 0.9);

        //     sideText = this.add.text(guideTxtBG.x, guideTxtBG.y, "請將賽賽拖進馬桶裡，開啟便電之旅...", {
        //         // fontFamily: "",
        //         fontSize: "24px",
        //         color: "#000"
        //     });
        //     sideText.setOrigin(0.5);
        //     guideContainer.add(guideTxtBG);
        //     guideContainer.add(sideText);


        //     nextBtn = this.add.image(config.width/2, config.height-280, "nextBtn").setScale(0.9);
        //     nextBtn.setInteractive({useHandCursor: true}).on('pointerdown', (pointer, localX, localY, event) => {
        //         this.scene.start("L2");
        //     });
        // }
    }
});