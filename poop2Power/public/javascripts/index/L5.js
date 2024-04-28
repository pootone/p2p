let eleArr = [[], [], []];
let winArr = [];

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
        this.load.image("A", "./images/index/l5/windows/A.png");
        this.load.image("B", "./images/index/l5/windows/B.png");
        this.load.image("C", "./images/index/l5/windows/C.png");
        this.load.image("D", "./images/index/l5/windows/D.png");
        this.load.image("E", "./images/index/l5/windows/E.png");
        this.load.image("F", "./images/index/l5/windows/F.png");
        this.load.image("G", "./images/index/l5/windows/G.png");
        this.load.image("H", "./images/index/l5/windows/H.png");
        this.load.image("I", "./images/index/l5/windows/I.png");
        this.load.image("J", "./images/index/l5/windows/J.png");
        this.load.image("K", "./images/index/l5/windows/K.png");
        this.load.image("L", "./images/index/l5/windows/L.png");
        this.load.image("M", "./images/index/l5/windows/M.png");
        this.load.video('l5_video', './l5_video.mp4');
        this.load.spritesheet("ele0", "./images/index/l5/ele-1.png", { frameWidth: 275, frameHeight: 340 });
        this.load.spritesheet("ele1", "./images/index/l5/ele-2.png", { frameWidth: 460, frameHeight: 285 });
        this.load.spritesheet("ele2", "./images/index/l5/ele-3.png", { frameWidth: 390, frameHeight: 390 });
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

        // Windows
        winArr[0] = this.physics.add.staticSprite(config.width/2, config.height/2, "A").setScale(0.8).setVisible(false);
        winArr[0].body.setSize(180, 170);
        winArr[0].body.setOffset(710, config.height-140);
        winArr[1] = this.physics.add.staticSprite(config.width/2, config.height/2, "B").setScale(0.8).setVisible(false);
        winArr[1].body.setSize(290, 130);
        winArr[1].body.setOffset(config.width/2+130, config.height-110);
        winArr[2] = this.physics.add.staticSprite(config.width/2, config.height/2, "C").setScale(0.8).setVisible(false);
        winArr[2].body.setSize(280, 170);
        winArr[2].body.setOffset(config.width/2+450, config.height-200);
        winArr[3] = this.physics.add.staticSprite(config.width/2, config.height/2, "D").setScale(0.8).setVisible(false);
        winArr[3].body.setSize(280, 170);
        winArr[3].body.setOffset(config.width/2+750, config.height-200);
        winArr[4] = this.physics.add.staticSprite(config.width/2, config.height/2, "E").setScale(0.8).setVisible(false);
        winArr[4].body.setSize(90, 80);
        winArr[4].body.setOffset(config.width/2+1050, config.height-230);
        winArr[5] = this.physics.add.staticSprite(config.width/2, config.height/2, "F").setScale(0.8).setVisible(false);
        winArr[5].body.setSize(100, 110);
        winArr[5].body.setOffset(config.width/2+340, config.height-280);
        winArr[6] = this.physics.add.staticSprite(config.width/2, config.height/2, "G").setScale(0.8).setVisible(false);
        winArr[6].body.setSize(90, 100);
        winArr[6].body.setOffset(config.width/2+480, config.height-310);
        winArr[7] = this.physics.add.staticSprite(config.width/2, config.height/2, "H").setScale(0.8).setVisible(false);
        winArr[7].body.setSize(200, 100);
        winArr[7].body.setOffset(config.width/2+870, config.height-340);
        winArr[8] = this.physics.add.staticSprite(config.width/2, config.height/2, "I").setScale(0.8).setVisible(false);
        winArr[8].body.setSize(200, 100);
        winArr[8].body.setOffset(config.width/2+650, config.height-400);
        winArr[9] = this.physics.add.staticSprite(config.width/2, config.height/2, "J").setScale(0.8).setVisible(false);
        winArr[9].body.setSize(100, 50);
        winArr[9].body.setOffset(config.width/2+540, config.height-370);
        winArr[10] = this.physics.add.staticSprite(config.width/2, config.height/2, "K").setScale(0.8).setVisible(false);
        winArr[10].body.setSize(100, 50);
        winArr[10].body.setOffset(config.width/2+350, config.height-350);
        winArr[11] = this.physics.add.staticSprite(config.width/2, config.height/2, "L").setScale(0.8).setVisible(false);
        winArr[11].body.setSize(100, 50);
        winArr[11].body.setOffset(config.width/2+240, config.height-390);
        winArr[12] = this.physics.add.staticSprite(config.width/2, config.height/2, "M").setScale(0.8).setVisible(false);
        winArr[12].body.setSize(100, 50);
        winArr[12].body.setOffset(config.width/2+400, config.height-410);

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
                for(let k = 0; k < winArr.length; k++) {
                    if (this.physics.overlap(eleArr[i][j], winArr[k]) && !winArr[k].visible) {
                        eleArr[i][j].destroy();
                        eleArr[i].splice(j, 1);
                        winArr[k].setVisible(true);
                        break;
                    }
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
            let newele = this.physics.add.sprite(100 + Math.random() * (config.width - 300), 150 + Math.random() * 650, "ele" + rnEle).setScale(0.3);
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