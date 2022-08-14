class Stage1 extends Phaser.Scene {

    constructor() {
        super({
            key: 'stage1'
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
    }

    preload() {
        this.load.spritesheet("explode", "assets/explode.png", {
            frameWidth: 160,
            frameHeight: 160
        });
        this.load.image('bg01', 'assets/bg_01.png');
        this.load.spritesheet('moomin', 'assets/moomin.png', { frameWidth: 134, frameHeight: 214 });
        this.load.spritesheet('enemy_weapon', 'assets/weapon_enemy.png', { frameWidth: 80, frameHeight: 80 });
        this.load.image('weapon', 'assets/weapon.png');
        this.load.image('karada_atsui', 'assets/dialog/karadaga_atsui.png');
        this.load.image('chichiue', 'assets/dialog/chichiue.png');
        this.load.image('stage1_last', 'assets/dialog/stage1_last.png');        
        this.load.image('moomin_parents', 'assets/moomin_parents.png');
        this.load.image('cross_btn', 'assets/cross_button.png');
        this.load.image('weapon_btn', 'assets/weapon_button.png');
        this.load.image('pc_readme', 'assets/pc_readme.png');

        this.load.audio('hokuou', 'bgm/hokuou.mp3');
        //this.load.audio('theme', 'bgm/plutonium_moomin.mp3');
        this.load.audio("sndLaser", "bgm/laser2.mp3");
        this.load.audio("sndDamage", "bgm/damage6.mp3");
        this.load.audio("sndExplode", "bgm/explosion9.mp3");
    }

    create() {
        stage = 'stage1';

        this.clearFlag = 0;

        //bgm
        var music = this.sound.add('hokuou', { volume: 1, loop: true });
        music.play();

        //animation
        this.anims.create({
            key: "enemy_weapon",
            frames: this.anims.generateFrameNumbers("enemy_weapon"),
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
            //theme: this.sound.add('theme', { volume: 1, loop: true }),
            explode: this.sound.add('sndExplode', { volume: 0.1, loop: false }),
            damage: this.sound.add('sndDamage', { volume: 0.1, loop: false }),
            laser: this.sound.add('sndLaser', { volume: 0.1, loop: false })
        };

        //this.sfx.theme.play();

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
            if(!enemy.getData("isDead")){
                player.setTint(0xff0000);
                player.onDestroy();
            }            
        });

        //体が熱い
        this.dialog_karada = new Dialog(
            this,
            game.config.width * 0.5,
            -200,
            "karada_atsui",
            450
        );
        this.dialogs.add(this.dialog_karada);

        this.stopTimer = this.time.addEvent({
            delay: 8000,
            callback: function() {
                this.dialog_chichiue = new Dialog(
                    this,
                    game.config.width * 0.5,
                    -200,
                    "chichiue",
                    460
                );

                this.dialogs.add(this.dialog_chichiue);
            },
            callbackScope: this,
            loop: false
        });

        this.stopTimer2 = this.time.addEvent({
            delay: 16000,
            callback: function() {
                this.stage1_last = new Dialog(
                    this,
                    game.config.width * 0.5,
                    -200,
                    "stage1_last",
                    460
                );

                this.dialogs.add(this.stage1_last);
            },
            callbackScope: this,
            loop: false
        });        

        this.bossTimer = this.time.addEvent({
            //delay: 1000,
            delay: 21000,
            callback: function() {
                //boss
                this.boss = new MoominParents(
                    this,
                    game.config.width * 0.5,
                    -200,
                    "moomin_parents",
                    170,
                    'stage2'
                );

                this.enemies.add(this.boss);
            },
            callbackScope: this,
            loop: false
        });
      
        //Input Events
        cursors = this.input.keyboard.createCursorKeys();
        var bg = new ScrollingBackground(this, 'bg01', 10);
      
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
        }
    }

}
