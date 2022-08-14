class Snif extends Boss {
    constructor(scene, x, y, key, stopY, nextScene) {
      
      super(scene, x, y, key, stopY, nextScene);
      this.scene = scene;
      this.body.velocity.y = 100;
      this.stopY = stopY;
      this.stopFlag = false;
      this.setDepth(-1);
      this.hitPoint = 200;
      this.nextScene = nextScene;
      this.shotFlag = 1;
      this.bossLaserFlag = 0;

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

            if(this.bossLaserFlag){
                var laserArr = [1.570,2.356,3.141,-2.35,-1.57,-0.78,0,0.785];
                this.bossLaserFlag = 0;
            }else{
                var laserArr = [1.963,2.748,-2.74,-1.96,-1.17,-0.39,0.392,1.178];
                this.bossLaserFlag = 1;
            }
            
            for (const elem of laserArr) {
                var laser = new EnemyLaserAngle(this.scene, this.x, this.y + 50, elem, 100);
                this.scene.enemyLasers.add(laser); 
            }

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