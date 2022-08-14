class StartMenu extends Phaser.Scene {

    constructor() {
        super({
            key: 'startMenu'
        });
    }

    preload() {
        this.load.image('title', 'assets/title.png');
        this.load.image('startBtn', 'assets/title_start_btn.gif');
        this.load.image('musicCaution', 'assets/music_caution.png');
        this.load.audio('theme', 'bgm/plutonium_moomin.mp3');
    }

    create() {
        var music = this.sound.add('theme', { volume: 1, loop: true });
        music.play();

        var startBtn = this.add.image(0, 0, 'startBtn').setOrigin(0, 0).setInteractive();
        var musicCaution = this.add.image(this.game.config.width * 0.5, 880, 'musicCaution');
        this.add.image(0, 0, 'title').setOrigin(0, 0);
        //var startBtn = this.add.image(200, 400, 'startBtn').setOrigin(0, 0).setInteractive().setDisplaySize(600,160);;
        
        
        startBtn.on('pointerdown', () => {
            this.game.sound.stopAll();
            this.scene.start('stage1');
        });
    }

    update() {}

}
