

var L2 = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, {"key": "L2"});
    },
    init: function(){},
    preload: function() {
        this.load.image("burger", './images/index/loading/burger.svg');
        this.load.image("l2-bg", "./images/index/l2/l2-bg.png");
        this.load.image("nextBtn", "./images/index/NEXT_btn.svg");
    },
    create: function() {
        // BG
        this.add.image(config.width/2, config.height/2-83, "l2-bg").setScale(0.9, 0.8);

        nextBtn = this.add.image(config.width/2, config.height-280, "nextBtn").setScale(0.9);
        nextBtn.setInteractive({useHandCursor: true}).on('pointerdown', (pointer, localX, localY, event) => {
            this.scene.start("L3");
        });
    },
    update: function() {
    
        

    }
});