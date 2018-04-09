var game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, "game",
  {init:init, preload:preload, create:create, update:update, render:render});

function init() {
    game.world.resize(WORLD_WIDTH, WORLD_HEIGHT);

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = 1000;
    game.physics.arcade.skipQuadTree = false;
}

function preload() {
    //Load background
    game.load.image('background', '../img/blue.jpg');

    //Load platforms/scenery
    game.load.spritesheet('tiles', '../img/tiles.png', 16, 16);

    //Load characters
    game.load.spritesheet('mario', '../img/characters.gif', 16, 32);
}

function create() {
    background = game.add.sprite(0, 0, 'background');
    background.fixedToCamera = true;
    background.width = GAME_WIDTH;
    background.height = GAME_HEIGHT;

    platforms = game.add.physicsGroup();
    placeScenery();
    createPlatforms('level1_1');

    platforms.setAll('body.allowGravity', false);
    platforms.setAll('body.immovable', true);

    player = game.add.sprite(150, 100, 'mario');
    game.physics.arcade.enable(player);
    player.body.setSize(16, 32, 0, 0);
    player.scale.setTo(1.5);
    player.facing = 'right';
    player.jumping = false;

    player.animations.add('left', [0, 1, 2, 3, 4, 5, 6], 8, true);
    player.animations.add('right', [18, 19, 20], 8, true);
    player.animations.add('jumpLeft', [0], 8, true);
    player.animations.add('jumpRight', [0], 8, true);

    game.camera.follow(player);

    cursors = game.input.keyboard.createCursorKeys();
}

function update() {
    game.physics.arcade.collide(player, platforms, collidePlatform, null, this);

    //Detect if you fell down a hole
    if(player.body.bottom >= game.world.bounds.bottom){
        fellDown();
        return;
    }
    else if(player.body.x < 0){
        player.body.x = 0;
        player.body.velocity.x = 0;
    }
    else if(player.body.x + player.body.width >= game.world.bounds.right){
        player.body.x -= 25;
        player.body.velocity.x = 0;
    }
    else if(player.body.y + (player.body.height * 1.5) < 0){
        player.body.y += 25;
        player.body.velocity.y = 0;
    }

    //Jumping
    if (player.jumping){
        if(player.facing == 'left'){
            player.play('jumpLeft');
        }
        else {
            player.play('jumpRight');
        }
    }
    else {
        player.body.velocity.x = 0;
    }

    if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
        if(!player.jumping){
            player.jumping = true;
            player.body.velocity.y = -400;
        }
    }

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -200;
        player.facing = 'left';
        if(!player.jumping){
            player.play('left');
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 200;
        player.facing = 'right';
        if(!player.jumping){
            player.play('right');
        }
    }
    else
    {
        if(!player.jumping){
            player.animations.stop();

            if (player.facing === 'left')
            {
                player.frame = 15;
            }
            else
            {
                player.frame = 16;
            }
        }
    }
}

function render(){
    game.debug.bodyInfo(player);
    game.debug.body(player);

    game.debug.body(platforms);
}

function collidePlatform(player, platform){
    //Cancel jump event only if player is on top of platform
    if(player.body.y + player.body.height <= platform.body.y){
        player.jumping = false;
    }
}

function fellDown(){
    player.kill();
    gameOver = true;
    console.log("fell down a hole");
    console.log('TODO: Gameover logic');
}
