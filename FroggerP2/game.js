var sprites = {
    background:     { sx: 422,  sy: 0,   w: 550,  h: 625, frames: 1},
    title:          { sx: 10,   sy: 400, w: 314,  h: 225, frames: 1},
    frog:           { sx: 0 ,   sy: 346, w: 40,   h: 24,  frames: 6},
    frog_dead:      { sx: 354 , sy: 125, w: 52 ,  h: 39,  frames: 1},
    turtle:         { sx: 5,    sy: 288, w: 51,   h: 43,  frames: 7},
    trailer_brown:  { sx: 148,  sy: 62,  w: 180 , h: 45,  frames: 1},
    fire_engine:    { sx: 7,    sy: 62,  w: 122,  h: 45,  frames: 1},
    car_green:      { sx: 102,  sy: 0,   w: 100,  h: 50,  frames: 1},
    car_blue:       { sx: 8,    sy: 4,   w: 92 ,  h: 50 , frames: 1},
    car_yellow:     { sx: 212 , sy: 2,   w: 105 , h: 50,  frames: 1},
    tree_medium:    { sx: 10,   sy: 123, w: 190 , h: 40 , frames: 1},
    tree_small:     { sx: 270,  sy: 173, w: 130 , h: 40 , frames: 1},
    tree_big:       { sx: 9,    sy: 171, w: 247 , h: 40 , frames: 1},
    end:            { sx: 0,    sy: 0,   w: 550,  h: 50,  frames: 1},
    leaf:           { sx: 0,    sy: 232, w: 52,   h: 45,  frames: 1},
    water:          { sx: 247,  sy: 480, w: 550,  h: 242, frames: 1},
};

var patrones = [
    {lifetime: 0, interval: 6, family: "vehicle",  type: "trailer_brown"},
    {lifetime: 0, interval: 5.5,family:"vehicle",  type: "fire_engine"},
    {lifetime: 0, interval: 5, family: "vehicle",  type: "car_yellow"},
    {lifetime: 0, interval: 4, family: "vehicle",  type: "car_green"},
    {lifetime: 0, interval: 5, family: "vehicle",  type: "car_blue"},
    {lifetime: 0, interval: 5, family: "turtle",   type: "turtle1"},
    {lifetime: 0, interval: 9, family: "turtle",   type: "turtle2"},
    {lifetime: 0, interval: 4, family: "trunk",    type: "tree_small"},
    {lifetime: 0, interval: 5, family: "trunk",    type: "tree_medium"},
    {lifetime: 0, interval: 6, family: "trunk",    type: "tree_big"},
    {lifetime: 0, interval: 4, family: "leaf",     type: "leaf"},
]

var vehicles = {
    trailer_brown: {x: 400, y: 527, sprite: "trailer_brown", health: 10, V: -100},
    fire_engine:   {x: 10,  y: 480, sprite: "fire_engine",   health: 10, V: 100},
    car_green:     {x: 10,  y: 428, sprite: "car_green",     health: 20, V: 60},
    car_blue:      {x: 10,  y: 335, sprite: "car_blue",      health: 5,  V: 75},
    car_yellow:    {x: 10,  y: 379, sprite: "car_yellow",    health: 10, V: 150},
    water:         {x: 0,   y: 49,  sprite: "water",         health: 10}

};

var platforms = {
    turtle1:     {x: 0,   y: 200, sprite: "turtle",      health: 10, V:  20, frame: 0},
    tree_small:  {x: 467, y: 248, sprite: "tree_small",  health: 10, V: -50},
    tree_medium: {x:467,  y: 150, sprite: "tree_medium", health: 10, V: -50},
    tree_big:    {x:467,  y: 50,  sprite: "tree_big",    health: 10, V: -50},
    turtle2:     {x: 480, y: 100, sprite: "turtle",      health: 10, V:  20, frame: 0},
    leaf:        {x:0,    y: 100, sprite: "leaf",        health: 10, V:  20}

};

var final = {
    end:{x: 0, y: 0, sprite: "end", health: 10, V: 20, frame: 0}
}

window.addEventListener("load", () => { Game.initialize("frogger",sprites,startGame) });


var startGame = () => {

    //Primera Capa --> Pantalla Inicio
    var board = new GameBoard();
    board.add (new TitleScreen("SPACE", "Presiona la tecla espacio para comenzar", playGame));
    board.add (new Logo());
    board.add(new BackGround());
    Game.setBoard(0, board);

    //SegundaCapa --> Estadisticas Juego
    var board = new GameBoard();
    board.add(new Time());;
    board.add(new Life(5));
    board.add(new Points(0));
    Game.setBoard(1, board);
}

var playGame = () => {

    //Primera Capa --> Fondo
    var board = new GameBoard();
    board.add(new BackGround());
    Game.setBoard(0, board);


    //TerceraCapa --> Objetos Juego
    var board = new GameBoard();
    board.add(new Meta(final["end"]));
    board.add(new Water(vehicles["water"]));
    board.add(new PlayerFrog());
    board.add(new Spawner());
    Game.setBoard(2, board);

    //Cuarta Capa para mensajes de victoria o derrota
    var board = new GameBoard();
    Game.setBoard(3, board);


}

//Si el jugador gana
var winGame = function (points) {

    Game.started=false;
    //Introduzco el logo para que tenga apariencia de que el juego terminó (primera capa)
    var board = new GameBoard();
    board.add (new Logo)
    board.add(new BackGround());

    Game.setBoard(0, board);

    //Introduzco el mensaje de victoria y reinicio las estadisticas ( segunda capa )
    var board = new GameBoard();
    Game.setBoard(1, board);

    var winTitle ="You win! " + (Number(points) + 100) + " points now!";
    var winSubtitle ="Press space to continue";

    //Preparo el posible reinicio del juego
    Game.setBoard(2,new TitleScreen(winTitle, winSubtitle , playGame));

};


//Si el jugador ha perdido una partida completa
var loseGame = function (points)  {

    //Introduzco el logo para que tenga apariencia de que el juego terminó (primera capa)
    var board = new GameBoard();
    board.add (new Logo)
    board.add(new BackGround());
    Game.setBoard(0, board);

    //Introduzco el mensaje de derrota y reinicio las estadisticas ( segunda capa )
    var loseTitle = "You lose! Only " + points +" points!"
    var loseSubtitle = "Press space to play again";
    board.add(new Life(5));
    board.add(new Points(0));
    Game.setBoard(1, board);

    //Preparo el posible reinicio del juego
    Game.setBoard(2,new TitleScreen(loseTitle,loseSubtitle, playGame));


};

//Si el jugador pierde una vida reiniciamos el juego manteniendo las estadisticas, solo cambiamos la capa de objetos
var restart = function (live) {
    Game.started=false;
    Game.setBoard(3,new TitleScreen("Now you have " + live + " lives!", "Press space to continue", playGame));
};


