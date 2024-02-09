

var L3 = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function () {
        Phaser.Scene.call(this, { "key": "L3" });
    },
    init: function () { },
    preload: function () {
        this.load.image("burger", './images/index/loading/burger.svg');
        this.load.image("l3-bg", "./images/index/l3/l3-bg.png");
        this.load.image("guideTxtBG", "./images/index/guideTxtBG.png");
        this.load.image("nextBtn", "./images/index/NEXT_btn.svg");
    },
    create: function () {
        // BG
        this.add.image(config.width / 2, config.height / 2 - 83, "l3-bg");

        let guideContainer = this.add.container();
        let guideTxtBG = this.add.image(0, 0, "guideTxtBG").setScale(0.95, 0.9);

        sideText = this.add.text(0, 0, "點擊產氫菌，讓產氫菌與甲烷菌進行厭氧醱酵", {
            // fontFamily: "",
            fontSize: "24px",
            color: "#000"
        });
        sideText.setOrigin(0.5);
        guideContainer.add(guideTxtBG);
        guideContainer.add(sideText);
        guideContainer.setPosition(-guideTxtBG.width, 470);
        this.time.delayedCall(1000, () => { // Use arrow func to use 'this'
            this.tweens.add({
                targets: guideContainer,
                x: 420,
                duration: 1100,
                ease: 'Back.out'
            });
        },);


        nextBtn = this.add.image(config.width / 2, config.height - 230, "nextBtn").setScale(0.9);
        nextBtn.setInteractive({ useHandCursor: true }).on('pointerdown', (pointer, localX, localY, event) => {
            this.scene.start("L4");
        });
    },
    update: function () {



    }
});