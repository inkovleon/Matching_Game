var myGame ={
   gameSettings:{
               language: 'en',
               numberCollors:5,
               gameTime:60,
               probabilityOfMatch:0.25,             //с какой вероятностью случайно определяем значения и цвет левой и правой карточек
               Text:[
                              {en:'black', ru:'чёрный'},
                              {en:'red', ru: 'красный'},
                              {en:'blue', ru: 'синий'},
                              {en:'yellow', ru: 'жёлтый'},
                              {en:'green', ru: 'зелёный'}
                     ]
   },
   Score: 0,
   Matches:0,
   Errs:0,
   stopMain:0,
   runGame:false,
   tStart: 0,
   gScreen:'greeting',
   gameScreen:{
               width: 600,
               height:400,
               leftConnerX:400,
               leftConnerY:250,
               canvas: 0, //document.querySelector('.myCanvas'),
               ctx: 0, //canvas.getContext('2d'),
               setConner: function (){
                              this.canvas.width = window.innerWidth;
                              this.canvas.height = window.innerHeight;
                              //определяем координаты левого верхнего угла игрового поля
                              if (window.innerWidth>600){
                                            this.leftConnerX=(window.innerWidth-550)/2;
                              }
                              else {this.leftConnerX=0;}
                              if (window.innerHeight>400){
                                            this.leftConnerY=(window.innerHeight-400)/2;
                              }
                              else {this.leftConnerY=0;}
               },
               drawWindow: function (){
                              //заливаем экран чёрным
                              this.ctx.fillStyle = 'rgb(50, 50, 50)';
                              this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                              //Заливаем холст серым
                              this.ctx.fillStyle = 'rgb(155, 155, 155)';
                              this.ctx.fillRect(this.leftConnerX+0, this.leftConnerY + 0, this.width, this.height);
               },
               resizeW: function(){
                              myGame.gameScreen.setConner();
                              myGame.gameScreen.drawWindow();

                              if(myGame.gScreen==='greeting'){ myGame.gameScreen.showGreeting();}
                              else if (myGame.gScreen==='game'){
                                            myGame.gameScreen.showScore();
                                            showCards();
                              }
               },

               showLynx: function(){
               },

               showGreeting: function(){
                              this.ctx.font = '40px georgia';
                              this.ctx.textAlign = 'center';
                              this.ctx.fillStyle = 'blue';
                              this.ctx.fillText("Matching game", this.leftConnerX+300, this.leftConnerY + 70);
                              this.ctx.textAlign = 'left';
                              this.ctx.fillStyle = 'green';
                              this.ctx.font = '24px georgia';
                              this.ctx.fillText("If meaning of text on the left card corresponds to ", this.leftConnerX+50, this.leftConnerY + 120);
                              this.ctx.fillText("the color of text on the right card, press ", this.leftConnerX+50, this.leftConnerY + 150);
                              this.ctx.textAlign = 'center';
                              this.ctx.fillText("RIGHT arrow ", this.leftConnerX+300, this.leftConnerY + 180);
                              this.ctx.fillStyle = 'red';
                              this.ctx.textAlign = 'left';
                              this.ctx.fillText("If meaning of text on the left card doesn't  ", this.leftConnerX+50, this.leftConnerY + 220);
                              this.ctx.fillText("correspond to the color of text on the right card, press", this.leftConnerX+10, this.leftConnerY + 250);
                              this.ctx.textAlign = 'center';
                              this.ctx.fillText("LEFT arrow ", this.leftConnerX+300, this.leftConnerY + 280);
                              this.ctx.fillStyle = 'black';
                              this.ctx.fillText("Press ENTER to start the game ", this.leftConnerX+300, this.leftConnerY + 350);

               },
               showScore: function(){
               //полоска статуса
                              this.ctx.fillStyle = 'rgb(250, 250, 250)';
                              this.ctx.fillRect(this.leftConnerX+50, this.leftConnerY + 250, 500, 50);
                              this.ctx.textAlign= 'left';
                              //отображаем статус
                              this.ctx.fillStyle = 'black';
                              this.ctx.font = '20px georgia';
                              if(myGame.runGame){tNow = Math.floor((window.performance.now() - myGame.tStart)/100)/10;}
                              this.ctx.fillText('Correct: '+ myGame.Matches + '     Errors: '+ myGame.Errs +'     Score: '+myGame.Score+'    Time: '+ tNow , this.leftConnerX+100, this.leftConnerY + 280);
                   if (tNow>=myGame.gameSettings.gameTime) {myGame.endGame();}
               }
   },
   cards:{
               left:{
                              text:  '',
                              textVisible: '',
                              color: ''
               },
               right:{
                              text:  '',
                              textVisible: '',
                              color: ''

               },
               generateCards: function(){
                              var i= random(0,5);
                              this.left.text = myGame.gameSettings.Text[i].en;
                              if (myGame.gameSettings.language==='en'){this.left.textVisible=this.left.text;}
                              else {this.left.textVisible=myGame.gameSettings.Text[i].ru;}
                              this.left.color = myGame.gameSettings.Text[random(0,5)].en;
                              i= random(0,5);
                              this.right.text = myGame.gameSettings.Text[i].en;
                              if (myGame.gameSettings.language==='en'){this.right.textVisible=this.right.text;}
                              else {this.right.textVisible=myGame.gameSettings.Text[i].ru;}

                              if (random(0,4) < 4*myGame.gameSettings.probabilityOfMatch) {               this.right.color = this.left.text;}
                              else {this.right.color = myGame.gameSettings.Text[random(0,5)].en;}

               }
   },
   mark:{
               markDelay:400,// время в млисекундах, на которое будет появляться значек корректности ответа
               imageCorrect: new Image(),
               imageWrong: new Image(),
               initMark: function(){
                              this.imageCorrect.src = 'img/correct.png';
                              this.imageWrong.src = 'img/wrong.png';
               },
               showMark: function(answer){
                              if(answer){myGame.gameScreen.ctx.drawImage(this.imageCorrect, myGame.gameScreen.leftConnerX+275, myGame.gameScreen.leftConnerY + 100);}
                              else {myGame.gameScreen.ctx.drawImage(this.imageWrong, myGame.gameScreen.leftConnerX+275, myGame.gameScreen.leftConnerY + 100);}
                              window.setTimeout(this.hideMark, this.markDelay);
               },
               hideMark: function(){
                              myGame.gameScreen.ctx.fillStyle = 'rgb(155, 155, 155)';
                              myGame.gameScreen.ctx.fillRect(myGame.gameScreen.leftConnerX+275, myGame.gameScreen.leftConnerY + 100, 70, 70);
               }

   },

   preloadG: function(){
                              this.gameScreen.canvas= document.querySelector('.myCanvas');
                              this.gameScreen.ctx= this.gameScreen.canvas.getContext('2d');
                              window.onresize=this.gameScreen.resizeW;
                              document.addEventListener("keydown", keyDownHandler, false);
                              document.addEventListener("keyup", keyUpHandler, false);
                              this.mark.initMark();
                              this.gameScreen.setConner();
                              this.gameScreen.drawWindow();
                              this.gameScreen.showGreeting();
   },

   startGame: function(){
               //обнуляем счет
               this.Score=0;
               this.Matches=0;
               this.Errs=0;
               this.tStart = window.performance.now();
               this.runGame=true;
               this.gScreen='game';
               tNow=0;
               main();
               oneStep();
   },

   endGame: function(){
               window.cancelAnimationFrame( this.stopMain );
               this.runGame = false;
   }

};

//   var leftPressed= false;
//   var rightPressed= false;
   var tNow = 0;


function random(min,max) {
   var num = Math.floor(Math.random()*(max-min)) + min;
   return num;
}



function showCards(){
               //левая карточка (прямоугольник)
               myGame.gameScreen.ctx.fillStyle = 'rgb(255, 255, 255)';
               myGame.gameScreen.ctx.fillRect(myGame.gameScreen.leftConnerX+50, myGame.gameScreen.leftConnerY + 50, 200, 150);

               //правая карточка (прямоугольник)
               myGame.gameScreen.ctx.fillStyle = 'rgb(255, 255, 255)';
               myGame.gameScreen.ctx.fillRect(myGame.gameScreen.leftConnerX+350, myGame.gameScreen.leftConnerY + 50, 200, 150);

               //Устанавливаем шрифт и выравнивание
               myGame.gameScreen.ctx.font = '60px georgia';
               myGame.gameScreen.ctx.textAlign = 'center';

               //отображаем левую надпись
               myGame.gameScreen.ctx.fillStyle = myGame.cards.left.color;
               myGame.gameScreen.ctx.fillText(myGame.cards.left.textVisible, myGame.gameScreen.leftConnerX+150, myGame.gameScreen.leftConnerY + 130);

               //отображаем правую надпись
               myGame.gameScreen.ctx.fillStyle = myGame.cards.right.color;
               myGame.gameScreen.ctx.fillText(myGame.cards.right.textVisible, myGame.gameScreen.leftConnerX+450, myGame.gameScreen.leftConnerY + 130);
}



function oneStep(){
               myGame.cards.generateCards();
               showCards();
               myGame.gameScreen.showScore();
}

function processAnswer(answer){
               if (answer){myGame.mark.showMark(true);
                              myGame.Matches++;
               }
               else {  myGame.mark.showMark(false);
                              myGame.Errs++;
               }
               myGame.Score=myGame.Matches-myGame.Errs;
}

function keyDownHandler(e) {
  if (myGame.runGame){
    if(e.key == "Right" || e.key == "ArrowRight") {
//        rightPressed = true;
               if (myGame.cards.left.text==myGame.cards.right.color) {processAnswer(true);}
               else{processAnswer(false);}
               oneStep();
               }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
//        leftPressed = true;
               if (myGame.cards.left.text!=myGame.cards.right.color) {processAnswer(true);}
               else{processAnswer(false);}
               oneStep();
    }
  }
  else{
               if (e.key == "Enter") {
                              myGame.gameScreen.drawWindow();
                              myGame.startGame();
               }
               else if (e.key == "Esc") {
                              window.exit();
               }
  }
}
function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
    else if(e.key == "Up" || e.key == "ArrowUp") {
        upPressed = false;
    }
}


// функция основоного цикла игры
window.main = function () {
  myGame.stopMain = window.requestAnimationFrame( main );
  myGame.gameScreen.showScore();

};

window.onload=function(){myGame.preloadG();};
