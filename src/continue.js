class Continue extends Phaser.Scene {

    constructor() {
        super({
            key: 'continue'
        });
    }

    preload() {
        this.load.image('continue', 'assets/continue_btn.png');
        this.load.image('restart', 'assets/restart_btn.png');
    }

    create() {
        this.game.sound.stopAll();

        var continueBtn = this.add.image(this.game.config.width * 0.5, 370, 'continue').setInteractive();
        var restartBtn = this.add.image(this.game.config.width * 0.5, 570, 'restart').setInteractive();

        console.log(stage);

        continueBtn.on('pointerdown', () => {
            this.scene.start(stage);
        });

        restartBtn.on('pointerdown', () => {
            this.scene.start('startMenu');
        });
    }

    update() {}

}