

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
        bg = this.add.image(config.width/2, config.height/2-82, "l5-bg");

        let guideContainer = this.add.container();
        let guideTxtBG = this.add.image(0, 0, "guideTxtBG").setScale(0.95, 0.9);

        sideText = this.add.text(0, 0, "賽賽順利變成電，將他們傳送進家家戶戶", {
            // fontFamily: "",
            fontSize: "24px",
            color: "#000"
        });
        sideText.setOrigin(0.5);
        guideContainer.add(guideTxtBG);
        guideContainer.add(sideText);
        guideContainer.setPosition(config.width/2, -guideTxtBG.height);
        this.time.delayedCall(1000, () => { // Use arrow func to use 'this'
            this.tweens.add({
                targets: guideContainer,
                y: 150,
                duration: 1100,
                ease: 'Back.out'
            });
        },);

        nextBtn = this.add.image(config.width / 2, config.height - 230, "nextBtn").setScale(0.9);
        nextBtn.setInteractive({useHandCursor: true}).on('pointerdown', (pointer, localX, localY, event) => {
            window.location=".index-old.html"
        });

        // Keep current pointer position
        lastPointerX = this.input.activePointer.x;
        lastPointerY = this.input.activePointer.y;
    },
    update: function() {
        // Move the bg by pointer position
        let pointerDeltaX = lastPointerX - this.input.activePointer.x;
        let pointerDeltaY = lastPointerY - this.input.activePointer.y;

        bg.x += pointerDeltaX * depth1;
        bg.y += pointerDeltaY * depth1;

        lastPointerX = this.input.activePointer.x;
        lastPointerY = this.input.activePointer.y;
        

    }
});