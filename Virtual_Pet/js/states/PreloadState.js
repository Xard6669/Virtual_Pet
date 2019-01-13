//loading Screen!
var PreloadState = {
    
    //load the game assets before the game starts
    preload: function() {
        //wywoływanie loga z bootstate!
        this.logo = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        this.logo.anchor.setTo(0.5);
        
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, 'preloadBar');
        this.preloadBar.anchor.setTo(0.5);
        
        //funkcja ustawiająca PreloadBar na pokazujący progres załadowania gry
        this.load.setPreloadSprite(this.preloadBar);
        
        this.load.image('backyard', 'assets/images/backyard.png');
        this.load.image('apple', 'assets/images/apple.png');
        this.load.image('candy', 'assets/images/candy.png');
        this.load.image('rotate', 'assets/images/rotate.png');
        this.load.image('toy', 'assets/images/rubber_duck.png');
        this.load.image('arrow', 'assets/images/rotate.png');
        
        //loading a sprite sheet 'nazwa obiektu', 'gdzie jest', szerokość , wysokość pojedynczego obrazka, ilość obrazków, margines, odstęp między obrazkami more info doc.phaser.io/docs
        this.load.spritesheet('pet', 'assets/images/pet.png', 97, 83, 5, 1, 1);
    },
    
    create: function(){
        
        this.state.start('HomeState');
    }
    
};