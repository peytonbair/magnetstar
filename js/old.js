//
// Simple example of a newtonian orbit
//

//local storage
localStorage.setItem('easy',0);
localStorage.setItem('med',0);
localStorage.setItem('hard',0);
var easy_progress = localStorage.getItem('easy');
var med_progress = localStorage.getItem('med');
var hard_progress = localStorage.getItem('hard');

var canvas = document.getElementById("viewport");

var ctx = canvas.getContext("2d");
var overlay = document.getElementById("overlay");
var start_screen = document.getElementById("start_screen");
var menu_screen = document.getElementById("menu");


//global variables
var mode = 1;
var levels = 1;
var repel_count = 20;
var attractor_count = 20;
var move_count = 10;
var pause_count = 5;
var place_state = 1; //1 = attractor, 2 = repel etc..
var hardness = 1;
var easy_img = new Image();

var medium_img= new Image();
var hard_img = new Image();
var logo_img = new Image();
var home_img = new Image();
var restart_img = new Image();
var pause_img = new Image();
var play_img = new Image();

window.onload = function() {
    var sources = {
        resource1: "img/attractor.png",
        resource2: "img/repel.png",
        resource3: "img/easy.png",
        resource4: "img/end.png",
        resource5: "img/finish.png",
        resource6: "img/hard.png",
        resource7: "img/home.png",
        resource8: "img/logo.png",
        resource9: "img/medium.png",
        resource10: "img/move.png",
        resource11: "img/pause.png",
        resource12: "img/play.png",
        resource13: "img/player2.png",
        resource14: "img/restart.png",
        resource15: "img/spike.png"

    };
    loadImages(sources, initGame);  // calls initGame after *all* images have finished loading
};

function loadImages(sources, callback) {
    var images = {};
    var loadedImages = 0;
    var numImages = 0;
    for (var src in sources) {
        numImages++;
    }
    for (var src in sources) {
        images[src] = new Image();
        images[src].onload = function(){
            if (++loadedImages >= numImages) {
                callback(images);
            }
        };
        images[src].src = sources[src];
    }
}

function initGame(images) {
    // some code here...
    setTimeout(function(){
      document.getElementById('loader').style.display = 'none';
      MAINGAME();



    }, 2000);

}


function MAINGAME(){

  Physics(function (world) {
      //variables that reset
      var display_text = '';
      var effects = [];
      var paused = false;
      place_state = 1;
    //  overlay.classList.add('hide');
      // bounds of the window
      var viewportBounds = Physics.aabb(0, 0, window.innerHeight, window.innerWidth)
          ,edgeBounce
          ,renderer
          ;

      // create a renderer
      renderer = Physics.renderer('canvas', {
          el: 'viewport'
          ,width: window.innerWidth
          ,height: window.innerHeight

          ,meta: false
      });

      // add the renderer
      world.add(renderer);
      // render on each step
      world.on('step', function () {

        if(mode == 1){
          start()
        }

        else if(mode == 2){

          menu();

        }
        else if(mode == 3){
            setTimeout(function (){run_game();}, 200)

        }
        else if (mode == 4) {
          win();
        }


      });
      var game = {
          element: document.getElementById("viewport"),
          width: 800,
          height: 600,
          safeWidth: 800,
          safeHeight: 600
        },

      resizeGame = function () {

        var viewport, newGameWidth, newGameHeight, newGameX, newGameY;

        // Get the dimensions of the viewport
        viewport = {
          width: window.innerWidth,
          height: window.innerHeight
        };

        // Determine game size
        if (game.height / game.width > viewport.height / viewport.width) {
          if (game.safeHeight / game.width > viewport.height / viewport.width) {
              // A
              newGameHeight = viewport.height * game.height / game.safeHeight;
              newGameWidth = newGameHeight * game.width / game.height;
          } else {
              // B
              newGameWidth = viewport.width;
              newGameHeight = newGameWidth * game.height / game.width;
          }
        } else {
          if (game.height / game.safeWidth > viewport.height / viewport.width) {
            // C
            newGameHeight = viewport.height;
            newGameWidth = newGameHeight * game.width / game.height;
          } else {
            // D
            newGameWidth = viewport.width * game.width / game.safeWidth;
            newGameHeight = newGameWidth * game.height / game.width;
          }
        }

        game.element.style.width = newGameWidth + "px";
        game.element.style.height = newGameHeight + "px";

        newGameX = (viewport.width - newGameWidth) / 2;
        newGameY = (viewport.height - newGameHeight) / 2;

        // Set the new padding of the game so it will be centered
        game.element.style.margin = newGameY + "px " + newGameX + "px";
      };

      window.addEventListener("resize", resizeGame);
      resizeGame();

      //get input
      window.addEventListener("mousemove", mouseMoveHandler, false);
      window.addEventListener("keydown", keydown, false);
      window.addEventListener('click', on_canvas_click, false);
      document.oncontextmenu = new Function("return false;");
      var lx, ly;
      //get keypresses
      function mouseMoveHandler(e) {
          //ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
           lx = (e.clientX -canvas.offsetLeft)/(canvas.clientWidth)*800;
           ly = (e.clientY - canvas.offsetTop)/(canvas.clientHeight)*600;


    }
      function keydown(e) {
        if (e.keyCode == "82") {


          flash_screen();

          //world.pause();

        }
        if (e.keyCode == "49") { //1
          place_state = 1;
        }
        if (e.keyCode == "50") {//2
          if(hardness > 1 || levels > 1){
            place_state = 2;
          }
        }
        if (e.keyCode == "51") {//3
          if(hardness > 1 || levels > 7){
            place_state = 3;
          }
        }
        //if (e.keyCode == "52") {//4
        //  levels += 1;
        //  flash_screen();
        //}
      }
      function on_canvas_click(ev) {
          var x = ((ev.clientX - canvas.offsetLeft)/canvas.clientWidth)*800;//* window.innerWidth)/800;
          var y = ((ev.clientY - canvas.offsetTop)/canvas.clientHeight)*600;//*window.innerHeight)/600;



          if(mode == 1){
            mode = 2;
            x = null;
            y = null;
            flash_screen();
          }

          if(mode == 2){
            if( y > 400 & y< 450){
              if(x>200 & x< 300){
                mode = 3;
                attractor_count = 20;
                hardness = 1;
                repel_count = 20;
                move_count = 3;
                levels = 1;
                flash_screen();
              }
              else if(x>350 & x< 450){
                mode = 3;
                hardness = 2;
                attractor_count = 25;
                repel_count = 25;
                move_count = 4;
                levels = 1;
                flash_screen();
              }
              else if(x>500 & x< 600){
                mode = 3;
                hardness = 3;
                attractor_count = 30;
                repel_count = 30;
                move_count = 5;
                levels = 1;
                flash_screen();
              }


            }
            x = null;
            y = null;
         }

          if(mode == 3){
            if(x < 100){
              if(y< 100 && y > 0){
                flash_screen();
                mode = 2;
              }
              else if(y< 200 && y > 100){flash_screen();}
              else if(y< 300 && y > 200 && !paused){place_state = 1;}
              else if(y<400 && y> 300 && !paused){
                if(hardness == 1){
                  if(levels> 1){place_state = 2;}
                }
                else{place_state = 2;}
              }

              else if(y<500 && y > 400 ){
                if(hardness == 1){
                  if(levels> 7){place_state = 3;}
                }
                else{place_state = 3;}
              }
              else if(y<600 && y > 500){
                if(pause_count > 0){
                  if(paused){
                    world.unpause();
                    paused = false;
                  }
                  else{
                    world.pause();
                    paused = true;
                  }
                }
              }

            }
            else{
              if(attractor_count > 0 && x > 100 && place_state == 1 && paused == false){
                world.wakeUpAll(); //keep
                add_attractor(x,y);
                attractor_count = attractor_count - 1;
              }
              if(repel_count > 0 && x > 100 && place_state == 2 && paused == false){
                world.wakeUpAll(); //keep
                add_repel(x, y);
                repel_count = repel_count - 1;
              }
              if(move_count > 0 && x > 100 && place_state == 3 && paused == false){
                world.wakeUpAll(); //keep
                add_move(x, y);
                move_count = move_count - 1;
              }
            }

          }
          if(mode == 4){
            mode = 2;
            ctx.clearRect(0,0,800,600);





          }


    }

      function run_game(){

          world.render();
          for (let i = 0; i < effects.length; i++) {
              effects[i].update()
          }
          //setup
          ctx.font = "24px Arial";


          ctx.fillStyle = 'rgba(40, 45, 50, 1)';
          ctx.fillRect(0, 0, 100, 600);

          //home button
          home_img.src = "img/home.png";
          ctx.drawImage(home_img, 10, 10, 75, 75);

          restart_img.src = 'img/restart.png';
          ctx.drawImage(restart_img, 0, 100, 100, 100);

          pause_img.src = 'img/pause.png';
          play_img.src = 'img/play.png';

          if(paused){
            ctx.drawImage(play_img, 20, 520, 60, 60);
          }
          else{
            ctx.drawImage(pause_img, 35, 525, 30,50);
          }


          ctx.fillStyle = "#ea5959";
          ctx.fillRect(0, 200, 100, 100);

            if(hardness > 1 || levels > 1){
              ctx.fillStyle = "#4286f4";
              ctx.fillRect(0, 300, 100, 100);
            }

          if(hardness > 1 || levels > 7){
            ctx.fillStyle = "orange";
            ctx.fillRect(0, 400, 100, 100);
          }

          ctx.strokeStyle = 'white';
          ctx.lineWidth = 4;
          if(place_state==1){
            ctx.fillStyle = 'white';
            ctx.fillText(attractor_count, 35, 260);
            ctx.beginPath();
            ctx.arc(50, 250, 30, 0, 2 * Math.PI);
            ctx.stroke();
            if(paused == false){
              ctx.beginPath();
              ctx.arc(lx, ly, 30, 0, 2 * Math.PI);
              ctx.stroke();
            }


          }
          else{
            ctx.fillStyle = 'black';
            ctx.fillText(attractor_count, 35, 260);

          }
          if(place_state==2){
            if(hardness > 1 || levels > 1){
              ctx.fillStyle = 'white';
              ctx.fillText(repel_count, 35, 360);

              ctx.beginPath();
              ctx.arc(50, 350, 30, 0, 2 * Math.PI);
              ctx.stroke();

              ctx.beginPath();
              ctx.arc(lx, ly, 30, 0, 2 * Math.PI);
              ctx.stroke();
            }
          }

          else{
            if(hardness > 1 || levels > 1){
              ctx.fillStyle = 'black';
              ctx.fillText(repel_count, 35, 360);
            }

          }
          if(place_state == 3){
            if(levels> 7 || hardness>1){
              ctx.fillStyle = 'white';
              ctx.fillText(move_count, 35, 460);

              ctx.beginPath();
              ctx.arc(50, 450, 30, 0, 2 * Math.PI);
              ctx.stroke();

              ctx.beginPath();
              ctx.arc(lx, ly, 30, 0, 2 * Math.PI);
              ctx.stroke();
            }
          }
          else{
            if(levels> 7 || hardness>1){
              ctx.fillStyle = 'black';
              ctx.fillText(move_count, 35, 460);
            }4

          }
          if(repel_count <= 0 && attractor_count <= 0 && move_count <= 0){
            ctx.fillStyle = 'red';
            ctx.fillText("You're out of magnets! Press the Home Button.", 200, 200);
          }

          ctx.fillStyle = 'white';
          ctx.fillText(levels, 400, 50);
          ctx.fillText(display_text, 800/3, 800/5);
          //render everythin else


        }

      // constrain objects to these bounds
      edgeBounce = Physics.behavior('edge-collision-detection', {
          aabb: viewportBounds
          ,restitution: 0.99
          ,cof: 0.8
      });

      // resize events


      edgeBounce.setAABB(viewportBounds);

      //RANDOM function
      function random(min, max){
         return Math.floor(Math.random() * (max - min) ) + min;
      }
      // create some bodies
      var add_player = function(x,y){
          world.add( Physics.body('circle', {
              x: x
              ,y: y
              ,vx: 0
              ,mass: .0005
              ,radius: 15
              ,label: 'player'
              ,styles: {
                  src: 'img/finish.png'
                  ,width: 30
                  ,height: 30
              }

        }));
      }
      var add_player2 = function(x,y){
          world.add( Physics.body('circle', {
              x: x
              ,y: y
              ,vx: 0
              ,mass: .0005
              ,radius: 15
              ,label: 'player2'
              ,styles: {
                  src: 'img/player2.png'
                  ,width: 30
                  ,height: 30
              }

        }));
      }


      var add_attractor = function(x,y){
          world.add( Physics.body('circle', {
              x: x
              ,y: y
              ,vx: 0
              ,mass: 10
              ,label: 'attractor'
              ,treatment: 'static'
              ,radius: 20
              ,styles: {
                src: 'img/attractor.png'
                ,width: 40
                ,height: 40
            }

        }));
        effects.push(new Effect(x,y, -.35, 150 ,'rgba(255,0,0'));
        effects.push(new Effect(x,y, -.35, 75 ,'rgba(255,0,0'));

      }
      var add_repel = function(x,y){
          world.add( Physics.body('circle', {
              x: x
              ,y: y
              ,vx: 0
              ,mass: -5
              ,treatment: 'static'
              ,radius: 20
              ,styles: {
                src: 'img/repel.png'
                ,width: 40
                ,height: 40
              }

        }));
        effects.push(new Effect(x,y, .45, 150,'rgba(0,0,255'));
        effects.push(new Effect(x,y, .45,75,'rgba(0,0,255'));

      }
      var add_finish = function(x,y){
          world.add( Physics.body('circle', {
              x: x
              ,y: y
              ,label: 'finish'
              ,treatment: 'static'
              ,radius: 25
              ,mass: -.0000000001
              ,styles: {
                  //fillStyle: '#07A663'
                  src: 'img/end.png'
                  ,width: 60
                  ,height: 60
              }

        }));
      }

      var add_move = function(x,y){
          world.add( Physics.body('circle', {
              x: x
              ,y: y
              ,vx: 0
              ,mass: 75
              ,treatment: 'static'
              ,radius: 20
              ,styles: {
                src: 'img/move.png'
                ,width: 40
                ,height: 40
              }

        }));
        effects.push(new Effect(x,y, -.354, 150 ,'rgba(255,165,0'));
        effects.push(new Effect(x,y, -.35, 75 ,'rgba(255,165,0'));

      }
      var add_death = function(x,y){
          world.add( Physics.body('circle', {
              x: x
              ,y: y
              ,mass:.0000001
              ,treatment: 'static'
              ,label: 'death'
              ,radius: 20
              ,styles: {
                src: 'img/spike.png'
                ,width: 40
                ,height: 40

              }

        }));

      }
      var add_rect = function(x,y, width, height){
        world.add( Physics.body('rectangle', {
              width: width
              ,height: height
              ,x: x
              ,y: y
              ,mass: -.00000001
              ,treatment: 'static'
              ,styles: {
                  //src: 'assets/images/crate.jpg'
                  fillStyle: '#8112bc'

              }
          }));
      }

      function Effect(x,y,speed, radius,color){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.opacity = 0;

        // As distance gets closer to 0, increase radius
        this.update = function() {
          if(speed< 0){
            if(this.radius < 20){
              this.radius = 150;
              this.opacity = 0;
            }
            else{
              this.radius += speed;
              this.opacity += .0015;
            }
          }
          else if(speed> 0){
              if(this.radius > 150){
                this.radius = 0;
                this.opacity = 1;
              }
              else{
                this.radius += speed;
                this.opacity -= .003;
              }
          }

          this.draw();
        }

        this.draw = function() {
            ctx.beginPath()
            ctx.arc(
                this.x,
                this.y,
                Math.abs(this.radius),
                0,
                Math.PI * 2
            )
            ctx.lineWidth = 7;
            ctx.strokeStyle = color + ','+ this.opacity +')';

            ctx.stroke()

        }
      }
      //get mouse click

     //colision detection
     var query = Physics.query({
      $or: [
          { bodyA: { label: 'player' }, bodyB: { label: 'finish' } }
          ,{ bodyB: { label: 'player' }, bodyA: { label: 'finish' } }
      ]
      });
      var query2 = Physics.query({
       $or: [
           { bodyA: { label: 'player2' }, bodyB: { label: 'finish' } }
           ,{ bodyB: { label: 'player2' }, bodyA: { label: 'finish' } }
       ]
       });
       var query3 = Physics.query({
        $or: [
            { bodyA: { label: 'player' }, bodyB: { label: 'death' } }
            ,{ bodyB: { label: 'player' }, bodyA: { label: 'death' } }
        ]
        });

      // monitor collisions
      world.on('collisions:detected', function( data, e ){
          // find the first collision that matches the query
          var found = Physics.util.find( data.collisions, query );
          if ( found ){
              // handle the collision
             window.removeEventListener("keydown", keydown, false);
             canvas.removeEventListener('click', on_canvas_click, false);
             //add animation
             next_section();

          }
      });
      world.on('collisions:detected', function( data, e ){
          // find the first collision that matches the query
          var found = Physics.util.find( data.collisions, query2 );
          if ( found ){
              // handle the collision
             window.removeEventListener("keydown", keydown, false);
             canvas.removeEventListener('click', on_canvas_click, false);
             //add animation
             flash_screen();

          }
      });
      world.on('collisions:detected', function( data, e ){
          // find the first collision that matches the query
          var found = Physics.util.find( data.collisions, query3 );
          if ( found ){
              // handle the collision
             window.removeEventListener("keydown", keydown, false);
             canvas.removeEventListener('click', on_canvas_click, false);
             //add animation
             flash_screen();

          }
      });
      //handle the keyboard

      function next_section(){
            if(hardness == 1){
              if(easy_progress <= levels){
                easy_progress = levels;
                localStorage.setItem('easy_progress',levels);
              }

            }
            else if(hardness == 2){
              if(med_progress <= levels){
                med_progress = levels;
                localStorage.setItem('med_progress',levels);
              }
            }
            if(hardness == 3){
              if(hard_progress <= levels){
                hard_progress = levels;
                localStorage.setItem('hard_progress',levels);
              }
            }
             levels += 1;
             flash_screen();
      }
      function flash_screen(){
        world.destroy();
        window.removeEventListener("keydown", keydown, false);
        window.removeEventListener('click', on_canvas_click, false);
        canvas.removeEventListener('click', on_canvas_click, false);
        canvas.classList.remove();
        overlay.classList.remove('hide');
        overlay.classList.remove('show');
        overlay.classList.add("flash");
        setTimeout(function (){ MAINGAME();}, 400); //length of delay
      }
      //level setup
      function start(){

        logo_img.src = "img/logo.png";
        logo_img.onload = function () {
            ctx.drawImage(logo_img, 200, 100);
          }
        ctx.fillStyle = 'white';
        ctx.font= '48px Arial';
        ctx.fillText('Click to Play', 280, 500);

      }
      var i = true;
      function menu(){
          ctx.fillStyle = 'white';
          ctx.font = '30px Arial';
          easy_img.src = "img/easy.png";
          medium_img.src = "img/medium.png";
          hard_img.src = "img/hard.png";
          logo_img.src = "img/logo.png";

          ctx.fillText(easy_progress  + '/15', 220, 500);
          ctx.fillText(med_progress + '/15', 370, 500);
          ctx.fillText(hard_progress + '/15', 520, 500);

          logo_img.onload = function () {
              ctx.drawImage(logo_img, 180, 50);
            }

          easy_img.onload = function () {
              ctx.drawImage(easy_img, 200, 400, 100, 50);
            }
          medium_img.onload = function () {
              ctx.drawImage(medium_img, 350, 400, 100, 50);
            }
          hard_img.onload = function () {
              ctx.drawImage(hard_img, 500, 400, 100, 50);
            }

            ctx.fillStyle = 'white';
            ctx.font= '24px Arial';

            ctx.fillText('Created by p_bair', 590, 575);
      }

      function win(){

        ctx.fillStyle = 'white';
        ctx.font = '25px Arial';
         logo_img.src = "img/logo.png";
         logo_img.onload = function () {
             ctx.drawImage(logo_img, 180, 150);
           }
         ctx.fillText("You're a", 375, 100);

         ctx.fillText("Click to Continue", 325, 500);

}

      function level1(){
        display_text = 'Use the red balls to pull the player';
        add_player(300,300);
        add_finish(600,300);
      }
      function level2(){
        display_text = 'The Blue ball does the opposite';
        place_state = 2;
        add_player(300,300);
        add_finish(600,300);

      }
      function level3(){
        display_text = 'Use Hotkeys, like 1, 2 & 3';

        add_player(300,300);
        add_rect(450,300, 20, 100);
        add_finish(600,300);
      }
      function level4(){
        display_text = "Don't let the pink star get to the finish!";
        add_player(400,100);
        add_player2(400,450);
        add_finish(400,300);
      }
      function level5(){
        display_text = 'Your magnets are limited so be careful...';
        add_player(150,200);
        add_player2(600,200);
        add_finish(600,500);
        add_rect(400, 400, 300, 20);
      }
      function level6(){
        display_text = 'Press R if you get stuck';
        add_player(200,300);

        add_finish(600,400);
        add_rect(400, 400, 20, 550);
        add_rect(400,20, 400, 20);
      }
      function level7(){
        add_player(200,300);
        add_rect(550,300, 10, 100);
        add_rect(600,250, 100, 10);

        add_finish(600,300);
      }
      function level8(){
        place_state = 3;
        display_text = 'Try the Orange ball';
        add_player(300,300);
        add_finish(600,300);
      }
      function level9(){
        add_player(300,500);
        add_finish(400,400);
        add_rect(350,300, 15, 310);
        add_rect(500,450, 315, 15);
      }
      function level10(){
        display_text = "          Don't touch that!"
        add_player(300,300);
        add_death(450, 300);
        add_finish(600,300);
      }
      function level11(){
        add_player(300,300);
        add_player2(300,350);
        add_rect(400, 325, 500, 15);
        add_finish(650,450);
      }
      function level12(){
        add_player(300,300);
        add_rect(450,300, 20, 250);
        add_finish(600,300);
      }
      function level13(){
        add_player(300,200);
        add_player2(300,400);
        add_finish(600,400);

      }
      function level14(){
        add_player(200,150);
        add_finish(700,500);
        add_rect(400,400,15,400);
        add_rect(400,600,800,20);
      }
      function level15(){
        add_player(600,200);
        add_finish(600,350);
        add_rect(500,300,400,15);
        add_rect(500,400,400,15);
        add_rect(693,350,15,100);
      }

      function med_level1(){
        display_text = '             Here We Go!';
        add_player(300,300);
        add_finish(600,300);
      }
      function med_level2(){
        add_player(300,300);
        add_death(450, 275);
        add_death(450, 325);
        add_finish(600,300);
      }
      function med_level3(){
        add_player(200,250);
        add_rect(400, 0, 15, 550);
        add_rect(400, 600, 15, 550);

        add_finish(600,300);
      }
      function med_level4(){
        add_player(200,200);
        add_rect(200, 300, 400, 15);
        add_rect(750, 300, 400, 15);

        add_rect(400, 400, 400, 15);

        add_finish(400,500);
      }
      function med_level5(){
        add_player(400,200);
        add_death(350,300);
        add_death(400,300);
        add_death(450,300);


        add_finish(400,500);
      }
      function med_level6(){
        //sides
        add_rect(400,10,800,20);
        add_rect(400,590,800,20);
        add_rect(100,300,30,600);
        add_rect(800,300,30,600);

        add_death(300,100);
        add_death(600,200);
        add_death(400,200);

        add_death(300,350);
        add_death(600,400);
        add_death(400,500);
        add_death(480,300);

        add_player(200,200);

        add_finish(700, 300);


      }
      function med_level7(){
        display_text='                Little Dipper??';
        add_player(200,300);
        add_finish(700,300);

        add_death(200,180);
        add_death(350,200);
        add_death(400,300);
        add_death(400,400);
        add_death(500,400);
        add_death(550,300);


      }
      function med_level8(){
        display_text="            It only takes one";
        add_player(200,500);
        add_finish(700, 100);

        add_rect(350,200,150,100);
        add_rect(600,200,150,100);

        add_rect(350,400,150,100);
        add_rect(600,400,150,100);

      }
      function med_level9(){
        add_attractor(300,100);
        add_attractor(600,100);
        add_player(450,100);

        add_finish(450, 500);

      }
      function med_level10(){
        add_player(200,500);
        add_finish(700,500);
        add_rect(400,400,15,400);
        add_rect(400,600,800,20);
        add_death(600,500);
        add_death(500,500);

      }
      function med_level11(){
        add_player(200,100);
        add_finish(700,500);
        add_death(200,500);
        add_death(300,400);
        add_death(400,300);
        add_death(500,200);
        add_death(600,100);



      }
      function med_level12(){
        add_player(300,300);
        add_finish(600,300);
        add_player2(400,300);
        add_player2(500,300);


      }
      function med_level13(){
        add_player(200,250);
        add_rect(400, 0, 15, 500);
        add_rect(400, 600, 15, 500);
        add_death(400,250);
        add_death(400,350);
        add_finish(600,300);
      }
      function med_level14(){
        add_player(450,300);
        add_rect(450,200,400,15);
        add_rect(450,400,400,15);
        add_player2(450,100);
        add_finish(450,500);

      }
      function med_level15(){
        display_text = '                Thanks Karlie!'
        add_player(450,350);
        add_finish(450, 500);

        add_rect(350,200,100,15);
        add_rect(550,200,100,15);

        add_rect(300,300,15,215);
        add_rect(600,300,15,215);

        add_rect(450,400,300,15)
      }

      function hard_level1(){
        display_text = '             Good luck!';
        add_player(300,300);
        add_finish(600,300);
      }
      function hard_level2(){
        display_text='It will bounce in eventually , ¯|_(ツ)_/¯';
        add_player(200,200);
        add_rect(400,0,15,600);
        add_rect(400,600,15,300);
        add_rect(700,0,15,200);

        add_finish(750,50);

        add_rect(400,10,800,20);
        add_rect(400,590,800,20);
        add_rect(100,300,30,600);
        add_rect(800,300,30,600);

      }
      function hard_level3(){
        add_player(300,300);
        add_player2(200,300);
        add_rect(450,300, 20, 250);
        add_finish(600,300);
      }
      function hard_level4(){
        display_text = '                Think fast!';
        add_player(400,550);
        add_repel(400,600);
        add_finish(500,100);
        add_death(400,200);

      }
      function hard_level5(){
        add_player(700,100);
        add_rect(0,300,750,200);
        add_rect(800,300,650,200);

        add_finish(700,500);
      }
      function hard_level6(){

        add_player(300,300);
        add_rect(540,300, 10, 100);
        add_rect(585,250, 100, 10);
        add_rect(585,350, 100, 10);
        add_finish(590,300);
      }
      function hard_level7(){
        add_player(200,200);
        add_player2(600,400)
        add_player2(600,200);
        add_player2(200,400);

        add_finish(400,300);
      }
      function hard_level8(){

        add_player(400, 300);
        add_finish(500, 300);
        add_rect(450, 300,15,200);
        add_rect(450,200,300,15);
        add_rect(450,400,300,15);
      }
      function hard_level9(){
        add_player(200,300);
        add_finish(700,300);

        add_rect(350,0,15,600);
        add_rect(350,600,15, 300);


        add_rect(550,0,15,300);
        add_rect(550,600,15, 600);


      }
      function hard_level10(){
        display_text = "    I'll give you a break ;)";
        add_player(300,300);
        add_finish(700,300);
        add_repel(300,100);
        add_repel(300, 500);
        add_death(500,300);
      }
      function hard_level11(){
        display_text = '      I hope you saved one';
        add_player(200,300);
        add_move(200, 100);
        add_move(200,500);
        add_finish(600,300);
      }
      function hard_level12(){

        display_text = '           Distraction is Key';
        add_player(200,300);
        add_rect(300,300,15,300);
        add_rect(600,300,15,300);
        add_player2(500,300);
        add_finish(700,300);
      }
      function hard_level13(){
        add_player(450,100);

        add_player2(200,300);
        add_player2(300,300);
        add_player2(400,300);
        add_player2(500,300);
        add_player2(600,300);
        add_player2(700,300);

        add_finish(450,500);
      }
      function hard_level14(){
        add_player(450,500);
        add_finish(450, 350);

        add_rect(350,200,100,15);
        add_rect(550,200,100,15);

        add_rect(300,300,15,215);
        add_rect(600,300,15,215);

        add_rect(450,400,300,15)

      }
      function hard_level15(){
        add_player(200,100);
        add_finish(700,500);
        //sides
        add_rect(400,10,800,20);
        add_rect(400,590,800,20);
        add_rect(100,300,30,600);
        add_rect(800,300,30,600);

        add_rect(450, 300, 350,300);

        add_death(200,550);
        add_death(750,100);
        add_death(500,500);
        add_death(675,400);

      }


  function run_levels(){
    if(hardness == 1){
      if(levels == 1){level1();}
      else if(levels == 2){level2();}
      else if(levels == 3){level3();}
      else if(levels == 4){level4();}
      else if(levels == 5){level5();}
      else if(levels == 6){level6();}
      else if(levels == 7){level7();}
      else if(levels == 8){level8();}
      else if(levels == 9){level9();}
      else if(levels == 10){level10();}
      else if(levels == 11){level11();}
      else if(levels == 12){level12();}
      else if(levels == 13){level13();}
      else if(levels == 14){level14();}
      else if(levels == 15){level15();}
      else if(levels > 15){mode = 4;}
    }
    else if(hardness == 2){
      if(levels == 1){med_level1();}
      else if(levels == 2){med_level2();}
      else if(levels == 3){med_level3();}
      else if(levels == 4){med_level4();}
      else if(levels == 5){med_level5();}
      else if(levels == 6){med_level6();}
      else if(levels == 7){med_level7();}
      else if(levels == 8){med_level8();}
      else if(levels == 9){med_level9();}
      else if(levels == 10){med_level10();}
      else if(levels == 11){med_level11();}
      else if(levels == 12){med_level12();}
      else if(levels == 13){med_level13();}
      else if(levels == 14){med_level14();}
      else if(levels == 15){med_level15();}
        else if(levels > 15){mode = 4;}
    }
    else if(hardness == 3){
      if(levels == 1){hard_level1();}
      else if(levels == 2){hard_level2();}
      else if(levels == 3){hard_level3();}
      else if(levels == 4){hard_level4();}
      else if(levels == 5){hard_level5();}
      else if(levels == 6){hard_level6();}
      else if(levels == 7){hard_level7();}
      else if(levels == 8){hard_level8();}
      else if(levels == 9){hard_level9();}
      else if(levels == 10){hard_level10();}
      else if(levels == 11){hard_level11();}
      else if(levels == 12){hard_level12();}
      else if(levels == 13){hard_level13();}
      else if(levels == 14){hard_level14();}
      else if(levels == 15){hard_level15();}
      else if(levels > 15){mode = 4;}
    }


  }
  run_levels();


      // add things to the world

      world.add([


           //Physics.behavior('constant-acceleration')
          Physics.behavior('body-impulse-response')
          ,Physics.behavior('body-collision-detection')
          ,Physics.behavior('sweep-prune')

          ,Physics.behavior('newtonian', { strength: .5 })
          //,edgeBounce
      ]);

      // subscribe to ticker to advance the simulation
      Physics.util.ticker.on(function( time ) {
          world.step( time );
      });

    setTimeout(function (){ overlay.classList.remove('flash');}, 400)
  });
}
