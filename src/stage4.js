class Stage4 extends Phaser.Scene {

    constructor() {
        super({
            key: 'stage4'
        });

        this.moveCam = false;
        this.speed = 320;
        this.moominAnime = '';
        this.upBtnPush = false;
        this.rightBtnPush = false;
        this.leftBtnPush = false;
        this.downBtnPush = false;
        this.weaponBtnPush = false;
        this.clearFlag = 0;
        this.nyoroDestroyCount = 0;
    }

    preload() {
        this.load.spritesheet("explode", "assets/explode.png", {
            frameWidth: 160,
            frameHeight: 160
        });
        this.load.image('bg04', 'assets/bg_04.png');
        this.load.spritesheet('moomin', 'assets/moomin.png', { frameWidth: 134, frameHeight: 214 });
        this.load.spritesheet('enemy_weapon', 'assets/weapon_enemy.png', { frameWidth: 80, frameHeight: 80 });   
        this.load.spritesheet('electric', 'assets/electric.png', { frameWidth: 130, frameHeight: 130 });     
        this.load.image('weapon', 'assets/weapon.png');
        this.load.image('nyoro2', 'assets/nyoro2.png');
        this.load.image('nyoro01', 'assets/nyoro01.png');
        this.load.image('nyoro02', 'assets/nyoro02.png');
        this.load.image('nyoro03', 'assets/nyoro03.png');
        this.load.image('nyoro04', 'assets/nyoro04.png');
        this.load.image('nyoro05', 'assets/nyoro05.png');
        this.load.image('nyoro06', 'assets/nyoro06.png');
        this.load.image('cross_btn', 'assets/cross_button.png');
        this.load.image('weapon_btn', 'assets/weapon_button.png');
        this.load.image('pc_readme', 'assets/pc_readme.png');

        this.load.audio('konpeitou', 'bgm/konpeitou.mp3');
        this.load.audio("sndLaser", "bgm/laser2.mp3");
        this.load.audio("sndDamage", "bgm/damage6.mp3");
        this.load.audio("sndExplode", "bgm/explosion9.mp3");
    }

    create() {
        this.game.sound.stopAll();
        stage = 'stage4';
        console.log('stage4');

        //bgm
        var music = this.sound.add('konpeitou', { volume: 4, loop: true });
        music.play();

        //animation
        this.anims.create({
            key: "enemy_weapon",
            frames: this.anims.generateFrameNumbers("enemy_weapon"),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: "electric",
            frames: this.anims.generateFrameNumbers("electric"),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: "explode",
            frames: this.anims.generateFrameNumbers("explode"),
            frameRate: 10,
            repeat: 0
        });

        //sound
        this.sfx = {
            explode: this.sound.add('sndExplode', { volume: 0.1, loop: false }),
            damage: this.sound.add('sndDamage', { volume: 0.1, loop: false }),
            laser: this.sound.add('sndLaser', { volume: 0.1, loop: false })
        };

        //group
        this.playerLasers = this.add.group();
        this.enemyLasers = this.add.group();
        this.dialogs = this.add.group();
        this.enemies = this.add.group();

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

        //敵の弾とプレイヤーの当たり判定
        this.physics.add.overlap(this.player, this.enemyLasers, function(player, laser) {
            if(!player.getData("isDead") && !player.getData("isClear")){
                player.onDestroy();
            } 
        });

        //敵とプレイヤーの当たり判定
        this.physics.add.overlap(this.player, this.enemies, function(player, enemy) {
            if(!enemy.getData("isDead") && !player.getData("isClear")){
                player.onDestroy();
            }            
        });

        //ボスとこちらの弾の当たり判定
        this.physics.add.overlap(this.playerLasers, this.enemies, function(playerLaser, enemy) {
            if (enemy && !enemy.getData("isDead")) {

                enemy.setTint(0xffffff);
                enemy.damage();
                playerLaser.destroy();
            }
        });

        this.bossTimer = this.time.addEvent({
            delay: 4000,
            callback: function() {
                //boss
                this.boss = new Nyoro2(
                    this,
                    game.config.width * 0.5,
                    -200,
                    "nyoro2",
                    200,
                    'stage5'
                );
                this.enemies.add(this.boss);

                //nyoro01
                this.enemy = new Nyoro(
                    this,
                    (game.config.width * 0.5) - 350,
                    -120,
                    "nyoro01",
                    280
                );
                this.enemies.add(this.enemy);
                
                //nyoro02
                this.enemy = new Nyoro(
                    this,
                    (game.config.width * 0.5) - 250,
                    -100,
                    "nyoro02",
                    300
                );
                this.enemies.add(this.enemy);

                //nyoro03
                this.enemy = new Nyoro(
                    this,
                    (game.config.width * 0.5) - 150,
                    -80,
                    "nyoro03",
                    320
                );
                this.enemies.add(this.enemy);

                //nyoro04
                this.enemy = new Nyoro(
                    this,
                    (game.config.width * 0.5) + 150,
                    -80,
                    "nyoro04",
                    320
                );
                this.enemies.add(this.enemy);

                //nyoro05
                this.enemy = new Nyoro(
                    this,
                    (game.config.width * 0.5) + 250,
                    -100,
                    "nyoro05",
                    300
                );
                this.enemies.add(this.enemy);

                //nyoro06
                this.enemy = new Nyoro(
                    this,
                    (game.config.width * 0.5) + 350,
                    -120,
                    "nyoro06",
                    280
                );
                this.enemies.add(this.enemy);
            },
            callbackScope: this,
            loop: false
        });

        


        //Input Events
        cursors = this.input.keyboard.createCursorKeys();
                
        //background
        var bg = new ScrollingBackground(this, 'bg04', 10);

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
            this.clearFlag = 1;
            this.player.setData("isClear", true);
            this.enemyLasers.children.iterate(function (child) {
                child.setVisible(false);
            });
            this.enemies.children.iterate(function (child) {
                //console.log(child);

                if(child.name == 'electric'){
                    child.setVisible(false);
                }
                
            });
        }
    }

}
