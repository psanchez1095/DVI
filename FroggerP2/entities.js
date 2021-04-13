var sprites = {
    background: { sx: 422, sy: 0, w: 550, h: 625, frames: 1 },
    title: { sx: 10, sy: 400, w: 314, h: 225, frames: 1},
    frog: { sx: 0 , sy: 346, w: 40, h: 24, frames: 6 },
    frog_dead: {sx:354 , sy:125 , w:52 , h:39, frames:1 },
    turtle:{sx:5,sy:288,w:51,h:43, frames: 7},
    trailer_brown: {sx: 148, sy: 62, w: 180 , h: 45, frames: 1},
    fire_engine: {sx: 7, sy: 62, w: 122, h: 45, frames: 1},
    car_green: {sx: 102, sy: 0,w: 100, h: 50, frames: 1},
    car_blue: {sx: 8, sy: 4, w:92 , h: 50 , frames: 1},
    car_yellow: {sx: 212 , sy: 2, w: 105 , h: 50, frames: 1},
    tree_medium: {sx: 10, sy: 123, w:190 , h: 40 , frames: 1},
    tree_small: {sx: 270, sy: 173, w:130 , h: 40 , frames: 1},
    tree_big: {sx: 9, sy: 171, w:247 , h: 40 , frames: 1},
    //water: {sx:247,sy:480,w:550,h:242, frames: 1},
    end:{sx:0,sy:0,w:550,h:50, frames: 1},
    leaf: {sx: 0, sy: 232, w: 52, h: 45, frames: 1},
};

var patrones = [
    {inicio: 0, intervalo: 6, family: "vehicle", tipo: "trailer_brown"},   // Camion marron
    {inicio: 0, intervalo: 5.5,family:"vehicle", tipo: "fire_engine"},  // Ambulancia
    {inicio: 0, intervalo: 5, family: "vehicle", tipo: "car_yellow"},  // Coche amarillo
    {inicio: 0, intervalo: 4, family: "vehicle", tipo: "car_green"},   // Coche verde
    {inicio: 0, intervalo: 5, family: "vehicle", tipo: "car_blue"},      // Coche azul
    {inicio: 0, intervalo: 5, family: "turtle",   tipo: "turtle1"},         // Tortuga
    {inicio: 0, intervalo: 9, family: "turtle",   tipo: "turtle2"},         // Tortuga
    {inicio: 0, intervalo: 4, family: "trunk",    tipo: "tree_small"},   // Tronco pequeño
    {inicio: 0, intervalo: 5, family: "trunk",    tipo: "tree_medium"},   // Tronco mediano
    {inicio: 0, intervalo: 6, family: "trunk",    tipo: "tree_big"},   // Tronco grande
    {inicio: 0, intervalo: 4, family: "leaf",     tipo: "leaf"},   // hoja
]



// Array con todos los vehiculos del juego
var vehicles = {

    trailer_brown: {x: 400, y: 527, sprite: "trailer_brown", health: 10, V: -100},
    fire_engine:{x: 10, y: 480, sprite: "fire_engine",health: 10, V:100},
    car_green: {x: 10, y: 428, sprite: "car_green", health: 20, V: 60},
    car_blue: {x:10, y: 335, sprite: "car_blue", health: 5, V: 75},
    car_yellow: {x: 10, y: 379, sprite: "car_yellow", health: 10, V: 150},
    //water:{x: 0, y: 49, sprite: "water", health: 10},

};

// Objetos del agua, tales como la tortuga, los diferentes tipos de troncos
var platforms = {
    turtle1: {x: 250, y: 200, sprite: "turtle", health: 10, V: 20, frame: 0},
    tree_small: {x: 467, y: 248, sprite: "tree_small", health: 10, V: -50},
    tree_medium: {x:467, y: 150, sprite: "tree_medium", health: 10, V: -50},
    tree_big: {x:467, y: 50, sprite: "tree_big", health: 10, V: -50},
    turtle2: {x: 480, y: 100, sprite: "turtle", health: 10, V: 20, frame: 0},
    leaf: {x:0, y: 200, sprite: "leaf", health: 10, V: 20}

};
var final = {
    end:{x: 0, y: 0, sprite: "end", health: 10, V: 20, frame: 0}
}


/// CLASE PADRE SPRITE
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

// PLAYER

var PlayerFrog = function (winGame) {

    this.setup('frog', { vx: 0, frame: 0});

    this.x = Game.width / 2 -20 - this.w / 2;
    this.y = Game.height - this.h - 5;
    this.onTrunk = false;
    this.onTurtle = false;
    this.onLeaf = false;
    this.subFrame = 0;
    this.jumping = false;
    this.up = false;
    this.down = false;
    this.tiempo = 0;
    PlayerFrog.muerte = false;

    this.isOnLeaf = function (vt) {
        this.vx = vt;
        this.onLeaf = true;
    }
    this.isOnTrunk = function (vt) {
        this.vx = vt;
        this.onTrunk = true;
    }
    this.isOnTurtle = function (vt){
        this.vx = vt;
        this.onTurtle = true;
    }

    this.step = function (dt) {

        this.tiempo += dt;

        if(this.jumping){

            if(this.tiempo > 0.02 && this.subFrame < 6){
                this.frame = this.subFrame++;
                this.tiempo = 0;
            }
            else if(this.subFrame === 6){
                this.subFrame = 0;
                this.frame = this.subFrame;
                this.jumping = false;

                if(this.down) {
                    this.y += 48;
                    this.down = false;
                }
                else if(this.up) {
                    this.y -= 48;
                    Points.puntos += 10;
                    this.up = false;
                }

                else { this.y += 0; }
                if (this.y < 0) { this.y = 0; }
                else if (this.y > Game.height - this.h) {
                    this.y = Game.height - this.h;
                }
            }
        }
        if(this.onTrunk)this.x += this.vx * dt;
        if(this.onTurtle)this.x += this.vx * dt;
        if(this.onLeaf)this.x += this.vx * dt;


        if(!Game.pulsado && !this.jumping) {

            if (Game.keys['left']) {
                Game.pulsado = true;
                this.x -= 40;
                if (this.x < 0) this.x = 0 + 10;
            }else if (Game.keys['right']) {
                Game.pulsado = true;
                this.x += 40;
                if (this.x > Game.width - this.w) this.x = Game.width - (this.w + 10);
            }else if (Game.keys['down']) {
                Game.pulsado = true;
                this.down = true;
                this.jumping = true;
                this.frame = this.subFrame++;
            }else if (Game.keys['up']) {
                Game.pulsado = true;
                this.up = true;
                this.jumping = true;
                this.frame = this.subFrame++;
            }

        }

        var isCollision = this.board.collide(this, OBJECT_ENEMY);
        var objeto = this.board.collide(this,OBJECT_TRANSPORT);
        var win = this.board.collide(this, OBJECT_FINISH);

        if(win) winGame(Points.puntos, Life.lives);
        else{
            if(isCollision && !objeto){
                //pierde
                if (this.board.remove(this)) {
                    this.board.add(new Death(this.x + this.w/2,
                        this.y + this.h/2));
                    Life.muerte = true;
                }
            }

            if(PlayerFrog.muerte) {

                this.board.remove(this);
                this.board.add(new Death(this.x + this.w/2, this.y + this.h/2));
                Life.muerte = true;
            }
            this.vx = 0;
            this.onTrunk = false;
            this.onTurtle = false;
            this.onLeaf= false;
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




//Hoja
var Leaf = function (object) {
    this.setup(object.sprite, object);
}
Leaf.prototype = new Sprite();
Leaf.prototype.type =OBJECT_TRANSPORT;

Leaf.prototype.step = function (dt) {

    this.vx = this.V;
    this.vy = 0;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.tiempo = 0;

    if (this.x > 200) this.board.remove(this);

    var isCollision = this.board.collide(this, OBJECT_PLAYER);
    if (isCollision) isCollision.isOnLeaf(this.V);


}
//Tronco
var Trunk = function (blueprint) {
    this.setup(blueprint.sprite, blueprint);
}
Trunk.prototype = new Sprite();
Trunk.prototype.type =OBJECT_TRANSPORT;
Trunk.prototype.step = function (dt) {

    this.vx = this.V;
    this.vy = 0;
    this.x += this.vx * dt;
    this.y += this.vy * dt;


    if (this.y > Game.height || this.x < -this.w || this.x > Game.width ) this.board.remove(this);

    var isCollision = this.board.collide(this, OBJECT_PLAYER);
    if (isCollision) isCollision.isOnTrunk(this.V);


}

//Tortuga
var Turtle = function (object) {

    this.setup(object.sprite, object);
    this.subFrame = 0;
    this.tiempo = 0;
    this.up = true;
    this.buceo = false;

}
Turtle.prototype = new Sprite();
Turtle.prototype.type =OBJECT_TRANSPORT;

Turtle.prototype.step = function (dt) {

    this.tiempo += dt;

    if(this.tiempo > 0.2 && !this.buceo && this.up){
        if(this.subFrame === 8) this.buceo = true;
        else{
            this.frame = this.subFrame++;
            this.tiempo = 0;
        }
    }
    else if(this.buceo && this.tiempo > 0.9) {

        this.tiempo = 0;
        this.up = false;
        this.buceo = false;
        this.frame = this.subFrame = 6;
    }
    else if(this.tiempo > 0.15 && !this.buceo && !this.up){

        if(this.subFrame === 0) this.up = true;
        else{
            this.frame = this.subFrame--;
            this.tiempo = 0;
        }
    }

    this.vx = this.V;
    this.vy = 0;
    this.x += this.vx * dt;
    this.y += this.vy * dt;

    if (this.y > Game.height || this.x < -this.w || this.x > Game.width) this.board.remove(this);

    var collision = this.board.collide(this, OBJECT_PLAYER);
    if (collision && !this.buceo) collision.isOnTurtle(this.V);
    else if(collision && this.buceo) collision.hit();
}

var Car = function(object){

    this.setup(object.sprite, object);
}
Car.prototype = new Sprite();
Car.prototype.type = OBJECT_ENEMY;

Car.prototype.step = function (dt) {

    this.vx = this.V;
    this.vy = 0;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    if (this.y > Game.height ||
        this.x < -this.w ||
        this.x > Game.width) {
        this.board.remove(this);
    }

    // Hace las colisiones de la rana
    var collision = this.board.collide(this, OBJECT_PLAYER);
    if (collision) collision.hit(this.damage);


}
//tronco rana y agua
var Water = function(object){
    this.setup(object.sprite, object);

}
Water.prototype = new Sprite();
Water.prototype.type = OBJECT_ENEMY;
Water.prototype.draw = function(){};
Water.prototype.step = function (dt) {

}
//Meta
var Meta = function(object){
    this.setup(object.sprite, object);
}
Meta.prototype = new Sprite();
Meta.prototype.type = OBJECT_FINISH;
Meta.prototype.draw = function(){};
Meta.prototype.step = function (dt) {

}


///// MUERTE DE LA RANA

var Death = function(centerX,centerY) {
    this.setup("frog_dead", { frame: 0 });
    this.x = centerX - this.w/2;
    this.y = centerY - this.h/2;
};

Death.prototype = new Sprite();

Death.prototype.step = function(dt) {
};

//BACKGROUND
var BackGround = function () {

    this.setup("background", {x:0,y:0});

    this.step = function (dt) {}

}

BackGround.prototype = new Sprite();
BackGround.prototype.type = OBJECT_BOARD;

var Spawner = function () {

    for ( var patron in patrones) patron.inicio = 0;
    this.tiempo = 0;

}

Spawner.prototype.step = function (dt) {

    this.tiempo += dt;

    for(var i = 0; i < patrones.length; i++){

        if(this.tiempo > patrones[i].inicio){

            var tAleatorio = Math.round(Math.random()*10) / 5;
            patrones[i].inicio += patrones[i].intervalo + tAleatorio;

            if(patrones[i].family == "vehicle") this.board.add(new Car(vehicles[patrones[i].tipo]));
            else if (patrones[i].family == "trunk") this.board.add(new Trunk(platforms[patrones[i].tipo]));
            else if (patrones[i].family == "turtle") this.board.add(new Turtle(platforms[patrones[i].tipo]))
            else if (patrones[i].tipo == "leaf")this.board.add(new Leaf(platforms[patrones[i].tipo]));


        }
    }

}
Spawner.prototype.draw = function () {};

//Logo Frogger
var Logo = function () {

    this.setup("title", {
        x: Game.width/4.5,
        y: Game.height/6,
    });

    this.step = function (dt) {}

}

Logo.prototype = new Sprite();
Logo.prototype.type = OBJECT_BOARD;

//Tiempo Transcurrido
var Time = function () {

    this.tiempoPartida = 90;

    this.step = function (dt) {
        if (this.tiempoPartida > 0) this.tiempoPartida -= dt;
        else PlayerFrog.muerte = true;
    }

    this.draw =  function(ctx){

        Game.ctx.fillStyle = "white";
        Game.ctx.textAlign = "left";
        Game.ctx.font = "bold 16px Kavivanar";
        Game.ctx.fillText("Tiempo: " + Math.round(this.tiempoPartida),3,20);
    }
}

var Life = function(lives) {

    Life.lives = lives;
    Life.muerte = false;

    this.step = function (dt) {

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

    this.step = (dt) => {}

    this.draw =  (ctx) => {

        if(Game.started) {
            Game.ctx.fillStyle = "white";
            Game.ctx.textAlign = "left";
            Game.ctx.font = "bold 16px Kavivanar"
            Game.ctx.fillText("Puntos: " + Points.puntos,63,40);
        }
    }
}