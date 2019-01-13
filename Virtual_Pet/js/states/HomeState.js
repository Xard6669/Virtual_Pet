var HomeState = {
    //dodanie parametru do funkcji inicjalizacyjnej
    init: function(message){
        this.message = message;
    },
    
    create: function(){
        
        var background = this.game.add.sprite(0,0, 'backyard');
        //istotne ma być enabled nie enable!
        background.inputEnabled = true;
        //ustawienie on click aby zacząć grę !
        background.events.onInputDown.add(function(){
            this.state.start('GameState');
        },this);
        
        
    var style = { font: '35px Arial', fill: '#fff'};
    this.game.add.text(30,this.game.world.centerY + 200, 'TOUCH TO START', style);
        
        if (this.message){
            this.game.add.text(60, this.game.world.centerY - 200, this.message, style);
        }
    }
  
};