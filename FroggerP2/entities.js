
///Sprite, de cual heredan casi todos los objetos del juego
var Sprite = function () { }

Sprite.prototype.setup = function (sprite, props) {

    this.sprite = sprite;
    this.merge(props);
    this.frame = this.frame || 0;
    this.w = SpriteSheet.map[sprite].w;
    this.h = SpriteSheet.map[sprite].h;

}

Sprite.prototype.merge = function (props) {
    if (props) {
        for (var prop in props) {
            this[prop] = props[prop];
        }
    }
}
Sprite.prototype.draw = function (ctx) {
    SpriteSheet.draw(ctx, this.sprite, this.x, this.y, this.frame);
}

Sprite.prototype.hit = function (damage) {
    this.board.remove(this);
}

//Fondo de Pantalla Juego
var BackGround = function () {
    this.setup("background", {x:0,y:0});
    this.step = function (dt) {}
}

BackGround.prototype = new Sprite();
BackGround.prototype.type = OBJECT_BOARD;

//Logo Frogger
var Logo = function () {
    this.setup("title", {x: Game.width/4.5, y: Game.height/6});
    this.step = function (dt) {}
}

Logo.prototype = new Sprite();
Logo.prototype.type = OBJECT_BOARD;

// PLAYER

var PlayerFrog = function () {

    this.setup("frog", { vx: 0, frame: 0});

    this.x = Game.width / 2 -20 - this.w / 2;
    this.y = Game.height - this.h - 5;

    this.tiempo = 0;

    this.step = function (dt) {

        //Si esta situado encima de otro objeto se calcula la posicion x en funcion de la velocidad del otro objeto
        this.isOnLeaf = function (otherSpeed) {
            this.vx = otherSpeed;
            this.x += this.vx * dt
        }
        this.isOnTrunk = function (otherSpeed) {
            this.vx = otherSpeed;
            this.x += this.vx * dt
        }
        this.isOnTurtle = function (otherSpeed){
            this.vx = otherSpeed;
            this.x += this.vx * dt
        }

        this.tiempo += dt;


        if(!Game.pressed) {

            if (Game.keys['left']) {

                Game.pressed = true;
                this.x -= 40;
                if (this.x < 0) this.x = 0 + 10;

            }
            else if (Game.keys['right']) {

                Game.pressed = true;
                this.x += 40;
                if (this.x > Game.width - this.w) this.x = Game.width - (this.w + 10);

            }
            else if (Game.keys['down']) {

                if(this.y== Game.height - sprites["frog"].h - 5) {} //Si esta en la posicion inicial no hace nada
                else this.y += 48;
                if (this.y > Game.height - this.h) this.y = Game.height - this.h;

                Game.pressed = true;

            }

            else if (Game.keys['up']) {

                this.y -= 48;
                if (this.y < 0)  this.y = 0;

                Points.puntos += 10;
                Game.pressed = true;

            }

        }

        var isCollisionEnemy = this.board.collide(this, OBJECT_ENEMY);
        var isCollisionTransport = this.board.collide(this,OBJECT_TRANSPORT);
        var playerFrogWin = this.board.collide(this, OBJECT_FINISH);

        if(playerFrogWin) winGame(Points.puntos);

        else{

            if(isCollisionEnemy && !isCollisionTransport){

                if (this.board.remove(this)) {
                    this.board.add(new Death(this.x + this.w/2, this.y + this.h/2));
                    Life.muerte = true;
                }
            }

            if(PlayerFrog.muerte) {
                this.board.remove(this);
                this.board.add(new Death(this.x + this.w/2, this.y + this.h/2));
                Life.muerte = true;

            }
            this.vx = 0;
        }
    }
}

PlayerFrog.prototype = new Sprite();
PlayerFrog.prototype.type = OBJECT_PLAYER;


PlayerFrog.prototype.hit = function (damage) {
    if (this.board.remove(this)) {
        this.board.add(new Death(this.x + this.w/2, this.y + this.h/2));
        Life.muerte = true;
    }
}

//Tronco
var Trunk = function (object) {
    this.setup(object.sprite, object);
}
Trunk.prototype = new Sprite();
Trunk.prototype.type =OBJECT_TRANSPORT;
Trunk.prototype.step = function (dt) {

    this.t += dt;
    this.vy = 0;
    this.vx = this.V;
    this.x += this.vx * dt;

    //Si esta fuera del canvas lo borramos de board
    if (this.y > Game.height || this.x < -this.w || this.x > Game.width ) this.board.remove(this);

    //Si hay collision con la rana, la rana se sube al tronco
    var isCollision = this.board.collide(this, OBJECT_PLAYER);
    if (isCollision) isCollision.isOnTrunk(this.vx);

}

//Vehiculo
var Vehicle = function(object){
    this.setup(object.sprite, object);
}
Vehicle.prototype = new Sprite();
Vehicle.prototype.type = OBJECT_ENEMY;

Vehicle.prototype.step = function (dt) {

    this.vx = this.V;
    this.x += this.vx * dt;

    if (this.y > Game.height || this.x < -this.w || this.x > Game.width) this.board.remove(this);

    // Hace las colisiones de la rana
    var collision = this.board.collide(this, OBJECT_PLAYER);
    if (collision) collision.hit(this.damage);

}


//Hoja
var Leaf = function (object) {
    this.setup(object.sprite, object);
}
Leaf.prototype = new Sprite();
Leaf.prototype.type =OBJECT_TRANSPORT;

Leaf.prototype.step = function (dt) {

    this.vx = this.V;
    this.x += this.vx * dt;

    if (this.x > 200) this.board.remove(this);

    var isCollision = this.board.collide(this, OBJECT_PLAYER);
    if (isCollision) isCollision.isOnLeaf(this.V);


}

//Tortuga
var Turtle = function (object) {

    this.setup(object.sprite, object);
    this.subFrame = 0;
    this.tiempo = 0;

}
Turtle.prototype = new Sprite();
Turtle.prototype.type =OBJECT_TRANSPORT;

Turtle.prototype.step = function (dt) {

    this.tiempo += dt;

    this.vx = this.V;
    this.x += this.vx * dt;

    if ( this.x < -this.w || this.x > Game.width) this.board.remove(this);

    var collision = this.board.collide(this, OBJECT_PLAYER);
    if (collision) collision.isOnTurtle(this.V);
    else if(collision) collision.hit();
}

//Agua
var Water = function(object){
    this.setup(object.sprite, object);
}
Water.prototype = new Sprite();
Water.prototype.type = OBJECT_ENEMY;
Water.prototype.step = function(){};
Water.prototype.draw = function(){};

//Rana Muerta
var Death = function(cordX,cordY) {
    this.setup("frog_dead", { frame: 0 });
    this.x = cordX - this.w/2;
    this.y = cordY - this.h/2;
};

Death.prototype = new Sprite();
Death.prototype.step = function(dt) {};


//Meta
var Meta = function(object){
    this.setup(object.sprite, object);
}
Meta.prototype = new Sprite();
Meta.prototype.type = OBJECT_FINISH;
Meta.prototype.draw = function(){};
Meta.prototype.step = function (dt) {

}


//Creador de objetos de juego
var Spawner = function () {
    for ( var patron in patrones) patron.lifetime = 0;
    this.tiempo = 0;
}

Spawner.prototype.step = function (dt) {

    this.tiempo += dt;
    console.log(this.tiempo)
    for(let i = 0; i < patrones.length; i++){

        if(this.tiempo > patrones[i].lifetime){

            patrones[i].lifetime += (patrones[i].interval);

            if(patrones[i].family == "vehicle") this.board.add(new Vehicle(vehicles[patrones[i].type]));
            else if (patrones[i].family == "trunk") this.board.add(new Trunk(platforms[patrones[i].type]));
            else if (patrones[i].family == "turtle") this.board.add(new Turtle(platforms[patrones[i].type]))
            else this.board.add(new Leaf(platforms[patrones[i].type]));

        }
    }

}
Spawner.prototype.draw = function () {};


//Tiempo Transcurrido
var Time = function () {

    this.tiempoPartida = 90;

    this.step = function (dt) {
        if(Game.started) {
            if (this.tiempoPartida > 0) this.tiempoPartida -= dt;
            else PlayerFrog.muerte = true;
        }
        else this.tiempoPartida = 90;
    }

    this.draw =  function(ctx){
        if(Game.started) {
            Game.ctx.fillStyle = "white";
            Game.ctx.textAlign = "left";
            Game.ctx.font = "bold 16px Kavivanar";
            Game.ctx.fillText("Tiempo: " + Math.round(this.tiempoPartida), 3, 20);
        }
    }
}


//Vidas del jugador
var Life = function(lives) {

    Life.lives = lives;
    Life.muerte = false;

    this.step = function (dt) {

        //Revisamos si ha muerto la rana, en ese caso se resta una vida y se reinicia el juego
        if (Life.muerte) {

            Life.lives--;
            Life.muerte = false;

            if(Life.lives == 0) loseGame(Points.puntos);
            else restart(Life.lives);
        }
    }

    this.draw = (ctx) => {

        if(Game.started) {
            Game.ctx.fillStyle = "white";
            Game.ctx.textAlign = "left";
            Game.ctx.font = "bold 16px Kavivanar"
            Game.ctx.fillText("Vidas: " + Life.lives,3,40);
        }

    }
}

var Points = function(puntos) {

    Points.puntos =puntos;

    this.step = (dt) => {
        if(!Game.started) Points.puntos=0;
    }
    this.draw =  (ctx) => {

        if(Game.started) {
            Game.ctx.fillStyle = "white";
            Game.ctx.textAlign = "left";
            Game.ctx.font = "bold 16px Kavivanar"
            Game.ctx.fillText("Puntos: " + Points.puntos,63,40);
        }
    }
}



