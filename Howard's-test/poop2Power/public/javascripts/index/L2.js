

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
    },
    create: function () {
        // BG
        bg = this.add.image(config.width / 2, config.height / 2 - 83, "l2-bg");

        let guideContainer = this.add.container();
        let guideTxtBG = this.add.image(0, 0, "guideTxtBG").setScale(isPortrait ? 0.75 : 0.85, 0.9);

        sideText = this.add.text(0, 0, "賽賽進入了污水處理廠，點擊賽賽進行分解", {
            // fontFamily: "",
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
                x: isPortrait ? config.width/2 : 390,
                duration: 1100,
                ease: 'Back.out'
            });
        },);

        nextBtn = this.add.image(config.width / 2, config.height - 230, "nextBtn").setScale(0.9);
        nextBtn.setInteractive({ useHandCursor: true }).on('pointerdown', (pointer, localX, localY, event) => {
            this.scene.start("L3");
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