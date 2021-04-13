
window.addEventListener("load", () => { Game.initialize("frogger",sprites,startGame) });


var startGame = () => {

    var board = new GameBoard();
    board.add (new TitleScreen("SPACE", "Presiona la tecla espacio para comenzar", playGame));
    board.add (new Logo());
    board.add(new BackGround());
    Game.setBoard(0, board);


    var board = new GameBoard();
    board.add(new Life(5));
    board.add(new Points(0));
    Game.setBoard(2, board);

}

var playGame = () => {

    var board = new GameBoard();
    board.add(new BackGround());
    Game.setBoard(0, board);

    var board = new GameBoard();
    board.add(new Meta(final['end']));
    board.add(new PlayerFrog(winGame));
    board.add(new Spawner());
    board.add(new Time());
    Game.setBoard(1, board);

    Game.setBoard(3, new GameBoard());

}

//CUANDO EL JUGADOR GANA
var winGame = function (points, live) {

    var board = new GameBoard();
    Game.setBoard(1,board);
    var winTitle ="You win! You have " + (Number(points) + 100) + " points now!";
    var winSubtitle ="Press space to continue";

    board.add(new TitleScreen(winTitle, winSubtitle , playGame));
    Game.setBoard(0, board);

    //INICIALIZAMOS LAS VIDAS PARA LA SIGUIENTE PARTIDA
    var board = new GameBoard();
    board.add(new Life(live));
    board.add(new Points(Number(points + 100)));
    Game.setBoard(2, board);

};


//CUANDO EL JUGADOR PIERDE UNA PARTIDA ENTERA
var loseGame = function (points)  {

    var loseTitle = "You lose! You have " + points + " points!"
    var loseSubtitle = "Press space to play again";
    board.add(new Life(5));
    board.add(new Points(0));

    Game.setBoard(3,new TitleScreen(loseTitle,loseSubtitle, playGame));

    var board = new GameBoard();
    Game.setBoard(2, board);

};

//CUANDO EL JUGADOR PIERDE UNA VIDA
var restart = function (live) {
    Game.setBoard(3,new TitleScreen("Now you have " + live + " lives!", "Press space to continue", playGame));
};


