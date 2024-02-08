

var L4 = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, {"key": "L4"});
    },
    init: function(){},
    preload: function() {
        this.load.image("burger", './images/index/loading/burger.svg');
        this.load.image("l4-bg", "./images/index/l4/l4-bg.png");
        this.load.image("nextBtn", "./images/index/NEXT_btn.svg");
    },
    create: function() {
        // BG
        this.add.image(config.width/2, config.height/2-50, "l4-bg").setScale(1.1, 1);


        nextBtn = this.add.image(config.width/2, config.height-340, "nextBtn").setScale(0.9);
        nextBtn.setInteractive({useHandCursor: true}).on('pointerdown', (pointer, localX, localY, event) => {
            this.scene.start("L5");
        });
    },
    update: function() {
        
        

    }
});