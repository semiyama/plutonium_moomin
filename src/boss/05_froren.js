class Froren extends Boss {
    constructor(scene, x, y, key, stopY, nextScene) {
      
      super(scene, x, y, key, stopY, nextScene);
      this.body.velocity.y = 100;
      this.stopY = stopY;
      this.stopFlag = false;
      this.setDepth(-1);
      this.hitPoint = 300;
      this.nextScene = nextScene;
      this.shotFlag = 1;
      this.infernoFlag = 1;
            
      this.scene.time.addEvent({
        delay: 5000,
        callback: function() {
            this.shotFlag = 0;
            this.infernoFlag = 0;
        },
        callbackScope: this,
        loop: false
      });
    }

    update() {
        //乱数
        const randRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

        //生存中は炎をランダムに出し続ける
        if(this.infernoFlag == 0 && !this.getData("isDead")){
            var inferno = new Inferno(this.scene, 140 * randRange(0,6) + 70, 0);
            this.scene.enemies.add(inferno);  
            this.infernoFlag = 1;

            this.scene.time.addEvent({
                delay: 2500,
                callback: function() {
                    this.infernoFlag = 0;
                },
                callbackScope: this,
                loop: false
            });
        }
        
        if(this.shotFlag == 0 && !this.getData("isDead")){
            var laser = new EnemyLaser(this.scene, this.x, this.y + 50);
            this.scene.enemyLasers.add(laser);            

            this.shotFlag = 1;

            this.scene.time.addEvent({
                delay: 6000,
                callback: function() {
                    this.shotFlag = 0;
                },
                callbackScope: this,
                loop: false
            });
        }

        //ボス撃破時
        else if(this.getData("isDead")){
            var explode = new Explode(this.scene, randRange(0,980), randRange(0,980));
        }

        if(this.stopY <= this.y && this.stopFlag == false){
            this.body.velocity.y = 0;
            this.stopFlag = true;
        }
    }
}