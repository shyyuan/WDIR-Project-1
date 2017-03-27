console.log('Project 1 js file is connected');
// Window onloader ***********************************
$(function(){
  // Event Listener
  $('#type').on('change', APP.setType);
  $('#resetLevel').on('click', UI.resetLevel);
  $('#resetGame').on('click', UI.resetGame);

}) /// End of Window onload **************************

//====================================================
// App data and Global Varibales
var APP = {
  level: 0,
  live: 0, //this.level+2,
  numCards: 0, //Math.pow((this.level+1)*2,2);,
  $board: $('#gameBoard'),
  $type: 'number', // default
  width: 80,
  height: 80,
  playerScore: 0,
  questionMarkImg: '<img src="images/question_mark.png" class="questionMark">',
  smileImg: '<img src="images/smile.png" class="smile">',
  // per round variables
  gameCards: [], // An array to store object {cardPosition, cardValue}
  gameCardsClicked:[], // An array to store cardPostion number
  cardClicked:[], // Array to store the array [position,value] of the two picked card value
  // function to generate random whole numbner between max and min
  // Math.floor(Math.random * (max-min+1)) + min
  generateNum: function(max,min){
    return Math.floor(Math.random()* (max-min+1)) + min;
  }, // end of generateNum
  setType: function(){
    APP.$type = $('#type option:selected').val(),
    console.log('Selected Type ' + APP.$type);
  }
} // End of
// =======================================================

// *******************************************************
// UI object, put all functions that affect the DOM
var UI = {
  // 1 1 1 1 1 1
  // generateBoard funrction
  generateBoard: function(level){
    var localLevel = parseInt(level);
    APP.live = APP.live + (localLevel+1)*2;
    APP.numCards = Math.pow((localLevel+1)*2,2);
    //console.log(numCards);
    // set board width and heigh based on number of cards
    var boardWidth = (level+1)*2*(APP.width+5)+'px';
    var boardHeigth = (level+1)*2*(APP.height+5)+'px';
    APP.$board.css({'width':boardWidth,'height':boardHeigth});
    // for loop to generate the cards
    for (var i=1; i<=APP.numCards; i++){
      // create card div, add id and class
      var $card = $('<div>').attr('id','card'+i).addClass('card');
      $card.append(APP.questionMarkImg);
      // set click listener on each card
      $card.on('click',UI.flipCard);
      // append to gameBoard div
      APP.$board.append($card);
      // create an object in gameCards array
      var tempObj = {cardPosition:i, cardValue:''};
      APP.gameCards.push(tempObj);
      //console.log('Temp Obj ' + tempObj);
      //console.log(gameCards.cardPosition);
    } // end of for loop
    //console.log('game cards ' + gameCards);
    var displayLevel = localLevel+1;
    $('#level').text('Level: ' + displayLevel);
    $('#chance').text('Lives: ');
    // for (var i=1; i<=APP.live; i++) {
    //   $('#chance').append(APP.smileImg);
    // }
    UI.updateSmileFace();
    $('#feedback h4').text('Click a card to start').css('color','black');
    UI.createGameCards(APP.numCards);
  }, // end of generateQuilt
  // 2 2 2 2 2 2
  //function to create the cards in player
  createGameCards: function(numCards){
    // generate random, no repeat numbers (0-99) and put into a temp array.  The number of the number set is half the cards.
    // if 4 Cards on the board, generate 2 numbers
    // if 100 cards on teh board, generate 50 numbers
    var tempCards = [];
    for (var i=1; i<=numCards/2; i++){
      var num = APP.generateNum(99,0);
      if (tempCards.indexOf(num) < 0) {
        tempCards.push(num);
      } else {
        i--;
      }
    }
    // duplicate the number set and put together
    tempCards = tempCards.concat(tempCards);
    //console.log('numers ' + tempCards)
    // generate random distribute position set
    var tempCardsPosition = [];
    for (var i=1; i<=numCards; i++){
      var num = APP.generateNum(numCards,1);
      if (tempCardsPosition.indexOf(num) < 0) {
        tempCardsPosition.push(num);
      } else {
        i--;
      }
    }
    //console.log('Postions ' + tempCardsPosition);
    // distribute the into gameCards
    for (var i=0; i<APP.gameCards.length; i++){
      var ind = tempCardsPosition.indexOf(APP.gameCards[i].cardPosition);
      //  console.log('Index ' + ind);
      APP.gameCards[i].cardValue = tempCards[ind];
    }
    //console.log(gameCards);
  }, // end of createGameCards
  // 3 3 3 3 3 3
  // flip the card that clicked
  flipCard: function(){
    if (APP.live !== 0){
        $('#feedback h4').text('Click another card').css('color','black');

        var tempP = $(this).attr('id').replace('card','');
        var value = APP.gameCards.filter(function(element){
          return element.cardPosition == tempP;
        })[0].cardValue;

        if (APP.gameCardsClicked.filter(function(element){
          return element == tempP
        }).length === 0 ) {

          var tempArr = [tempP,value];
          APP.cardClicked.push(tempArr);
          $(this).text(value).css('background','lightgreen')
          //console.log('Card clicked '+cardClicked);
          if (APP.cardClicked.length === 2){
            UI.isMatch(APP.cardClicked);
          }
        }
    }
  }, // End of flipCard function
  // 4 4 4 4 4 4 4
  isMatch: function(twoCards){
    // twoCards is an Array with two arrays
    if(twoCards[0][1] === twoCards[1][1]) {
      console.log('match');
      APP.gameCardsClicked.push(twoCards[0][0]);
      APP.gameCardsClicked.push(twoCards[1][0]);
      console.log('Stay flipped cards: ' + APP.gameCardsClicked );
      console.log(APP.live);
      APP.live++;
      console.log(APP.live);
      UI.updateSmileFace();
      $('#feedback h4').text('You found a match.').css('color','green');
      if (APP.gameCardsClicked.length === APP.numCards) {
        console.log('Level round over, move to next level');
        setTimeout(function() {UI.levelUp();},1000);
      } else {
        setTimeout(function() {updateFeedback();}, 700);
        var updateFeedback = function() {
          $('#feedback h4').text('Click a card').css('color','black');
        }
      }
    } else {
      console.log('no match');
      $('#feedback h4').text('Sorry, try again.').css('color','red');

      setTimeout(function() {flipBack();},700);
      var flipBack = function(){
        console.log('flip back');
        console.log(APP.live);
        APP.live--;
        console.log(APP.live);
        UI.updateSmileFace();

        $('#card'+twoCards[0][0]).text('').css('background','yellow');
        $('#card'+twoCards[0][0]).append(APP.questionMarkImg);
        $('#card'+twoCards[1][0]).text('').css('background','yellow');
        $('#card'+twoCards[1][0]).append(APP.questionMarkImg);
        if (APP.live !== 0){
          $('#feedback h4').text('Click a card').css('color','black');
        } else {
          $('#feedback h4').text('Game over. Thank you for playing.').css('color','red');
        }

      }
    }
    //clearTimeout(delayTime);
    APP.cardClicked=[];
  }, // end of isMatch checking
  // 5 5 5 5 5 5
  // reset level round
  resetLevelVariables: function(){
    APP.gameCards = [];
    APP.gameCardsClicked = [];
    APP.cardClicked = [];
    //$('#gameBoard div').text('').css('background','yellow');
    //$('#gameBoard div').append(APP.img);
  },
  // 6 6 6 6 6 6 6
  // move one level up
  levelUp: function(){
    $('#feedback h4').text('Level end. Move to next level.').css('color','black');
    setTimeout(function() {toNextLevel();},1000);
    var toNextLevel = function(){
      UI.resetLevelVariables();
      $('#gameBoard').children('div').remove();
      APP.level++;
      UI.generateBoard(APP.level);
    }
  },
  // 7 7 7 7 7 7
  updateSmileFace: function(){

    $('#chance').children('img').remove();
    for (var i=1; i<=APP.live; i++) {
      $('#chance').append(APP.smileImg);
    }
  },
  // 8 8 8 8 8 8 8
  resetLevel: function(){
    UI.resetLevelVariables();
    $('#gameBoard').children('div').remove();
    APP.live = 0;
    UI.generateBoard(APP.level);
  },
  // 9 9 9 9 9 9
  resetGame: function(){
    APP.level = 0;
    UI.resetLevel();
  }

} // end of UI Object
// ********************************************************

// ========================================================
var Data = {



}


// ========================================================



// evoke the function
UI.generateBoard(APP.level);
