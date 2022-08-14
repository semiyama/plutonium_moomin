class Entity extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y, key, type) {
    super(scene, x, y, key);

    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.world.enableBody(this, 0);
    this.setData("type", type);
    this.setData("isDead", false);
  }

}

class Player extends Entity {
  constructor(scene, x, y, key) {
    super(scene, x, y, key, "Player");

    this.body.setSize(30,30,true);
    
    this.setData("speed", 320);
    this.setData("isShooting", false);
    this.setData("isClear", false);
    this.setData("timerShootDelay", 10);
    this.setData("timerShootTick", this.getData("timerShootDelay") - 1);
    this.anims.create({
        key: 'left',
        frames: [ { key: 'moomin', frame: 0 } ],
        frameRate: 20
    });
    this.anims.create({
        key: 'turn',
        frames: [ { key: 'moomin', frame: 1 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: [ { key: 'moomin', frame: 2 } ],
        frameRate: 20
    });
  }

  moveUp() {
    if(!this.getData("isDead") && 115 <= this.y){
      this.body.velocity.y = -this.getData("speed");
    }
  }
  moveDown() {
    if(!this.getData("isDead") && this.y <= 865){
      this.body.velocity.y = this.getData("speed");
    }
  }
  moveLeft() {
    if(!this.getData("isDead") && 75 <= this.x){
      this.body.velocity.x = -this.getData("speed");
    }
  }
  moveRight() {
    if(!this.getData("isDead") && this.x <= 905){
      this.body.velocity.x = this.getData("speed");
    }
  }

  animLeft(){
    if(!this.getData("isDead")){
      this.play('left');
    }
  }
  animTurn(){
    if(!this.getData("isDead")){
      this.play('turn');
    }
  }
  animRight(){
    if(!this.getData("isDead")){
      this.play('right');
    }
  }

  onDestroy() {
    this.setData("isDead", true);
    this.setVisible(false);
    var explode = new Explode(this.scene, this.x, this.y);
    this.scene.sfx.explode.play();
    //game.sound.stopAll();        
    
    this.scene.time.addEvent({ // go to game over scene
      delay: 1000,
      callback: function() {
        this.scene.scene.start("continue");
      },
      callbackScope: this,
      loop: false
    });

    
  }

  update() {
    this.body.setVelocity(0, 0);
    this.x = Phaser.Math.Clamp(this.x, 0, this.scene.game.config.width);
    this.y = Phaser.Math.Clamp(this.y, 0, this.scene.game.config.height);

    if (this.getData("isShooting") && !this.getData("isDead")) {
      if (this.getData("timerShootTick") < this.getData("timerShootDelay")) {
        this.setData("timerShootTick", this.getData("timerShootTick") + 1); // every game update, increase timerShootTick by one until we reach the value of timerShootDelay
      }
      else { // when the "manual timer" is triggered:
        var laser = new PlayerLaser(this.scene, this.x, this.y - 100);
        this.scene.playerLasers.add(laser);
      
        //this.scene.sfx.laser.play(); // play the laser sound effect
        this.setData("timerShootTick", 0);
      }
    }
  }
}

class PlayerLaser extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, "weapon");
    this.body.velocity.y = -600;
    this.scene.sfx.laser.play();
  }
}

class Dialog extends Entity {
  constructor(scene, x, y, key, stopY) {
    
    super(scene, x, y, key);
    this.body.velocity.y = 200;
    this.stopY = stopY;
    this.stopFlag = false;
    this.setDepth(-1);
  }

  update() {
    if(this.stopY <= this.y && this.stopFlag == false){
      this.body.velocity.y = 0;
      this.stopFlag = true;

      this.stopTimer = this.scene.time.addEvent({
        delay: 3000,
        callback: function() {
          this.body.velocity.y = 200;
        },
        callbackScope: this,
        loop: false
      });
    }
  }
}

class Boss extends Entity {
  constructor(scene, x, y, key, stopY, nextScene) {
    
    super(scene, x, y, key);
    this.scene = scene;
    this.body.velocity.y = 100;
    this.stopY = stopY;
    this.stopFlag = false;
    this.setDepth(-1);
    this.hitPoint = 30;
    this.nextScene = nextScene;
  }

  update() { 

  }

  damage(){

    if(!this.getData("isDead")){
      this.setTintFill(0xffffff);
      this.hitPoint --;
      this.scene.sfx.damage.play();
  
      if(this.hitPoint <= 0){
        this.onDestroy();
      }
  
      this.damageTimer = this.scene.time.addEvent({
        delay: 10,
        callback: function() {
            this.clearTint();
        },
        callbackScope: this,
        loop: false
      });
    }
  }

  onDestroy(){
    this.setData("isDead", true);

    for (let i = 0; i < 50; i++) {
      var random = Phaser.Math.Between(100, 300);
      this.scene.time.addEvent({
        delay: i * random,
        callback: function() {
          this.scene.sfx.explode.play();
        },
        callbackScope: this,
        loop: false
      });
    }  

    this.scene.time.addEvent({
      delay: 7000,
      callback: function() {
        this.scene.scene.start(this.nextScene);
      },
      callbackScope: this,
      loop: false
    });

  }
}

class Enemy extends Entity {
  constructor(scene, x, y, key, stopY) {
    
    super(scene, x, y, key);
    this.body.velocity.y = 100;
    this.stopY = stopY;
    this.stopFlag = false;
    this.setDepth(-1);
    this.hitPoint = 30;
  }

  update() {
    if(this.stopY <= this.y && this.stopFlag == false && !this.getData("isDead")){
      this.body.velocity.y = 0;
      this.stopFlag = true;
    }
  }

  damage(){
    if(!this.getData("isDead")){
      this.setTintFill(0xffffff);
      this.hitPoint --;
  
      if(this.hitPoint <= 0){
        this.onDestroy();
      }
  
      this.damageTimer = this.scene.time.addEvent({
        delay: 10,
        callback: function() {
            this.clearTint();
        },
        callbackScope: this,
        loop: false
      });
    }
  }

  onDestroy(){
    this.setData("isDead", true);   

    this.scene.tweens.add({
        targets: this,
        alpha: 0,
        duration: 5000,
        ease: 'Power2'
    }, this.scene);

    this.scene.time.addEvent({
      delay: 7000,
      callback: function() {
        this.destroy();
      },
      callbackScope: this,
      loop: false
    });
  }
}

class AtField extends Enemy {
  constructor(scene, x, y, key, stopY) {
    
    super(scene, x, y, key, stopY);
    this.body.velocity.y = 100;
    this.stopY = stopY;
    this.stopFlag = false;
    this.setDepth(-1);
    this.hitPoint = 200;
    this.scene.sfx.at_field.play();
  }
    
  damage(){

    if(!this.getData("isDead")){
      this.setTintFill(0xffffff);
      this.hitPoint --;
      this.scene.sfx.damage.play();
  
      if(this.hitPoint <= 0){
        this.onDestroy();
      }
  
      this.damageTimer = this.scene.time.addEvent({
        delay: 10,
        callback: function() {
            this.clearTint();
        },
        callbackScope: this,
        loop: false
      });
    }
  }
}

class Nyoro extends Enemy {
  constructor(scene, x, y, key, stopY) {
    
    super(scene, x, y, key, stopY);
    this.body.velocity.y = 100;
    this.x = x;
    this.y = y;
    this.stopY = stopY;
    this.stopFlag = false;
    this.setDepth(-1);
    this.hitPoint = 5;
    this.shotFlag = 1;

    //乱数
    const randRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
          
    this.scene.time.addEvent({
      delay: randRange(3000,6000),
      callback: function() {
          this.shotFlag = 0;
      },
      callbackScope: this,
      loop: false
    });
  }

  update() {
    if(this.shotFlag == 0 && !this.getData("isDead")){
        var laser = new EnemyLaser(this.scene, this.x, this.y);
        this.scene.enemyLasers.add(laser);           
        this.shotFlag = 1;

        var min = 14000 ;
        var max = 20000 ;
        var delay = Math.floor( Math.random() * (max + 1 - min) ) + min ;

        this.scene.time.addEvent({
            delay: delay,
            callback: function() {
                this.shotFlag = 0;
            },
            callbackScope: this,
            loop: false
        });
    }

    if(this.stopY <= this.y && this.stopFlag == false){
        this.body.velocity.y = 0;
        this.stopFlag = true;
    }
  }

  onDestroy(){
    this.setData("isDead", true);   
    this.setVisible(false);

    var explode = new Explode(this.scene, this.x, this.y);
    this.scene.sfx.explode.play();

    this.scene.time.addEvent({
      delay: 7000,
      callback: function() {
        this.scene.nyoroDestroyCount++;
        this.destroy();
      },
      callbackScope: this,
      loop: false
    });
  }

  damage(){

    if(!this.getData("isDead")){
      this.setTintFill(0xffffff);
      this.hitPoint --;
      this.scene.sfx.damage.play();
  
      if(this.hitPoint <= 0){
        this.onDestroy();
      }
  
      this.damageTimer = this.scene.time.addEvent({
        delay: 10,
        callback: function() {
            this.clearTint();
        },
        callbackScope: this,
        loop: false
      });
    }
  }
}

class MechaMoomin extends Enemy {
  constructor(scene, x, y, key, stopY) {
    
    super(scene, x, y, key, stopY);
    this.body.velocity.y = 100;
    this.x = x;
    this.y = y;
    this.stopY = stopY;
    this.stopFlag = false;
    this.setDepth(-2);
    this.hitPoint = 30;
    this.shotFlag = 1;
    this.destroyCount = 0;

    //乱数
    const randRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
          
    this.scene.time.addEvent({
      delay: randRange(2000,4000),
      callback: function() {
          this.shotFlag = 0;
      },
      callbackScope: this,
      loop: false
    });
  }

  update() {
    if(this.shotFlag == 0 && !this.getData("isDead")){
        var laser = new EnemyLaser(this.scene, this.x, this.y);
        this.scene.enemyLasers.add(laser);           
        this.shotFlag = 1;

        var min = 15000 ;
        var max = 20000 ;
        const randRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
        var delay = randRange(15000, 18000);

        this.scene.time.addEvent({
            delay: delay,
            callback: function() {
                this.shotFlag = 0;
            },
            callbackScope: this,
            loop: false
        });
    }

    if(this.stopY <= this.y && this.stopFlag == false){
        this.body.velocity.y = 0;
        this.stopFlag = true;
    }
  }

  onDestroy(){
    this.setData("isDead", true);   
    this.setVisible(false);

    var explode = new Explode(this.scene, this.x, this.y);
    this.scene.sfx.explode.play();

    this.scene.time.addEvent({
      delay: 2000,
      callback: function() {
        this.scene.boss.setData("mechaDestroyCount", this.scene.boss.getData("mechaDestroyCount") + 1);

        console.log('mechaDestroyCount:' + this.scene.boss.getData("mechaDestroyCount"));

        this.destroy();
      },
      callbackScope: this,
      loop: false
    });
  }

  damage(){

    if(!this.getData("isDead")){
      this.setTintFill(0xffffff);
      this.hitPoint --;
      this.scene.sfx.damage.play();
  
      if(this.hitPoint <= 0){
        this.onDestroy();
      }
  
      this.damageTimer = this.scene.time.addEvent({
        delay: 10,
        callback: function() {
            this.clearTint();
        },
        callbackScope: this,
        loop: false
      });
    }
  }
}

class Electric extends Enemy {
  constructor(scene, x, y, key, stopY) {
    
    super(scene, x, y, key, stopY);
    //this.body.velocity.y = 130;
    this.x = x;
    this.y = y;
    this.setDepth(-1);
    this.hitPoint = 1;
    this.shotFlag = 0;
    this.name = 'electric';

    var weaponType;
    weaponType = 'electric';
    this.play(weaponType);
    scene.physics.moveToObject(this, scene.player, 75);  

    this.body.setSize(150,150,true);
  }

  update() {

  }

  onDestroy(){
    this.setData("isDead", true);   
    this.setVisible(false);

    var explode = new Explode(this.scene, this.x, this.y);
    this.scene.sfx.explode.play();

    this.scene.time.addEvent({
      delay: 7000,
      callback: function() {
        this.destroy();
      },
      callbackScope: this,
      loop: false
    });
  }
}

class Inferno extends Enemy {
  constructor(scene, x, y, key, stopY) {
    
    super(scene, x, y, key, stopY);
    this.body.velocity.y = 100;
    this.x = x;
    this.y = y;
    this.setDepth(-1);
    this.hitPoint = 1;
    this.shotFlag = 0;
    this.name = 'inferno';

    var weaponType;
    weaponType = 'inferno';
    this.play(weaponType);
    //scene.physics.moveToObject(this, scene.player, 200);  

    this.body.setSize(140,200,true);
  }

  update() {

  }

  onDestroy(){
    this.setData("isDead", true);   
    this.setVisible(false);

    var explode = new Explode(this.scene, this.x, this.y);
    this.scene.sfx.explode.play();

    this.scene.time.addEvent({
      delay: 7000,
      callback: function() {
        this.destroy();
      },
      callbackScope: this,
      loop: false
    });
  }
}

class EnemyLaser extends Entity {

  constructor(scene, x, y) {
    var weaponType;
    if(stage == 'stage5'){
      weaponType = 'enemy_weapon_blue';
    }else{
      weaponType = 'enemy_weapon';
    }
    super(scene, x, y, weaponType);
    this.play(weaponType);
    //scene.physics.moveToObject(this, scene.player, 200);  

    scene.physics.moveToObject(this, scene.player, 100);  
  }
}

class EnemyLaserAngle extends Entity {
  constructor(scene, x, y, angle, speed) {
    var weaponType;
    if(stage == 'stage5'){
      weaponType = 'enemy_weapon_blue';
    }else{
      weaponType = 'enemy_weapon';
    }
    super(scene, x, y, weaponType);
    this.play(weaponType);

    this.body.velocity.x = 0;
    this.body.velocity.y = 0;

    scene.physics.velocityFromRotation(angle,speed,this.body.velocity);
  }
}

class Cross extends Entity {

  constructor(scene, x, y) {
    var weaponType;
    weaponType = 'cross_anime';
    super(scene, x, y, weaponType);
    this.play(weaponType);
    this.body.setSize(140,200,true);
    this.scene.sfx.kirakira.play();
    this.name = 'cross';

    this.scene.time.addEvent({
      delay: 4000,
      callback: function() {
        if(!this.scene.boss.getData("isDead")){
          this.scene.sfx.bomber.play();
          var crossBomber = new CrossBomber(this.scene, this.x, this.y);
          this.scene.enemyLasers.add(crossBomber);  
          this.destroy();
        }
      },
      callbackScope: this,
      loop: false
    });

    /*
    this.scene.time.addEvent({
      delay: 4500,
      callback: function() {
        this.destroy();
      },
      callbackScope: this,
      loop: false
    });*/
    
  }
}

class CrossBomber extends Entity {

  constructor(scene, x, y) {
    var weaponType;
    weaponType = 'cross_bomber';
    super(scene, x, y, weaponType);
    this.play(weaponType);
    this.body.setSize(140,200,true);
    this.name = 'crossBomber';


    //this.scene.sfx.kirakira.play();

    /*
    this.scene.time.addEvent({
      delay: 4000,
      callback: function() {
        this.scene.sfx.bomber.play();
        
        this.destroy();
      },
      callbackScope: this,
      loop: false
    });
    */

    
    this.scene.time.addEvent({
      delay: 500,
      callback: function() {
        this.destroy();
      },
      callbackScope: this,
      loop: false
    });
    
  }
}

class Explode extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, "explode");
    this.play("explode");
  }
}

class ScrollingBackground {
  constructor(scene, key, velocityY) {
      this.scene = scene;
      this.key = key;
      this.velocityY = velocityY;

      this.layers = this.scene.add.group();

      this.createLayers();
  }

  createLayers() {

    var layer = this.scene.add.sprite(0, -980, this.key).setOrigin(0);
    layer.setDepth(-2);
    this.scene.physics.world.enableBody(layer, 0);
    layer.body.velocity.y = 80;
    this.layers.add(layer);

    this.scene.time.addEvent({
      delay: 10000,
      callback: function() {
        this.layers.children.iterate(function (child) {
          child.body.velocity.y = 40;
        });
      },
      callbackScope: this,
      loop: false
    });

    this.scene.time.addEvent({
      delay: 13000,
      callback: function() {
        this.layers.children.iterate(function (child) {
          child.body.velocity.y = 20;
        });
      },
      callbackScope: this,
      loop: false
    });

    this.scene.time.addEvent({
      delay: 15000,
      callback: function() {
        this.layers.children.iterate(function (child) {
          child.body.velocity.y = 0;
        });
      },
      callbackScope: this,
      loop: false
    });      
  }
  
  update() {

  }
}