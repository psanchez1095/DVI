
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

    this.setup("frog", { vx: 0, frame: 0});

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


        if(!Game.pressed && !this.jumping) {

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

                Game.pressed = true;
                this.down = true;
                this.jumping = true;
                this.frame = this.subFrame++;

            }

            else if (Game.keys['up']) {

                Game.pressed = true;
                this.up = true;
                this.jumping = true;
                this.frame = this.subFrame++;

            }

        }

        var isCollision = this.board.collide(this, OBJECT_ENEMY);
        var objeto = this.board.collide(this,OBJECT_TRANSPORT);
        var win = this.board.collide(this, OBJECT_FINISH);

        if(win) winGame(Points.puntos);

        else{
            if(isCollision && !objeto){

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
    this.x += this.vx * dt;

    if (this.x > 200) this.board.remove(this);

    var isCollision = this.board.collide(this, OBJECT_PLAYER);
    if (isCollision) isCollision.isOnLeaf(this.V);


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
    this.x += this.vx * dt;

    if ( this.x < -this.w || this.x > Game.width) this.board.remove(this);

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
    this.x += this.vx * dt;

    if (this.y > Game.height ||
        this.x < -this.w ||
        this.x > Game.width) {
        this.board.remove(this);
    }

    // Hace las colisiones de la rana
    var collision = this.board.collide(this, OBJECT_PLAYER);
    if (collision) collision.hit(this.damage);

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

//Rana Muerta
var Death = function(centerX,centerY) {
    this.setup("frog_dead", { frame: 0 });
    this.x = centerX - this.w/2;
    this.y = centerY - this.h/2;
};

Death.prototype = new Sprite();
Death.prototype.step = function(dt) {};

//Fondo de Pantalla Juego
var BackGround = function () {
    this.setup("background", {x:0,y:0});
    this.step = function (dt) {}
}

BackGround.prototype = new Sprite();
BackGround.prototype.type = OBJECT_BOARD;

//Creador de objetos de juego
var Spawner = function () {

    for ( var patron in patrones) patron.lifetime = 0;
    this.tiempo = 0;

}

Spawner.prototype.step = function (dt) {

    this.tiempo += dt;

    for(let i = 0; i < patrones.length; i++){

        if(this.tiempo > patrones[i].lifetime){

            patrones[i].lifetime += (patrones[i].interval);

            if(patrones[i].family == "vehicle") this.board.add(new Car(vehicles[patrones[i].type]));
            else if (patrones[i].family == "trunk") this.board.add(new Trunk(platforms[patrones[i].type]));
            else if (patrones[i].family == "turtle") this.board.add(new Turtle(platforms[patrones[i].type]))
            else if (patrones[i].type == "leaf")this.board.add(new Leaf(platforms[patrones[i].type]));


        }
    }

}
Spawner.prototype.draw = function () {};

//Logo Frogger
var Logo = function () {

    this.setup("title", {x: Game.width/4.5, y: Game.height/6});
    this.step = function (dt) {}

}

Logo.prototype = new Sprite();
Logo.prototype.type = OBJECT_BOARD;

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


var Water = function(object){
    this.setup(object.sprite, object);
}
Water.prototype = new Sprite();
Water.prototype.type = OBJECT_ENEMY;
Water.prototype.step = function(){};
Water.prototype.draw = function(){};
