class Mii extends Boss {
    constructor(scene, x, y, key, stopY, nextScene) {
      
      super(scene, x, y, key, stopY, nextScene);
      this.body.velocity.y = 100;
      this.stopY = stopY;
      this.stopFlag = false;
      this.setDepth(-1);
      this.hitPoint = 200;
      this.nextScene = nextScene;
      this.shotFlag = 1;
      
      this.scene.time.addEvent({
        delay: 5000,
        callback: function() {
            this.shotFlag = 0;
        },
        callbackScope: this,
        loop: false
      });
    }

    update() {

        console.log(this.getData("isDead"));

        if(this.shotFlag == 0 && !this.getData("isDead")){
            var laser = new EnemyLaser(this.scene, this.x, this.y + 50);
            this.scene.enemyLasers.add(laser);    
            
            var laserArr = [1.570,2.356,3.141,-2.35,-1.57,-0.78,0,0.785];
            
            var j = 1;
            for (const elem of laserArr) {

                if(!this.getData("isDead")){

                    console.log(this.scene.boss.getData("isDead"));

                    this.scene.time.addEvent({
                        delay: j * 100 ,
                        callback: function() {
                            var laser = new EnemyLaserAngle(this.scene, this.x, this.y + 100, elem, 100);
                            this.scene.enemyLasers.add(laser); 
                        },
                        callbackScope: this,
                        loop: false
                    });
                    j++;
                }

            }

            this.shotFlag = 1;

            this.scene.time.addEvent({
                delay: 8000,
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