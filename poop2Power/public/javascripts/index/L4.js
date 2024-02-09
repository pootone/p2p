

var L4 = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, {"key": "L4"});
    },
    init: function(){},
    preload: function() {
        this.load.image("burger", './images/index/loading/burger.svg');
        this.load.image("l4-bg", "./images/index/l4/l4-bg.png");
        this.load.image("guideTxtBG", "./images/index/guideTxtBG.png");
        this.load.image("nextBtn", "./images/index/NEXT_btn.svg");
    },
    create: function() {
        // BG
        this.add.image(config.width/2, config.height/2-83, "l4-bg");

        let guideContainer = this.add.container();
        let guideTxtBG = this.add.image(1120, 200, "guideTxtBG").setScale(0.95, 0.9);

        sideText = this.add.text(guideTxtBG.x, guideTxtBG.y, "點擊沼氣，讓他們進行火力發電", {
            // fontFamily: "",
            fontSize: "24px",
            color: "#000"
        });
        sideText.setOrigin(0.5);
        guideContainer.add(guideTxtBG);
        guideContainer.add(sideText);

        nextBtn = this.add.image(config.width/2, config.height-280, "nextBtn").setScale(0.9);
        nextBtn.setInteractive({useHandCursor: true}).on('pointerdown', (pointer, localX, localY, event) => {
            this.scene.start("L5");
        });
    },
    update: function() {
        
        

    }
});