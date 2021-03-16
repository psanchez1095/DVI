//Pedro Sánchez Escribano pedros03@ucm.es

//Declaracion de constantes
const CARD_NUMBER= 16;
const CARDNAMES_ARRAY = [
    "perico",
    "mortadelo",
    "fernandomartin",
    "sabotaje",
    "phantomas",
    "poogaboo",
    "sevilla",
    "abadia",
    "perico",
    "mortadelo",
    "fernandomartin",
    "sabotaje",
    "phantomas",
    "poogaboo",
    "sevilla",
    "abadia",
]

var MemoryGame = MemoryGame || {};

MemoryGame = function(gs) {

    //Array equivalente al tablero con sus 16 cartas
    this.board=[];
    //Atributo que acumula el mensaje del juego, el cual se indicara en pantalla
    this.gameMessage="Memory Game";
    //Atributo que acumula el numero de cartas dadas la vuelta
    this.numCardsUp = 0;
    //Atributo que acumula los aciertos del jugador
    this.hits = 0;
    //Atributo booleana que indica si el juego esta en curso
    this.inGame=true;

    //Atributos para guardar cada una de las cartas y el id de la primera
    this.first = null;
    this.second = null;
    this.idFirst =-1;

    this.initGame = () => {

        for(let i = 0; i < CARD_NUMBER; i++) this.board.push(new MemoryGameCard(CARDNAMES_ARRAY[i]));

        this.board.sort(function() {
            return Math.random() - 0.3;
        })

        this.loop();

    }

    this.draw =  () =>{
        gs.drawMessage(this.gameMessage);
        for(var i = 0; i < 16; ++i) this.board[i].draw(gs, i);
    }

    this.loop = () => {
        //Evitando asi pasar this por parametro
        copyThis = this;
        setInterval(copyThis.draw, 16);
    }

    this.onClick = (cardId) => {

            //Si no se ha llegado al final del juegos y cardId tiene un valor valido (0...15)
            if( this.inGame && cardId!=null && cardId>=0 ){

            //En caso de ser la primera carta volteada
            if(this.numCardsUp == 0) {
                this.numCardsUp++;
                this.first = this.board[cardId];
                this.first.flip();
                this.idFirst=cardId;
            }

            //En caso de ser la segunda carta volteada y esta no sea la misma carta que la primera ni una carta ya acertada
            else if(this.numCardsUp == 1 && !this.board[cardId].boolFound() && cardId != this.idFirst) {

                this.second = this.board[cardId];
                this.numCardsUp=2;
                this.second.flip();

                //Usamos that para tener una referencia del objeto clickado
                var that = this;
                c1=this.first;
                c2=this.second;


                    //Si ambas cartas tienen la misma imagen
                    if(c2.compareTo(c1)){

                        this.first.found();
                        this.second.found();
                        this.hits++;

                        //Si ya se acertaron todas las parejas
                        if(this.hits == CARD_NUMBER/2) {
                            this.gameMessage = "¡Buena memoria,has ganado!";
                            this.inGame = false;
                        }
                        //Si no se acertaron todas las parejas
                        else {
                            this.gameMessage = "¡Has acertado!";
                            that.numCardsUp=0;
                        }

                    }

                    //Si las cartas tienen imagenes diferentes
                    else {

                        this.gameMessage = "¡Has fallado!";

                        setTimeout(function(){
                            c2.flip();
                        },1000);

                        setTimeout(function(){
                            c1.flip();
                            that.numCardsUp=0;
                        },1500);

                    }
            }
        }
    }


};

MemoryGameCard = function(id){

    //enumerado de estados
    const states ={
        BACK: "back",
        UP: "up",
        FOUND: "found",
    }

    //Atributo que guarda el estado, inicialmente boca abajo
    this.state = states.BACK;

    //Atributo que guarda el nombre del sprite de la carta , se pasa por parametro al crear la carta
    this.name = id;

    //Voltea la carta dependiendo su estado actual
    this.flip = function() {
        ( this.state == states.UP ) ? this.state=states.BACK : this.state = states.UP; ;
    }

    //Cambia el estado a found
    this.found = function() {
        this.state = states.FOUND;
    }

    //Devuelve true si la carta tiene estado found
    this.boolFound = function() {
        return this.state == states.FOUND;
    }

    //Devuelve true si las cartas tienen el mismo nombre(imagen)
    this.compareTo = (card) => {
        return this.name == card.name;
    }

    //Dibuja las cartas en su posicion dependiendo de su estado ( si es back la dibuja boca abajo )
    this.draw = (gs, pos) =>  {
        (this.state != states.BACK) ? gs.draw(this.name, pos) : gs.draw(states.BACK, pos);
    }

};
