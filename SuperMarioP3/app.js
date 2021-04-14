
var game = function() {



    var Q = window.Q = Quintus({audioSupporter:["mp3", "ogg"]})
        .include("Sprites, Scenes, Input","2D","Anim","TMX")
        // Maximize this game to whatever the size of the browser is
        .setup("myGame")
        // And turn on default input controls and touch input (for UI)
        .controls();

        Q.Sprite.extend("Mario", {

            init: function (p) {

                this._super(p, {
                    sheet: "marioR",
                    x: 250,
                    y: 250,
                    frame: 0,
                    scale: 3

                });

            }

        });

        Q.Sprite.extend("OneUp", {

            init: function (p) {

                this._super(p, {
                    asset: "1up.png",
                    scale: 0.3

                });

            }

        });


    Q.load([ "mario_small.png","mario_small.json", "1up.png" , "bg.png","tiles.tmx","map2021.tmx"], function() {

        Q.compileSheets("mario_small.png","mario_small.json");

        Q.stageTMX(".tmx",stage)

        Q.scene("level1", function(stage) {
            stage.insert(new Q.Repeater(
                {asset:"bg.png",speedX:0.5,speedY:0.5}
                ));
            mario = new Q.Mario();
            mario2 = new Q.Mario();
            mario2.p.y = 50;
            mario.p.frame = stage.options.frame;

            stage.insert(mario);
            stage.insert(new Q.OneUp(), mario);
            stage.add("viewport").follow(mario, {x: true , y:false});

        });

        Q.stageScene("level1",0,{frame: 0});



    });


}


