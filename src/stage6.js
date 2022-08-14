class Stage6 extends Phaser.Scene {

    constructor() {
        super({
            key: 'stage6'
        });

        this.moveCam = false;
        this.speed = 320;
        this.moominAnime = '';
        this.upBtnPush = false;
        this.rightBtnPush = false;
        this.leftBtnPush = false;
        this.downBtnPush = false;
        this.weaponBtnPush = false;
    }

    preload() {
        this.game.sound.stopAll();
        this.load.spritesheet("explode", "assets/explode.png", {
            frameWidth: 160,
            frameHeight: 160
        });
        this.load.image('bg06', 'assets/bg_06.png');
        this.load.spritesheet('moomin', 'assets/moomin.png', { frameWidth: 134, frameHeight: 214 });
        this.load.spritesheet('enemy_weapon', 'assets/weapon_enemy.png', { frameWidth: 80, frameHeight: 80 });   
        this.load.spritesheet('cross_anime', 'assets/cross_anime.png', { frameWidth: 140, frameHeight: 200 });           
        this.load.spritesheet('cross_bomber', 'assets/cross_bomber.png', { frameWidth: 140, frameHeight: 200 });     
        this.load.image('weapon', 'assets/weapon.png');
        this.load.image('dialog_stage6_1', 'assets/dialog/stage6_1.png');
        this.load.image('dialog_stage6_2', 'assets/dialog/stage6_2.png');
        this.load.image('dialog_stage6_3', 'assets/dialog/stage6_3.png');
        this.load.image('dialog_stage6_4', 'assets/dialog/stage6_4.png');
        this.load.image('dialog_stage6_5', 'assets/dialog/stage6_5.png');
        this.load.image('snafkin', 'assets/snafkin.png');
        this.load.image('mecha_moomin', 'assets/mecha_moomin.png');
        this.load.image('at_field', 'assets/at_field.png');
        this.load.image('cross_btn', 'assets/cross_button.png');
        this.load.image('weapon_btn', 'assets/weapon_button.png');
        this.load.image('pc_readme', 'assets/pc_readme.png');

        this.load.audio('daiku_last', 'bgm/daiku_last.mp3');
        this.load.audio("sndLaser", "bgm/laser2.mp3");
        this.load.audio("sndDamage", "bgm/damage6.mp3");
        this.load.audio("sndExplode", "bgm/explosion9.mp3");
        this.load.audio("sndAtField", "bgm/magic7.mp3");
        this.load.audio("sndKirakira", "bgm/kirakira.mp3");
        this.load.audio("sndBomber", "bgm/bomber.mp3");
    }

    create() {
        stage = 'stage6';

        //animation
        this.anims.create({
            key: "enemy_weapon",
            frames: this.anims.generateFrameNumbers("enemy_weapon"),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: "cross_anime",
            frames: this.anims.generateFrameNumbers("cross_anime"),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: "cross_bomber",
            frames: this.anims.generateFrameNumbers("cross_bomber"),
            frameRate: 10,
            repeat: 0
        });
        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers("explode"),
            frameRate: 10,
            repeat: 0
        });

        //sound
        this.sfx = {
            daiku_last: this.sound.add('daiku_last', { volume: 3, loop: true }),
            explode: this.sound.add('sndExplode', { volume: 0.1, loop: false }),
            damage: this.sound.add('sndDamage', { volume: 0.1, loop: false }),
            laser: this.sound.add('sndLaser', { volume: 0.1, loop: false }),
            at_field: this.sound.add('sndAtField', { volume: 1.0, loop: false }),
            kirakira: this.sound.add('sndKirakira', { volume: 1.0, loop: false }),
            bomber: this.sound.add('sndBomber', { volume: 1.0, loop: false })
        };        

        this.game.sound.stopAll();
        this.sfx.daiku_last.play();

        //group
        this.playerLasers = this.add.group();
        this.enemyLasers = this.add.group();
        this.dialogs = this.add.group();
        this.enemies = this.add.group();
        this.crosses = this.add.group();

        //player
        this.player = new Player(
            this,
            this.game.config.width * 0.5,
            850,
            "moomin"
        );

        if(document.documentElement.clientWidth <= 1024){
            //cross button
            var rightBtn = this.add.image(900, 780, 'cross_btn').setInteractive();
            var leftBtn = this.add.image(780, 780, 'cross_btn').setInteractive();
    
            rightBtn.rotation += 1.570;
            leftBtn.rotation -= 1.57;
    
            //right
            rightBtn.on('pointerdown', () => {
                this.rightBtnPush = true;
            });
            rightBtn.on('pointerup', () => {
                this.rightBtnPush = false;
            });
            rightBtn.on('pointerout', () => {
                this.rightBtnPush = false;
            });
    
            //left
            leftBtn.on('pointerdown', () => {
                this.leftBtnPush = true;
            });
            leftBtn.on('pointerup', () => {
                this.leftBtnPush = false;
            });     
            leftBtn.on('pointerout', () => {
                this.leftBtnPush = false;
            });   

            //weapon button
            var weaponBtn = this.add.image(840, 900, 'weapon_btn').setInteractive();
            weaponBtn.on('pointerdown', () => {
                this.weaponBtnPush = true;
            });
            weaponBtn.on('pointerup', () => {
                this.weaponBtnPush = false;
            });     
            weaponBtn.on('pointerout', () => {
                this.weaponBtnPush = false;
            });  
        }else{
            var pcReadme = this.add.image(880, 940, 'pc_readme');
        }

        //ボスとこちらの弾の当たり判定
        this.physics.add.overlap(this.playerLasers, this.enemies, function(playerLaser, enemy) {
            if (enemy && !enemy.getData("isDead")) {

                enemy.setTint(0xffffff);
                enemy.damage();
                playerLaser.destroy();
            }
        });

        //敵の弾とプレイヤーの当たり判定
        this.physics.add.overlap(this.player, this.enemyLasers, function(player, laser) {
            if(!player.getData("isDead") && !player.getData("isClear")){
                player.onDestroy();
            } 
        });

        //敵とプレイヤーの当たり判定
        this.physics.add.overlap(this.player, this.enemies, function(player, enemy) {
            if(!enemy.getData("isDead") && !player.getData("isClear")){
                player.setTint(0xff0000);
                player.onDestroy();
            }            
        });

        this.dialog_stage6_1 = new Dialog(
            this,
            game.config.width * 0.5,
            -200,
            "dialog_stage6_1",
            450
        );
        this.dialogs.add(this.dialog_stage6_1);

        this.stopTimer = this.time.addEvent({
            delay: 8000,
            callback: function() {
                this.dialog_stage6_2 = new Dialog(
                    this,
                    game.config.width * 0.5,
                    -200,
                    "dialog_stage6_2",
                    460
                );

                this.dialogs.add(this.dialog_stage6_2);
            },
            callbackScope: this,
            loop: false
        });

        this.bossTimer = this.time.addEvent({
            delay: 13000,
            callback: function() {
                //boss
                this.boss = new Snafkin(
                    this,
                    game.config.width * 0.5,
                    -270,
                    "snafkin",
                    210,
                    'ending'
                );
                this.enemies.add(this.boss);
            },
            callbackScope: this,
            loop: false
        });

        


        //Input Events
        cursors = this.input.keyboard.createCursorKeys();
        
        //background
        var bg = new ScrollingBackground(this, 'bg06', 10);


    }

    update() {
        this.player.update();
        
        this.dialogs.children.iterate(function (child) {
            child.update();
        });

        this.enemies.children.iterate(function (child) {
            child.update();
        });

        if (cursors.left.isDown || this.leftBtnPush)
        {
            this.player.moveLeft();
            this.player.animLeft();
        }
        else if (cursors.right.isDown || this.rightBtnPush)
        {
            this.player.moveRight();
            this.player.animRight();
        }else{
            this.player.animTurn();
        }

        if (cursors.up.isDown || this.upBtnPush)
        {
            this.player.moveUp();
        }
        else if (cursors.down.isDown || this.downBtnPush)
        {
            this.player.moveDown();
        }

        if (cursors.space.isDown || this.weaponBtnPush) {
            this.player.setData("isShooting", true);
        }
        else {
        this.player.setData("timerShootTick", this.player.getData("timerShootDelay") - 1);
        this.player.setData("isShooting", false);
        }
        
        //ボス撃破時、敵の弾を消す
        if(this.boss != undefined && this.boss.getData("isDead")){
            this.player.setData("isClear", true);
            this.enemyLasers.children.iterate(function (child) {
                child.setVisible(false);
            });

            this.crosses.children.iterate(function (child) {
                child.setVisible(false);
            });

            this.enemies.children.iterate(function (child) {
                //console.log(child);

                if(child.name == 'cross' || child.name == 'crossBomber'){
                    child.setVisible(false);
                }
                
            });
        }

        //体力減少時、ATフィールド展開

        if(this.boss != undefined){
            console.log('atFieldFlag:' + this.boss.getData("atFieldFlag"));
            console.log('atFieldOpened:' + this.boss.getData("atFieldOpened"));
        }


        if(this.boss != undefined && this.boss.getData("atFieldFlag") && this.boss.getData("atFieldOpened") == false){
            this.boss.setData("atFieldOpened", true);

            //dialog 6_3
            this.dialog_stage6_3 = new Dialog(
                this,
                game.config.width * 0.5,
                -200,
                "dialog_stage6_3",
                450
            );
            this.dialogs.add(this.dialog_stage6_3);

            //dialog 6_4
            this.time.addEvent({
                delay: 8000,
                callback: function() {
                    this.dialog_stage6_4 = new Dialog(
                        this,
                        game.config.width * 0.5,
                        -200,
                        "dialog_stage6_4",
                        460
                    );

                    this.dialogs.add(this.dialog_stage6_4);
                },
                callbackScope: this,
                loop: false
            });

            //AT FIELD   
            this.time.addEvent({
                delay: 14500,
                callback: function() {    
                    this.enemy = new AtField(
                        this,
                        (game.config.width * 0.5) - 5,
                        380,
                        "at_field",
                        340
                    );
                    this.enemies.add(this.enemy);
                    this.boss.setData("atFieldEvent", false);
                },
                callbackScope: this,
                loop: false
            });
        }

        //体力減少時、メカムーミンを召喚
        if(this.boss != undefined && this.boss.getData("mechaMoominFlag") && this.boss.getData("mechaMoominShowed") == false){
            this.boss.setData("mechaMoominShowed", true);

            //dialog 6_5
            this.dialog_stage6_5 = new Dialog(
                this,
                game.config.width * 0.5,
                -200,
                "dialog_stage6_5",
                450
            );
            this.dialogs.add(this.dialog_stage6_5);

            

            //メカムーミン1
            this.time.addEvent({
                delay: 8000,
                callback: function() {    
                    this.enemy = new MechaMoomin(
                        this,
                        97,
                        0,
                        "mecha_moomin",
                        150
                    );
                    this.enemies.add(this.enemy);
                },
                callbackScope: this,
                loop: false
            });

            //メカムーミン2
            this.time.addEvent({
                delay: 8000,
                callback: function() {    
                    this.enemy = new MechaMoomin(
                        this,
                        301,
                        0,
                        "mecha_moomin",
                        170
                    );
                    this.enemies.add(this.enemy);
                },
                callbackScope: this,
                loop: false
            });

            //メカムーミン3
            this.time.addEvent({
                delay: 8000,
                callback: function() {    
                    this.enemy = new MechaMoomin(
                        this,
                        657,
                        0,
                        "mecha_moomin",
                        170
                    );
                    this.enemies.add(this.enemy);
                },
                callbackScope: this,
                loop: false
            });

            //メカムーミン4
            this.time.addEvent({
                delay: 8000,
                callback: function() {    
                    this.enemy = new MechaMoomin(
                        this,
                        857,
                        0,
                        "mecha_moomin",
                        150
                    );
                    this.enemies.add(this.enemy);
                    this.boss.setData("mechaMoominEvent", false);
                },
                callbackScope: this,
                loop: false
            });

        }
    }

}
