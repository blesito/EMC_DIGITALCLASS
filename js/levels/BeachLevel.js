"use strict";

class BeachLevel extends BaseLevelScene {
    constructor() {
        super({ key: 'BeachLevel' })
    }

    preload() {
        super.preload();

        this.load.tilemapTiledJSON("beachMap","assets/maps/BeachLevel/BeachLevel.json");
        this.load.image('beach',"assets/images/BeachLevel/BeachTileset.jpg");
        this.load.image('mouse', 'assets/images/mouse_left.png');
        this.load.image('beachDog', 'assets/images/BeachLevel/dog.png');
        this.load.image('cat', 'assets/images/cat_walking_right.png');
        this.load.spritesheet('animcat', 'assets/images/cat_walking_animated.png', { frameWidth: 97, frameHeight: 101 });
        this.load.spritesheet('animouse', 'assets/images/mouse_left_animated.png', { frameWidth: 30, frameHeight: 20 });
        this.load.spritesheet('beach_doganim', 'assets/images/SpaceLevel/dog_sprites.png', {frameWidth: 146, frameHeight: 135});
        this.load.image('home', 'assets/images/house_home_transparent.png');

        this.load.audio('backgroundmusicbeach', 'assets/sounds/music/Lagoa_v2.ogg');
        this.load.audio("meow", "assets/sounds/animals/cat_meow1.ogg");
        this.load.audio("bark", "assets/sounds/animals/dog_bark_short.ogg");
        this.load.audio("dogLong", "assets/sounds/animals/dog_bark_long.ogg");
        this.load.audio("jump", "assets/sounds/movement/jump_sfx_movement_jump8.wav");
        this.load.audio("land", "assets/sounds/movement/land_sfx_movement_jump9_landing.wav");

    }

    create() {
        this.music = this.sound.add('backgroundmusicbeach');
        try {
            this.music.play();
        } catch {
            console.log('no audio possible');
        }

        let beachMap = this.make.tilemap({ key: "beachMap", tileWidth: 16, tileHeight: 16 });
        let tileset = beachMap.addTilesetImage("BeachTileset","beach");

        let collisionLayer = beachMap.createStaticLayer("obstacles", tileset, 0, 0);

        collisionLayer.setCollisionByProperty({ collides: true });



        this.physics.world.setBounds(0,0,100*32,46*32, true, true, true, true);
        this.cameras.main.setBounds(0, 0, 100*32,46*32);



        this.millis = 0;
        this.inAir = false;


        this.cat = this.physics.add.sprite(1100, 1100, 'cat');
        this.cat.setBounce(0.2);
        this.cat.setCollideWorldBounds(true);
        this.cameras.main.startFollow(this.cat);
        this.cat.body.gravity.y = 300;
        this.cat.scaleY=0.6;
        this.cat.scaleX=0.6;

        this.anims.remove('dogWalk');
        this.anims.create({
            key: 'dogWalk',
            frames: this.anims.generateFrameNumbers('beach_doganim', {start: 0, end: 2}),
            frameRate: 10,
            repeat: -1,
        });
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
            frames: this.anims.generateFrameNumbers('animcat', { start: 1, end: 3 }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.remove('mouseWalk');
        this.anims.create({
            key: 'mouseWalk',
            frames: this.anims.generateFrameNumbers('animouse', { start: 0, end: 1 }),
            frameRate: 10,
            repeat: -1,
        });
        this.anims.remove('stand');
        this.anims.create({
            key: 'stand',
            frames: [ { key: 'animcat', frame: 0 } ],
            frameRate: 20,
        });

        this.dogSpawnLayer =  beachMap.objects.filter((maplayer)=> {
            return maplayer.name == "dogSpawn";
        })[0];
        this.miceSpawnLayer =  beachMap.objects.filter((maplayer)=> {
            return maplayer.name == "miceSpawn";
        })[0];
        this.groundLayer =  beachMap.objects.filter((maplayer)=> {
            return maplayer.name == "ground";
        })[0];
        this.safezoneLayer =  beachMap.objects.filter((maplayer)=> {
            return maplayer.name == "safezone";
        })[0];

        this.dogs = [];
        this.dogsSprites = this.physics.add.group();
        for(let i = 0; i < this.dogSpawnLayer.objects.length; i++){
            let dogStartX = this.dogSpawnLayer.objects[i].x;
            let dogStartY = this.dogSpawnLayer.objects[i].y-40;
            let dogPath = this.dogSpawnLayer.objects[i].width;
            let dogSpeed = Phaser.Math.Between(30, 60);
            let sprite = this.physics.add.sprite(dogStartX, dogStartY,"beachDog");
            sprite.setSize(sprite.width*0.8, sprite.height*0.8);
            this.dogsSprites.add(sprite);
            sprite.setVelocityX(dogSpeed);
            sprite.scaleY=0.6;
            sprite.scaleX=0.6;
            sprite.anims.play('dogWalk', true);
            this.dogs.push({"sprite" : sprite ,"path": dogPath, "startX": dogStartX, "speed": dogSpeed});
        }

        this.mice = [];
        this.miceSprites = this.physics.add.group();
        for(let i = 0; i < this.miceSpawnLayer.objects.length; i++){
            let mouseStartX = this.miceSpawnLayer.objects[i].x ;
            let mouseStartY = this.miceSpawnLayer.objects[i].y-20;
            let mousePath = this.miceSpawnLayer.objects[i].width;
            let mouseSpeed = Phaser.Math.Between(50, 80);
            let sprite = this.physics.add.sprite(mouseStartX, mouseStartY,"mouse");
            sprite.flipX = true;
            sprite.setGravityY(1000);
            this.miceSprites.add(sprite);
            sprite.setVelocityX(mouseSpeed);
            sprite.anims.play('mouseWalk', true);
            this.mice.push({"sprite" : sprite ,"path": mousePath, "startX": mouseStartX, "speed": mouseSpeed});
        }

        let lay = this.safezoneLayer.objects[0];
        this.safezone = this.physics.add.image(lay.x + lay.width/2 , lay.y + lay.height/2 ,"home");
        this.safezone.body.allowGravity = false;
        this.safezone.displayHeight = lay.height;
        this.safezone.displayWidth = lay.width;

        let lay2 = this.groundLayer.objects[0];
        this.ground = this.physics.add.image(lay2.x + lay2.width/2 , lay2.y + lay2.height/2 ,"home");
        this.ground.body.allowGravity = false;
        this.ground.displayHeight = lay2.height;
        this.ground.displayWidth = lay2.width;
        this.ground.visible = false;

        this.physics.add.collider(this.cat, collisionLayer);
        this.physics.add.collider(this.dogsSprites, collisionLayer);
        this.physics.add.collider(this.miceSprites, collisionLayer);

        this.physics.add.overlap(this.cat, this.miceSprites, this.collectMouse, null, this);
        this.physics.add.overlap(this.cat, this.safezone, () => {
            this.addScore(100);
            this.addScore(Math.floor(this.timeLeft));
            this.startNextLevel();
        }, null, this);

        this.physics.add.collider(this.cat, this.dogsSprites, this.hitDog, null, this);
        this.physics.add.collider(this.cat, this.ground, ()=>{this.catDies(this.cat);}, null, this);


        this.cameras.main.startFollow(this.cat);
        super.create();
    }

    update(time, delta) {
        super.update(time, delta);

        this.inAir = false;
        if (Math.abs(this.cat.body.velocity.y) > 1.12) {
            this.inAir = true;
        }
        for (let i = 0; i < this.dogs.length; i++) {
            let currentDog = this.dogs[i];
            if (currentDog["sprite"].x > currentDog["startX"]+currentDog["path"]) {
                currentDog["sprite"].setVelocityX(-currentDog["speed"]);
                if (currentDog["sprite"].flipX === false) {
                    currentDog["sprite"].flipX = true;
                }
            }
            if (currentDog["sprite"].x < currentDog["startX"]){
                currentDog["sprite"].setVelocityX(currentDog["speed"]);
                if (currentDog["sprite"].flipX === true  ) {
                    currentDog["sprite"].flipX = false;
                }
            }
        }

        for(let i =0; i<this.mice.length; i++){
            let currentMouse = this.mice[i];
            if (currentMouse["sprite"].x > currentMouse["startX"]+currentMouse["path"]) {
                currentMouse["sprite"].setVelocityX(-currentMouse["speed"]);
                if (currentMouse["sprite"].flipX === true) {
                    currentMouse["sprite"].flipX = false;
                }
            }
            if (currentMouse["sprite"].x < currentMouse["startX"]){
                currentMouse["sprite"].setVelocityX(currentMouse["speed"]);
                if (currentMouse["sprite"].flipX === false  ) {
                    currentMouse["sprite"].flipX = true;
                }
            }
        }

        if (this.cat.velocity < 10){
            try {
                this.sound.play("land");
            } catch {
                console.log('no audio possible');
            }
        }

        if (this.millis > Phaser.Math.Between(100, 8000)){
            try {
                this.sound.play("bark");
            } catch {
                console.log('no audio possible');
            }
            this.millis = 0;
        }
        this.millis +=1;
    }

    buttonPressedLeft(pressed) {
        if (pressed) {
            this.cat.setVelocityX(-160);
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
            this.cat.setVelocityX(160);
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
        if (pressed && Math.abs(this.cat.body.velocity.y) < 2) {
            this.cat.setVelocityY(-400);
            try {
                this.sound.play("jump");
            } catch {
                console.log('no audio possible');
            }
        }
    }

    collectMouse(cat, mouse) {
        mouse.disableBody(true, true);
        try {
            this.sound.play("meow");
        } catch {
            console.log('no audio possible');
        }
        this.addScore();
    }

    hitDog(cat, dog) {
        try {
            this.sound.play("dogLong");
            this.sound.play("angry_cat");
        } catch {
            console.log('no audio possible');
        }

        this.catDies(cat);
    }
}
