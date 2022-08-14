class Snafkin extends Boss {
    constructor(scene, x, y, key, stopY, nextScene) {
      
      super(scene, x, y, key, stopY, nextScene);
      this.body.velocity.y = 100;
      this.stopY = stopY;
      this.stopFlag = false;
      this.setDepth(-1);
      this.hitPoint = 500;
      this.nextScene = nextScene;
      this.shotFlag = 1;
      this.crossFlag = 0;
      this.crossOk = 1;
      this.shotOk = 1;

      this.setData("atFieldOpened",false);
      this.setData("atFieldFlag",false);
      this.setData("atFieldEvent",false);
      this.setData("mechaMoominFlag",false);
      this.setData("mechaMoominEvent",false);
      this.setData("mechaMoominShowed",false);
      this.setData("mechaDestroyCount",0);
      /*
      this.mechaMoominFlag = false;
      this.mechaMoominEvent = false;
      this.atFieldOpened = false;
      this.mechaMoominShowed = false;
      this.mechaDestroyCount = 0;*/

      this.scene.time.addEvent({
        delay: 5000,
        callback: function() {
            this.shotFlag = 0;
            this.infernoFlag = 0;
        },
        callbackScope: this,
        loop: false
      });

      
      this.scene.time.addEvent({
        delay: 5500,
        callback: function() {
            var cross = new Cross(this.scene, 100, 500);

        },
        callbackScope: this,
        loop: false
      });

      this.scene.time.addEvent({
        delay: 5800,
        callback: function() {
            var cross = new Cross(this.scene, 490, 500);
        },
        callbackScope: this,
        loop: false
      });

      this.scene.time.addEvent({
        delay: 6100,
        callback: function() {
            var cross = new Cross(this.scene, 880, 500);
        },
        callbackScope: this,
        loop: false
      });

    }

    update() {
        //乱数
        const randRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

        //イベント終了後にタイマーセットし、すぐに十字架が発動しないようにする
        if((this.getData("atFieldFlag") && !this.getData("atFieldEvent") && !this.getData("mechaMoominFlag"))){
            this.scene.time.addEvent({
                delay: 3000,
                callback: function() {
                    this.crossOk = 1;
                    this.shotOk = 1;
                },
                callbackScope: this,
                loop: false
            });
        }
        
        if(this.crossFlag == 0 && !this.getData("isDead") && 4 <= this.getData("mechaDestroyCount")){
            var cross = new Cross(this.scene, (140 * randRange(0,6))+70, 880);
            this.scene.crosses.add(cross); 
       
            this.crossFlag = 1;

            this.scene.time.addEvent({
                delay: 10000,
                callback: function() {
                    this.crossFlag = 0;
                },
                callbackScope: this,
                loop: false
            });
        }

        if(this.shotFlag == 0 && !this.getData("isDead") && !this.getData("atFieldEvent") && !this.getData("mechaMoominEvent") && this.shotOk == 1){
            var laser = new EnemyLaser(this.scene, this.x - 85, this.y + 50);
            this.scene.enemyLasers.add(laser);        
            
            if(4 <= this.getData("mechaDestroyCount")){
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
            var explode = new Explode(this.scene, randRange(0,980), randRange(0,980));
        }

        if(this.stopY <= this.y && this.stopFlag == false){
            this.body.velocity.y = 0;
            this.stopFlag = true;
        }

        //体力減少時、ATフィールド展開フラグを立てる



        if(this.hitPoint < 400 && !this.getData("atFieldFlag")){
            this.setData("atFieldFlag", true);
            this.setData("atFieldEvent", true);
            this.crossOk = 0;
            this.shotOk = 0;
        }

        console.log('mechaMoominFlag:' + this.getData("mechaMoominFlag"));
        console.log('mechaMoominEvent:' + this.getData("mechaMoominEvent"));

        //体力減少時、メカムーミン展開フラグを立てる
        if(this.hitPoint < 300 && !this.getData("mechaMoominFlag")){
            this.setData("mechaMoominFlag", true);
            this.setData("mechaMoominEvent", true);
            this.crossOk = 0;
            this.shotOk = 0;
        }
    }
}