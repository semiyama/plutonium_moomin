class Nyoro2 extends Boss {
    constructor(scene, x, y, key, stopY, nextScene) {
      
      super(scene, x, y, key, stopY, nextScene);
      this.body.velocity.y = 100;
      this.stopY = stopY;
      this.stopFlag = false;
      this.setDepth(-1);
      this.hitPoint = 75;
      this.nextScene = nextScene;
      this.shotFlag = 1;
      this.shotFlag2 = 1;
      this.body.setSize(160,390,true);
      
      //乱数
      const randRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

      this.scene.time.addEvent({
        delay: randRange(5000,8000),
        callback: function() {
            this.shotFlag = 0;
        },
        callbackScope: this,
        loop: false
      });

      this.scene.time.addEvent({
        delay: randRange(5000,8000),
        callback: function() {
            this.shotFlag2 = 0;
        },
        callbackScope: this,
        loop: false
      });
    }

    update() {
        //乱数
        const randRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);
        
        if(this.shotFlag == 0 && !this.getData("isDead")){
            var laser = new Electric(this.scene, this.x + 300, this.y);

            this.scene.enemies.add(laser);           
            this.shotFlag = 1;

            console.log(this.scene.nyoroDestroyCount);

            if(6 <= this.scene.noryoDestroyCount){
                this.scene.time.addEvent({
                    delay: randRange(8000,10000),
                    callback: function() {
                        this.shotFlag = 0;
                    },
                    callbackScope: this,
                    loop: false
                });
            }else{
                this.scene.time.addEvent({
                    delay: randRange(10000,15000),
                    callback: function() {
                        this.shotFlag = 0;
                    },
                    callbackScope: this,
                    loop: false
                });
            }

            
        }

        if(this.shotFlag2 == 0 && !this.getData("isDead")){
            var laser2 = new Electric(this.scene, this.x - 300, this.y);

            this.scene.enemies.add(laser2);           
            this.shotFlag2 = 1;

            this.scene.time.addEvent({
                delay: randRange(10000,15000),
                callback: function() {
                    this.shotFlag2 = 0;
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