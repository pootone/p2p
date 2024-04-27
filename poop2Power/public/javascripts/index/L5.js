let eleArr = [[], [], []];

var L5 = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function () {
        Phaser.Scene.call(this, { "key": "L5" });
    },
    init: function () { },
    preload: function () {
        this.load.image("l5-bg", "./images/index/l5/l5-bg.png");
        this.load.image("guideTxtBG", "./images/index/guideTxtBG.png");
        this.load.image("nextBtn", "./images/index/NEXT_btn.svg");
        this.load.video('l5_video', './l5_video.mp4');
        this.load.spritesheet("ele0", "./images/index/l5/ele-1.png", { frameWidth: 275, frameHeight: 340 });
        this.load.spritesheet("ele1", "./images/index/l5/ele-2.png", { frameWidth: 460, frameHeight: 285 });
        this.load.spritesheet("ele2", "./images/index/l5/ele-3.png", { frameWidth: 470, frameHeight: 455 });
    },
    create: function () {
        // BG
        // bg = this.add.image(config.width/2, config.height/2-82, "l5-bg");
        video = this.add.video(config.width / 2, config.height / 2, 'l5_video').setScale(0.8);
        video.play(true);

        let guideContainer = this.add.container();
        let guideTxtBG = this.add.image(0, 0, "guideTxtBG").setScale(isPortrait ? 0.75 : 0.85, 0.9);

        sideText = this.add.text(0, 0, "賽賽順利變成電，將他們傳送進暗暗的房子裡", {
            // fontFamily: "",
            fontSize: "24px",
            color: "#000"
        });
        sideText.setOrigin(0.5);
        guideContainer.add(guideTxtBG);
        guideContainer.add(sideText);
        guideContainer.setPosition(config.width / 2, -guideTxtBG.height);
        this.time.delayedCall(1000, () => { // Use arrow func to use 'this'
            this.tweens.add({
                targets: guideContainer,
                y: 190,
                duration: 1100,
                ease: 'Back.out'
            });
        },);

        nextBtn = this.add.image(config.width / 2, config.height - 130, "nextBtn").setScale(0.9);
        nextBtn.setInteractive({ useHandCursor: true }).on('pointerdown', (pointer, localX, localY, event) => {
            window.location = "./index-old.html"
        });

        // Keep current pointer position
        lastPointerX = this.input.activePointer.x;
        lastPointerY = this.input.activePointer.y;

        timer = this.time.addEvent({
            delay: 3000,
            callback: this.addNewEle,
            callbackScope: this,
            loop: true
        });
    },
    update: function () {
        // Destroy when out of canvas
        for (let i = 0; i < eleArr.length; i++) {
            for(let j = 0; j < eleArr[i].length; j++){
                if (config.width < eleArr[i][j].x ||
                    eleArr[i][j].x + eleArr[i][j].body.width < 0 ||
                    config.height < eleArr[i][j].y ||
                    eleArr[i][j].y + eleArr[i][j].body.height < 0) {
                        eleArr[i][j].destroy();
                        eleArr[i].splice(j, 1);
                    break;
                }
            }
        }


        // Move the bg by pointer position
        let pointerDeltaX = lastPointerX - this.input.activePointer.x;
        let pointerDeltaY = lastPointerY - this.input.activePointer.y;

        // bg.x += pointerDeltaX * depth1;
        // bg.y += pointerDeltaY * depth1;

        lastPointerX = this.input.activePointer.x;
        lastPointerY = this.input.activePointer.y;


    },
    addNewEle: function () {
        if ((eleArr[0].length + eleArr[1].length + eleArr[2].length) < 10) {
            let rnEle = Math.floor(Math.random() * 3);
            let newele = this.physics.add.sprite(100 + Math.random() * (config.width - 300), 150 + Math.random() * 650, "ele" + rnEle).setScale(0.4);
            newele.anims.create({
                key: "ele",
                frames: this.anims.generateFrameNumbers('ele'+rnEle, { start: 0, end: 29 }),
                frameRate: 12,
                repeat: -1
            });
            // 设置初始速度
            newele.setVelocity(Phaser.Math.Between(-100, 100), Phaser.Math.Between(-100, 100));
            newele.setInteractive({ cursor: `url(./images/index/l1/cursor.svg) 30 30, pointer`, draggable: true })
                .on('drag', (pointer, dragX, dragY) => {
                    // Change layer to top
                    newele.depth = 999;
                    newele.setPosition(dragX, dragY);
                })
                .on('dragend', (pointer, dragX, dragY) => {
                    newele.depth = 0;
                });
            newele.anims.play("ele");
            this.tweens.add({
                targets: newele.body.velocity,
                x: Phaser.Math.Between(-150, 150),
                y: Phaser.Math.Between(-150, 150),
                ease: 'Linear',
                duration: 2000,
                repeat: -1,
                yoyo: true
            });

            eleArr[rnEle].push(newele);
        }
    }
});