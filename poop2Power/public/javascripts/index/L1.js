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
    initialize: function() {
        Phaser.Scene.call(this, {"key": "L1"});
    },
    init: function(){},
    preload: function() {
        this.load.image("l1-bg", './images/index/l1/l1-bg.png');
        this.load.image("burger", './images/index/loading/burger.svg');
        this.load.image("bg-empty", "./images/layout/bg.png");
        this.load.spritesheet("loading-poop", './images/index/loading/loading-spritesheet.svg',{frameWidth: 217, frameHeight: 147 });
        this.load.image("nextBtn", "./images/index/NEXT_btn.svg");
    },
    create: function() {
        // BG
        bg = this.add.image(config.width/2, config.height/2, "bg-empty");

        burger = this.physics.add.staticSprite(config.width/2, config.height/2-45.5, "burger").refreshBody();

        ldPoop = this.physics.add.sprite(config.width-1, config.height/2-45.5, "loading-poop").setScale(0.8);
        ldPoop.anims.create({
            key: "loading-poop",
            frames: this.anims.generateFrameNumbers('loading-poop', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1 //-1: infinite
        });

    },
    update: function() {
        if(isStart) {
            if(burger.body.x < ldPoop.body.x && ldPoop.body.x < (burger.body.x + burger.body.width + 50)) {
                stState = startState.ing;
            } else if(0 < ldPoop.body.x && (ldPoop.body.x + ldPoop.body.width) < burger.body.x + 135) {
                stState = startState.after;
            } else if((ldPoop.body.x + ldPoop.body.width) < 0) {
                isStart = false;
            }

            switch(stState) {
                case startState.before: 
                    ldPoop.setVelocityX(-500);
                    break;
                case startState.ing:
                    ldPoop.setVelocityX(-10);
                    setTimeout(function() {
                        ldPoop.setVelocityX(-500);
                        ldPoop.anims.play("loading-poop", true);
                    }, 250);
                    break;
                case startState.after:
                    burger.visible = false;
                    ldPoop.anims.stop();
                    break;
                default:
                    ldPoop.anims.stop();
                    break;
            }
        } else {
            burger.destroy();
            ldPoop.destroy();
            bg = this.add.image(config.width/2, config.height/2, "l1-bg").setScale(1.1, 1);

            sideText = this.add.text(0, 0, "請將賽賽拖進馬桶裡，開啟便電之旅...", {
                
            });

            nextBtn = this.add.image(config.width/2, config.height-340, "nextBtn").setScale(0.9);
            nextBtn.setInteractive({useHandCursor: true}).on('pointerdown', (pointer, localX, localY, event) => {
                this.scene.start("L2");
            });
        }
    }
});