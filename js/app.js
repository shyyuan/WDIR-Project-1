console.log('Project 1 js file is connected');
// window onloader
$(function(){
  console.log('Inside window onload');

}) /// End of Window onload

// Global Varibales
var level = 1;
var live = level+2;
var numCards = Math.pow((level+1)*2,2);
var $board = $('#gameBoard');
var width = 80;
var height = 80;
var playerScore = 0;

// per round variables
var gameCards = [];
var gameCardsClided = [];
var cardClicked = [];

var resetLevel = function(){
  gameCards = [];
  gameCardsClicked = [];
  cardClicked = [];
}

// function to generate random whole numbner between max and min
// Math.floor(Math.random * (max-min+1)) + min
var generateNum = function(max,min){
   return Math.floor(Math.random()* (max-min+1)) + min;
} // end of generateNum

//function to create the cards in player
var createGameCards = function(){
  // generate random, no repeat numbers (0-99) and put into a temp array.  The number of the number set is half the cards.
  // if 4 Cards on the board, generate 2 numbers
  // if 100 cards on teh board, generate 50 numbers
  var tempCards = [];
  for(var i=1; i<=numCards/2; i++){
    var num = generateNum(99,0);
    if (tempCards.indexOf(num) < 0) {
      tempCards.push(num);
    } else {
      i--;
    }
  }
  // duplicate the number set and put together
  tempCards = tempCards.concat(tempCards);
  // generate random distribute position set
  var tempCardsPosition = [];
  for(var i=1; i<=numCards; i++){
    var num = generateNum(numCards,1);
    if (tempCardsPosition.indexOf(num) < 0) {
      tempCardsPosition.push(num);
    } else {
      i--;
    }
  }
  // distribute the into gameCards
  for (var i=0; i<tempCardsPosition.length; i++){
    var arr = gameCards.filter(function(element){
        return element.cardPosition == tempCardsPosition[i];
    })[0].cardValue=tempCards[i];
  }
  //console.log(gameCards);
} // end of createGameCards

// generateBoard function
var generateBoard = function(num){
  // set board width and heigh based on number of cards
  var boardWidth = (level+1)*2*(width+5)+'px';
  var boardHeigth = (level+1)*2*(height+5)+'px';
  $board.css({'width':boardWidth,'height':boardHeigth});
  // for loop to generate the cards
  for (var i=1; i<=num; i++){
    // create card div, add id and class
    var $card = $('<div>').attr('id','card'+i).addClass('card');
    // set click listener on each card
    $card.on('click',flipCard);
    // append to gameBoard div
    $board.append($card);
    // create an object in gameCards array
    var tempObj = {cardPosition:i, cardValue:''};
    gameCards.push(tempObj);

  } // end of for loop

  createGameCards();

} // end of generateQuilt

var flipCard = function(){
  var tempP = $(this).attr('id').replace('card','');
  var value = gameCards.filter(function(element){
    return element.cardPosition == tempP;
  })[0].cardValue;

  if (gameCardsClicked.filter(function(element){
    return element[0] == tempP
  }).length === 0 ) {
    var tempArr = [tempP,value];
    cardClicked.push(tempArr);
    $(this).text(value).css('background','lightgreen')
    console.log(cardClicked);
    if (cardClicked.length === 2){
      isMatch(cardClicked);
    }
  }
  if (gameCardsClicked.length === numCards) {
    console.log('Level round over, move to next level');
    level++;
  }
} // End of flipCard function

var isMatch = function(twoCards){
  if(twoCards[0][1] === twoCards[1][1]) {
    console.log('match');
    gameCardsClided = gameCardsClicked.concat(twoCards);
   console.log(gameCardsClicked);
  } else {
    console.log('no match');

  }

  cardClicked=[];
}




// evoke the function
generateBoard(numCards);
