//this game wii have only 1 state
var GameState = {


    //executed after everythig is loaded
    create: function() {
        //inicjalizacja obrazków używamy this. aby móc mieć dostęp do nich w innych funkcjach
        // lewy górny róg 0 , 0 nazwa nadana wcześniej
        this.background = this.game.add.sprite(0, 0, 'backyard');
        //umożliwienie kliknięcia na tło
        this.background.inputEnabled = true;
        //wywołanie eventu na kliknięcie
        this.background.events.onInputDown.add(this.placeItem, this);
        
        
        this.pet = this.game.add.sprite(100, 400, 'pet');
        this.pet.anchor.setTo(0.5);
        
        //spritesheet animation nazwa, kolejnosc jak w tabeli, ilosc klatek, czy zapetlac.
        this.pet.animations.add('funnyFaces', [1, 2, 3, 2, 1], 7, false);
        
        //custom propertes
        this.pet.customParams = {health: 100, fun: 100};
        
        //Draggable pet funkcja enableDrag robi obiekt który się przesuwa
        // IT IS NOT ENABLED IS "ENABLEDRAG"!!!!
        this.pet.inputEnabled = true;
        this.pet.input.enableDrag();
        
        //inicjalizacja reszty zdjęć funkcycjnych, wyśrodkowanie zdjęć
        //pozwolenie na kliknięcia, dodatkowy parametr do gry,
        //dodanie funkcji wykonawcej do kliknięcia i przekazanie parametru THiS aby,
        //mógł zostać wykorzystany wewnątrz tej funkcji
        this.apple = this.game.add.sprite(72, 550, 'apple');
        this.apple.anchor.setTo(0.5);
        this.apple.inputEnabled = true;
        this.apple.customParams = {health: 20};
        this.apple.events.onInputDown.add(this.pickItem, this);
        
        this.candy = this.game.add.sprite(144, 550, 'candy');
        this.candy.anchor.setTo(0.5);
        this.candy.inputEnabled = true;
        this.candy.customParams = {health: -10, fun: 10};
        this.candy.events.onInputDown.add(this.pickItem, this);
        
        this.toy = this.game.add.sprite(216, 550, 'toy');
        this.toy.anchor.setTo(0.5);
        this.toy.inputEnabled = true;
        this.toy.customParams = {fun: 20};
        this.toy.events.onInputDown.add(this.pickItem, this);
        
        this.rotate = this.game.add.sprite(288, 550, 'rotate');
        this.rotate.anchor.setTo(0.5);
        this.rotate.inputEnabled = true;
        this.rotate.events.onInputDown.add(this.rotatePet, this);
        
        //zatrzymywanie warotści do późniejszego użycia 
        this.buttons = [this.apple, this.candy, this.toy, this.rotate];
        
        //aktualnie wybrano
        this.selectedItem = null;
        //blokada interfejsu użytkownika
        this.uiBlocked = false;
        
        //ustawianie stylu dla textu i definiowanie wartosci gdzie tesxt ma sie znajdowac: x, y, name, style
        var style = {font: '20px Arial', fill: '#fff'};
        this.game.add.text(10, 20, 'Health:', style);
        this.game.add.text(140, 20, 'Fun:', style);
        //tworzenei wartosci dla zmieniajacego sie textu wartosci
        this.healthText = this.game.add.text(80, 20, '', style);
        this.funText = this.game.add.text(185, 20, '', style);
        
        this.refreshStats();
        
        //zmiejszanie życia co 5 secund // ustawiamy pętlę która kożysta z funcji Phasera timer którybędzie wywoływać
        //funcjię reduceProperties co 5 sekund i przesyłamy kontekst this aby móc z niego korzystać w funkcji
        this.statsDecreaser = this.game.time.events.loop(Phaser.Timer.SECOND * 5, this.reduceProperties, this);
    
    },
    
    pickItem: function(sprite, event){
       if(!this.uiBlocked){
           
           //sending to oter function
           this.clearSelection();
           
           //sprawienie aby było przeźroczyste
           sprite.alpha = 0.4;
           
           //wybranie przedmiotu
           this.selectedItem = sprite;

           
       }
        
        
    },
    
    rotatePet: function(sprite, event){
        
        if(!this.uiBlocked){
        
        
        this.uiBlocked = true;
        
        this.clearSelection();
        sprite.alpha = 0.4;
            
        //create tween animation
        var petRotation = this.game.add.tween(this.pet);
        //ustawienie animacji rotacji poprze dodanie lub odjęcie kątów i ustawienie czasu
        petRotation.to({angle: +720}, 1000);
            
        petRotation.onComplete.add(function(){
            this.uiBlocked = false;
            
            sprite.alpha = 1;
            
            this.pet.customParams.fun += 10;
            //update a visual stats
            this.refreshStats();
        }, this);
        
        //wywołanie rotacji
        petRotation.start();
        
        }
    },
    
    clearSelection: function(){
        this.buttons.forEach(function(element, index){
                             element.alpha = 1;
                             });
        this.selectedItem = null;
    },
    
    placeItem: function(sprite, event){
        //ustawienie aby sprawdzić że wybrano coś i interfejs nie jest zablokowany
        if(this.selectedItem && !this.uiBlocked){
            //ustawienie poprzez funkcjię event lokacji kliknięcia 
            var x = event.position.x;
            var y = event.position.y;

            //tworzenei przedmiotu do umieszczenia na tle
            var newItem = this.game.add.sprite(x, y, this.selectedItem.key);
            newItem.anchor.setTo(0.5);
            newItem.customParams = this.selectedItem.customParams;
            
            this.uiBlocked = true;
            //sprawienie że zwierzak rusza do obiektu który stworzyliśmy aby go skonsumować
            var petMovment = this.game.add.tween(this.pet);
            petMovment.to({x: x, y: y}, 700);
            petMovment.onComplete.add(function(){
                //znikanie przedmiotu
                newItem.destroy();
                
                //play animation
                
                this.pet.animations.play('funnyFaces');
                
                this.uiBlocked = false;
                
                //update pet stats !!!! UPDATE OBIEKTÓW ! WAŻNE IDIOTO!
                var stat;
                for(stat in newItem.customParams){
                    //porównanie elementów w tablicy i updatowanie tylko tych które się pokrywają !!!!
                    if(newItem.customParams.hasOwnProperty(stat)){
                        this.pet.customParams[stat] += newItem.customParams[stat];
                    }
                }
                
                
                //update a visual stats
                this.refreshStats();
                
            },this);
            
            petMovment.start();
            
        }

    },
    
    refreshStats: function(){
        this.healthText.text = this.pet.customParams.health;
        this.funText.text = this.pet.customParams.fun;
    },
    
    reduceProperties: function(){
    this.pet.customParams.health -= 10;
    this.pet.customParams.fun -=15;
    this.refreshStats();
    },
    //execute multiple time per second
    update: function(){
        if(this.pet.customParams.health <= 0 || this.pet.customParams.fun <=0){
            this.pet.frame = 4;
            
            this.uiBlocked = true;
            this.game.time.events.add(2000, this.gameOver, this);
        }
    },
    
    gameOver: function() {
        //name of the stage, refreshing a page, reset a loaded content, zmienne
        this.state.start('HomeState', true, false, 'GAME OVER!')
    }
    
};