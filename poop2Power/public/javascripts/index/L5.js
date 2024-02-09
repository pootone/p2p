

var L5 = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, {"key": "L5"});
    },
    init: function(){},
    preload: function() {
        this.load.image("burger", './images/index/loading/burger.svg');
        this.load.image("l5-bg", "./images/index/l5/l5-bg.png");
        this.load.image("guideTxtBG", "./images/index/guideTxtBG.png");
        this.load.image("nextBtn", "./images/index/NEXT_btn.svg");
    },
    create: function() {
        // BG
        this.add.image(config.width/2, config.height/2-82, "l5-bg");

        let guideContainer = this.add.container();
        let guideTxtBG = this.add.image(config.width/2, 150, "guideTxtBG").setScale(0.95, 0.9);

        sideText = this.add.text(guideTxtBG.x, guideTxtBG.y, "賽賽順利變成電，將他們傳送進家家戶戶", {
            // fontFamily: "",
            fontSize: "24px",
            color: "#000"
        });
        sideText.setOrigin(0.5);
        guideContainer.add(guideTxtBG);
        guideContainer.add(sideText);

        nextBtn = this.add.image(config.width/2, config.height-280, "nextBtn").setScale(0.9);
        nextBtn.setInteractive({useHandCursor: true}).on('pointerdown', (pointer, localX, localY, event) => {
            window.location="./html/IndexTrans.html"
        });
    },
    update: function() {
        
        

    }
});