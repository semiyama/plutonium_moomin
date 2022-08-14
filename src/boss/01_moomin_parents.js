class MoominParents extends Boss {
    constructor(scene, x, y, key, stopY, nextScene) {
      
      super(scene, x, y, key, stopY, nextScene);
      this.body.velocity.y = 100;
      this.stopY = stopY;
      this.stopFlag = false;
      this.setDepth(-1);
      this.hitPoint = 150;
      this.nextScene = nextScene;
      this.shotFlag = 1;

      this.scene.time.addEvent({
        delay: 3000,
        callback: function() {
            this.shotFlag = 0;
        },
        callbackScope: this,
        loop: false
      });
    }

    update() {

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
            //乱数
            const randRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
            var explode = new Explode(this.scene, randRange(0,980), randRange(0,980));
            
        }

        if(this.stopY <= this.y && this.stopFlag == false){
            this.body.velocity.y = 0;
            this.stopFlag = true;
        }
    }
}