"use strict";

class TreeLevel extends BaseLevelScene {
    constructor() {
        super({key: 'TreeLevel'})
    }

    preload() {
        super.preload();

        this.load.spritesheet('animcat', 'assets/images/cat_walking_animated.png', {frameWidth: 97, frameHeight: 101});
        this.load.image('branch', 'assets/images/TreeLevel/branch.png');
        this.load.image('ground', 'assets/images/TreeLevel/bottom_green_60px.png');
        this.load.spritesheet('bird', 'assets/images/bird_flying_animated.png', {frameWidth: 30, frameHeight: 30});
        this.load.spritesheet('animmouse', 'assets/images/mouse_left_animated.png', {frameWidth: 30, frameHeight: 20});
        this.load.image('birddropping', 'assets/images/bird_dropping.png');
        this.load.image('birdhouse', 'assets/images/bird_house.png');
        this.load.image('goal', 'assets/images/house_home_transparent.png');

        this.load.audio('backgroundmusictree', 'assets/sounds/music/A_Mission.ogg');
        this.load.audio("catjump", "assets/sounds/movement/jump_sfx_movement_jump8.wav");
        this.load.audio("meow", "assets/sounds/animals/cat_meow1.ogg");
        this.load.audio("poopsound", "assets/sounds/animals/birdpoop.ogg");
    }

    create() {
        this.inAir = false;
        let numOfMice = 20;

        this.music = this.sound.add('backgroundmusictree', {volume: 0.5});
        try {
            this.music.play();
        } catch {
            console.log('no audio possible');
        }

        const worldheight = this.game.config.height * 10;
        this.physics.world.setBounds(0, 0, this.game.config.width, worldheight, true, true, true, true);

        this.cameras.main.setBackgroundColor('#89C0FF');
        this.cameras.main.setBounds(0, 0, this.game.config.width, worldheight);

        const platforms = this.physics.add.staticGroup();

        this.ground = this.physics.add.image(this.game.config.width / 2, worldheight, 'ground');
        this.ground.body.setAllowGravity(0, 0);
        this.ground.body.immovable = true;

        this.goal = this.physics.add.image(this.game.config.width - 64, worldheight - 75, 'goal');
        this.goal.body.setAllowGravity(0, 0);

        let birdhouse;
        platforms.create(50, 100, 'branch');
        platforms.create(300, 200, 'branch').flipX = true;
        birdhouse = this.physics.add.image(425, 179, 'birdhouse');
        birdhouse.body.setAllowGravity(0, 0);

        platforms.create(700, 400, 'branch').flipX = true;
        platforms.create(500, 500, 'branch');
        platforms.create(300, 700, 'branch');
        platforms.create(100, 800, 'branch').flipX = true;
        platforms.create(300, 900, 'branch');
        platforms.create(650, 1000, 'branch');
        birdhouse = this.physics.add.image(525, 979, 'birdhouse');
        birdhouse.body.setAllowGravity(0, 0);

        platforms.create(200, 1100, 'branch');
        platforms.create(400, 1300, 'branch').flipX = true;
        platforms.create(750, 1400, 'branch');
        platforms.create(50, 1550, 'branch');
        platforms.create(300, 1700, 'branch');
        platforms.create(750, 1800, 'branch').flipX = true;
        platforms.create(500, 2000, 'branch').flipX = true;
        birdhouse = this.physics.add.image(625, 1979, 'birdhouse');
        birdhouse.body.setAllowGravity(0, 0);

        platforms.create(400, 2150, 'branch');
        platforms.create(100, 2250, 'branch').flipX = true;
        platforms.create(200, 2300, 'branch');
        platforms.create(700, 2400, 'branch');
        platforms.create(300, 2500, 'branch').flipX = true;
        platforms.create(750, 2600, 'branch');
        platforms.create(200, 2750, 'branch').flipX = true;
        platforms.create(600, 3000, 'branch');
        platforms.create(500, 3100, 'branch');
        birdhouse = this.physics.add.image(375, 3079, 'birdhouse');
        birdhouse.body.setAllowGravity(0, 0);

        platforms.create(50, 3250, 'branch');
        platforms.create(700, 3300, 'branch').flipX = true;
        platforms.create(300, 3400, 'branch');
        platforms.create(50, 3650, 'branch');
        platforms.create(400, 3800, 'branch').flipX = true;
        platforms.create(300, 4000, 'branch');
        platforms.create(500, 4200, 'branch').flipX = true;
        platforms.create(300, 4350, 'branch').flipX = true;
        platforms.create(100, 4500, 'branch');
        platforms.create(400, 4600, 'branch');
        birdhouse = this.physics.add.image(275, 4579, 'birdhouse');
        birdhouse.body.setAllowGravity(0, 0);

        platforms.create(200, 4750, 'branch');
        platforms.create(700, 4800, 'branch').flipX = true;
        platforms.create(300, 4900, 'branch').flipX = true;
        platforms.create(500, 5100, 'branch');
        platforms.create(200, 5200, 'branch');
        platforms.create(50, 5400, 'branch').flipX = true;
        platforms.create(300, 5500, 'branch');
        platforms.create(700, 5750, 'branch');
        birdhouse = this.physics.add.image(575, 5729, 'birdhouse');
        birdhouse.body.setAllowGravity(0, 0);

        this.cat = this.physics.add.sprite(100, 0, 'animcat');
        this.cat.setBounce(0.2);
        this.cat.setCollideWorldBounds(true);
        this.cameras.main.startFollow(this.cat);
        this.cat.body.gravity.y = 300;
        this.cat.setSize(50, 50, true);
        this.anims.remove('idle');
        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('animcat', {start: 1, end: 1}),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.remove('walk');
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('animcat', {start: 1, end: 4}),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.remove('stand');
        this.anims.create({
            key: 'stand',
            frames: [{key: 'animcat', frame: 0}],
            frameRate: 20,
        });

        this.bird = this.physics.add.sprite(-100, -100, 'bird');
        this.bird.setBounceY(0);
        this.bird.body.allowGravity = false;
        this.bird.body.setCollideWorldBounds(false);
        this.bird.flying = false;
        this.anims.remove('fly');
        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('bird', {start: 0, end: 1}),
            frameRate: 10,
            repeat: -1
        });
        this.bird.anims.play('fly');

        this.birdpoops = this.physics.add.group();

        this.mice = this.physics.add.group();
        this.anims.remove('mousewalk');
        this.anims.create({
            key: 'mousewalk',
            frames: this.anims.generateFrameNumbers('animmouse', {start: 0, end: 1}),
            frameRate: 10,
            repeat: -1
        });
        for (let i = 0; i < numOfMice; i++) {
            let x = Phaser.Math.Between(0, this.game.config.width);
            let y = Phaser.Math.Between(600, worldheight - 100);
            let mouse = this.mice.create(x, y, 'mouse');
            mouse.body.setCollideWorldBounds(true);
            mouse.anims.play('mousewalk');
            if (i % 2 == 0) {
                mouse.flipX = true;
            }
            if (Phaser.Math.Between(1, 2) == 1) {
                mouse.setVelocityX(600);
                mouse.flipX = true;
            } else {
                mouse.setVelocityX(-600);
                mouse.flipX = false;
            }
        }

        this.physics.add.collider(this.cat, platforms);
        this.physics.add.collider(this.cat, this.ground)
        this.physics.add.overlap(this.cat, this.mice, (cat, mouse) => {
            this.addScore();
            mouse.disableBody(true, true);
            try {
                this.sound.play("meow");
            } catch {
                console.log('no audio possible');
            }
        });
        this.physics.add.collider(this.cat, this.birdpoops, () => {
            this.catDies(this.cat);
        });
        this.physics.add.collider(this.cat, this.goal, () => {
            this.addScore(100);
            this.addScore(Math.floor(this.timeLeft));
            this.startNextLevel();
        });
        this.physics.add.collider(this.mice, platforms);
        this.physics.add.collider(this.mice, this.ground);
        this.physics.add.collider(this.birdpoops, platforms, (poop, platform) => {
            poop.disableBody(true, true);
        });

        super.create();
    }

    update(time, delta) {
        super.update(time, delta);

        let poopiness = 20;
        let poopsize = 5;

        this.inAir = false;
        if (Math.abs(this.cat.body.velocity.y) > 3) {
            this.inAir = true;
        }

        this.mice.children.iterate((mouse) => {
            if (!mouse.body.touching.down) {
                if (mouse.flipX == true) {
                    mouse.setVelocityX(-600);
                    mouse.flipX = false;
                } else {
                    mouse.setVelocityX(600);
                    mouse.flipX = true;
                }
            }
            if (mouse.body.blocked.right) {
                mouse.setVelocityX(-600);
                mouse.flipX = false;
            }
            if (mouse.body.blocked.left) {
                mouse.setVelocityX(600);
                mouse.flipX = true;
            }
        });

       
        if (this.bird.flying) {
            if (Phaser.Math.Between(1, 1000) <= poopiness && this.bird.y > 250) {
                let birdpoop = this.birdpoops.create(this.bird.x, this.bird.y+25, 'birddropping').setScale(3);
                birdpoop.setBounceY(0);
                birdpoop.setMass(0.1);
                birdpoop.setSize(poopsize, poopsize, true);
                birdpoop.body.allowGravity = true;
                birdpoop.body.setCollideWorldBounds(false);

                try {
                    this.sound.play("poopsound");
                } catch {
                    console.log('no audio possible');
                }
            }
            if (this.bird.x < 0 || this.bird.x > this.game.config.width) {
                this.bird.flying = false;
            }
        } else if (Phaser.Math.Between(1, 100) < 10) {
            if (Phaser.Math.Between(1, 2) == 1) {
                this.bird.x = 0;
                this.bird.y = this.cameras.main.scrollY + Phaser.Math.Between(10, 300);
                this.bird.setVelocityX(400);
                this.bird.flipX = true;
            } else {
                this.bird.x = this.game.config.width;
                this.bird.y = this.cameras.main.scrollY + Phaser.Math.Between(10, 300);
                this.bird.setVelocityX(-400);
                this.bird.flipX = false;
            }
            this.bird.flying = true;
        }
    }

    buttonPressedLeft(pressed) {
        if (pressed) {
            this.cat.setVelocityX(-500);
            this.cat.anims.play('walk', true);
        } else {
            this.cat.setVelocityX(0);
            this.cat.anims.play('idle', true);
            if (!(this.inAir)){
                this.cat.anims.play('stand');
            }
        }

        if (this.cat.flipX === false) {
            this.cat.flipX = true;
        }
    }

    buttonPressedRight(pressed) {
        if (pressed) {
            this.cat.setVelocityX(500);
            this.cat.anims.play('walk', true);
        } else {
            this.cat.setVelocityX(0);
            this.cat.anims.play('idle', true);
            if (!(this.inAir)){
                this.cat.anims.play('stand');
            }
        }

        if (this.cat.flipX === true) {
            this.cat.flipX = false;
        }
    }

    buttonPressedUp(pressed) {
        if (pressed && this.cat.body.touching.down) {
            this.cat.setVelocityY(-350);
            try {
                this.sound.play("catjump");
            } catch {
                console.log('no audio possible');
            }
        }
    }
}
