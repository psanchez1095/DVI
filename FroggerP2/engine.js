var Game = new function() {

    this.initialize = function(canvasElementId, sprite_data, callback) {

        Game.started = false;
        Game.pressed = false;

        this.canvas = document.getElementById(canvasElementId)
        this.width = this.canvas.width;
        this.height= this.canvas.height;

        this.ctx = this.canvas.getContext && this.canvas.getContext('2d');
        if(!this.ctx) return alert("Actualiza tu navegador para poder jugar");

        this.setupInput();

        requestAnimationFrame(Game.loop);


        SpriteSheet.load(sprite_data,callback);

    };

    var KEY_CODES = { 37:'left', 39:'right', 38:'up', 40: 'down' , 32 :'space'};

    this.keys = {};

    this.setupInput = function() {
        window.addEventListener('keydown',function(e) {
            if(KEY_CODES[e.keyCode]) {
                Game.keys[KEY_CODES[e.keyCode]] = true;
                e.preventDefault();
            }
        },false);

        window.addEventListener('keyup',function(e) {
            if(KEY_CODES[e.keyCode]) {
                Game.keys[KEY_CODES[e.keyCode]] = false;
                Game.pressed = false,
                e.preventDefault();
            }
        },false);
    }

    var boards = [];
    var oldTime = 0;

    this.loop = function(time) {

            var fps=60;
            var dt = (time - oldTime) / 1000;

            Game.ctx.fillStyle = "#000";
            Game.ctx.fillRect(0,0,Game.width,Game.height);

            for(var i=0,len = boards.length;i<len;i++) {
                if(boards[i]) {
                    boards[i].step(dt);
                    boards[i].draw(Game.ctx);
                }
            }

            analytics.step(dt/1000);


            if(Game.started) analytics.draw(Game.ctx);
            oldTime = time;

            requestAnimationFrame(Game.loop);


    };

    this.setBoard = function(num,board) { boards[num] = board; };
};




var analytics = new function(){

         var lastDate = Date.now();

        var time = 0;
        var frames = 0;
        var fps = 0;
        this.step = function(dt){

            var now = Date.now();
            //Ignoramos el dt que nos indica el método loop()
            var dt = (now-lastDate);
            lastDate = now;
            time += dt;
            ++frames;
            fps = frames*1000 / time;

            if(time>5000){
                time = 0;
                frames = 0;
             }

         }

        this.draw =  function(ctx){
        ctx.fillStyle = "white";
        ctx.textAlign = "left";

        Game.ctx.font = "bold 16px Kavivanar";
        ctx.fillText("fps: " + Math.round((fps*100)/100),410,20);
    }
}


//SpriteSheet

var SpriteSheet = new function() {
    this.map = { };
    this.load = function(spriteData, callback) {
        this.map = spriteData;
        this.image = new Image();
        this.image.onload = callback;
        this.image.src = "img/sprites.png";
    };
    this.draw = function(ctx,sprite,x,y,frame) {
        var s = this.map[sprite];
        if(!frame) frame = 0;
        ctx.drawImage(this.image,
            s.sx + frame * s.w,
            s.sy,
            s.w, s.h,
            x,   y,
            s.w, s.h);
    };
}

/*Titulo y Subtitulo pantalla inicio*/
var TitleScreen = function TitleScreen(title,subtitle,callback) {

    var up = false;

    this.step = function(dt) {
        if( ! Game.keys['space'] ) up = true;
        if( up && Game.keys['space'] && callback ) {
            callback();
            Game.started = true;
        }
    };

    this.draw = function(ctx) {
        //Titulo
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        Game.ctx.font = "bold 36px Kavivanar"
        ctx.fillText(title,Game.width/2,Game.height/2+18);
        //Subtitulo
        Game.ctx.font = "bold 16px Kavivanar"
        ctx.fillText(subtitle,Game.width/2,Game.height/2 + 56);
    };
};

/*GameBoard*/
var OBJECT_PLAYER = 1,
    OBJECT_PLAYER_PROJECTILE = 2,
    OBJECT_ENEMY = 4,
    OBJECT_POWERUP = 8,
    OBJECT_TRANSPORT = 16,
    OBJECT_BOARD = 32,
    OBJECT_FINISH = 64;

var GameBoard = function() {
    var board = this;

    // The current list of objects
    this.objects = [];
    this.cnt = {};

    // Add a new object to the object list
    this.add = function(obj) {
        obj.board=this;
        this.objects.unshift(obj);
        this.cnt[obj.type] = (this.cnt[obj.type] || 0) + 1;
        return obj;
    };

    // Reset the list of removed objects
    this.resetRemoved = function() { this.removed = []; };

    // Mark an object for removal
    this.remove = function(obj) {
        var idx = this.removed.indexOf(obj);
        if(idx == -1) {
            this.removed.push(obj);
            return true;
        } else {
            return false;
        }
    };

    // Removed an objects marked for removal from the list
    this.finalizeRemoved = function() {
        for(var i=0,len=this.removed.length;i<len;i++) {
            var idx = this.objects.indexOf(this.removed[i]);
            if(idx != -1) {
                this.cnt[this.removed[i].type]--;
                this.objects.splice(idx,1);
            }
        }
    };
    // Call the same method on all current objects
    this.iterate = function(funcName) {
        var args = Array.prototype.slice.call(arguments,1);
        for(var i=0,len=this.objects.length; i < len; i++) {
            var obj = this.objects[i];
            obj[funcName].apply(obj,args);
        }
    };

    // Find the first object for which func is true
    this.detect = function(func) {
        for(var i = 0,val=null, len=this.objects.length; i < len; i++) {
            if(func.call(this.objects[i])) return this.objects[i];
        }
        return false;
    };


    // Call step on all objects and them delete
    // any object that have been marked for removal
    this.step = function(dt) {
        this.resetRemoved();
        this.iterate('step',dt);
        this.finalizeRemoved();
    };

    // Draw all the objects
    this.draw= function(ctx) {
        this.iterate('draw',ctx);
    };

    this.overlap = function(o1,o2) {
        return !((o1.y+o1.h-1 < o2.y) || (o1.y > o2.y+o2.h-1) ||
            (o1.x+o1.w-1 < o2.x) || (o1.x > o2.x+o2.w-1));
    };

    this.collide = function(obj,type) {
        return this.detect(function() {
            if(obj != this) {
                var col = (!type || this.type & type) && board.overlap(obj,this);
                return col ? this : false;
            }
        });
    };
}
