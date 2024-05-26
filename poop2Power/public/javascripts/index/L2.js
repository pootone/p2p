

var L2 = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function () {
        Phaser.Scene.call(this, { "key": "L2" });
    },
    init: function () { },
    preload: function () {
        this.load.image("l2-bg", "./images/index/l2/l2-bg.png");
        this.load.image("guideTxtBG", "./images/index/guideTxtBG.png");
        this.load.image("nextBtn", "./images/index/NEXT_btn.svg");
        this.load.video('l2_video', './l2_video.mp4');
    },
    create: function () {
        // BG
        video = this.add.video(config.width / 2, config.height / 2, 'l2_video').setScale(0.79);
        video.play(true);

        let guideContainer = this.add.container();
        let guideTxtBG = this.add.image(0, 0, "guideTxtBG").setScale(isPortrait ? 0.75 : 0.9, 0.9);

        sideText = this.add.text(0, 0, "賽賽進入了污水處理廠，在此分解成產氫菌及甲烷菌", {
            fontSize: "24px",
            color: "#000"
        });
        sideText.setOrigin(0.5);
        guideContainer.add(guideTxtBG);
        guideContainer.add(sideText);
        guideContainer.setPosition(-guideTxtBG.width, isPortrait ? 190 : 800);
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
            this.scene.start("L3");
        });

        // Keep current pointer position
        lastPointerX = this.input.activePointer.x;
        lastPointerY = this.input.activePointer.y;
    },
    update: function () {
        lastPointerX = this.input.activePointer.x;
        lastPointerY = this.input.activePointer.y;
    }
});