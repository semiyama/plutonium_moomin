 
 /*
 
 // 1.関数の定義
function setHeight() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}
  
window.onload = function() {
    // 2.初期化
    setHeight();

    // 3.ブラウザのサイズが変更された時・画面の向きを変えた時に再計算する
    window.addEventListener('resize', setHeight);
}*/

var cursors;

class Start extends Phaser.Scene {

    constructor() {
        super({
            key: 'start'
        });
    }

    preload() {
        this.load.image('start', 'assets/start.gif');
        //this.load.audio('daiku', 'bgm/daiku.mp3');
    }

    create() {
        this.pointer = this.input.activePointer;
        //var startBtn = this.add.image(0, game.config.height * 0.5 - 40, 'start').setOrigin(0, 0).setInteractive();
        var startBtn = this.add.image(0, 0, 'start').setOrigin(0, 0).setInteractive();

        /*
        var startBtn = this.add.image(200, 400, 'startBtn').setOrigin(0, 0).setInteractive().setDisplaySize(600,160);;

        startBtn.on('pointerdown', () => {
            this.scene.start('stage1');
        });*/

        startBtn.on('pointerdown', () => {
            this.game.sound.stopAll();
            this.scene.start('startMenu');
        });
    }

    update() {
        /*
        if(this.input.pointer1.isDown){
            this.scene.start('startMenu');
        }*/
    }

}

var config = {
    type: Phaser.AUTO,
    width: 980,
    height: 980,
    physics: {
        default: "arcade",
        arcade: {
          gravity: { x: 0, y: 0 }
        }
      },

    scene: [Start, StartMenu, Stage1, Stage2, Stage3, Stage4, Stage5, Stage6, Continue, Ending]
    //scene: [Stage5, Continue, Ending]
};

var game = new Phaser.Game(config);
var stage = '';