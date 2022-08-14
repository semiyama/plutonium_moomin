class Ending extends Phaser.Scene {

    constructor() {
        super({
            key: 'ending'
        });

    }

    preload() {
        this.load.image('staff_roll', 'assets/dialog/staff_roll01.png');
        this.load.image('staff_roll2', 'assets/dialog/staff_roll02.png');
        this.load.image('end', 'assets/dialog/end.png');
    }

    create() {
        console.log('ending');
        
        var staffRoll = this.physics.add.sprite(game.config.width * 0.5, game.config.height, 'staff_roll').setOrigin(0.5, 0);
        var staffRoll2 = this.physics.add.sprite(0, game.config.height, 'staff_roll2').setOrigin(0, 0);

        this.stopTimer = this.time.addEvent({
            delay: 1000,
            callback: function() {
                staffRoll.body.velocity.y = -80;
            },
            callbackScope: this,
            loop: false
        });

        this.stopTimer = this.time.addEvent({
            delay: 18000,
            callback: function() {
                staffRoll2.body.velocity.y = -40;
            },
            callbackScope: this,
            loop: false
        });

        
        var end = this.add.image(game.config.width * 0.5, game.config.height * 0.5, 'end').setAlpha(0);

        this.stopTimer = this.time.addEvent({
            delay: 126000,
            callback: function() {
                this.tweens.add({
                    targets: end,
                    alpha: 1,
                    duration: 3000,
                    ease: 'Power2'
                }, this);
            },
            callbackScope: this,
            loop: false
        });

        
    }

    update() {
        
    }

}
