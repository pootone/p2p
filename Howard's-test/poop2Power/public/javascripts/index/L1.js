let burger;
let ldPoop;
let isStart = true;
let poop;
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