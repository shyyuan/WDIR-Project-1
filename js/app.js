console.log('Project 1 js file is connected');
// window onloader
$(function(){
  //console.log('Inside window onload');

}) /// End of Window onload

// Global Varibales
var level = 0;
var live = level+2;
var numCards = 0;
var $board = $('#gameBoard');
var width = 80;
var height = 80;
var playerScore = 0;

// per round variables
var gameCards = []; // An array to store object {cardPosition, cardValue}
var gameCardsClicked = []; // An array to store cardPostion number
var cardClicked = []; // Array to store the array [position,value] of the two picked card value

var resetLevel = function(){
  gameCards = [];
  gameCardsClicked = [];
  cardClicked = [];
  $('#gameBoard div').text('').css('background','yellow');
}

var levelUp = function(){
  resetLevel();
  $('#gameBoard').children('div').remove();
  level++;
  generateBoard(level);
}



// function to generate random whole numbner between max and min
// Math.floor(Math.random * (max-min+1)) + min
var generateNum = function(max,min){
   return Math.floor(Math.random()* (max-min+1)) + min;
} // end of generateNum

//function to create the cards in player
var createGameCards = function(numCards){
  // generate random, no repeat numbers (0-99) and put into a temp array.  The number of the number set is half the cards.
  // if 4 Cards on the board, generate 2 numbers
  // if 100 cards on teh board, generate 50 numbers
  var tempCards = [];
  for (var i=1; i<=numCards/2; i++){
    var num = generateNum(99,0);
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
    var num = generateNum(numCards,1);
    if (tempCardsPosition.indexOf(num) < 0) {
      tempCardsPosition.push(num);
    } else {
      i--;
    }
  }
  //console.log('Postions ' + tempCardsPosition);
  // distribute the into gameCards
  for (var i=0; i<gameCards.length; i++){
    var ind = tempCardsPosition.indexOf(gameCards[i].cardPosition);
  //  console.log('Index ' + ind);
    gameCards[i].cardValue = tempCards[ind];
  }
  //console.log(gameCards);
} // end of createGameCards

// generateBoard function
var generateBoard = function(level){
  console.log(level);
  numCards = Math.pow((level+1)*2,2);
  console.log(numCards);
  // set board width and heigh based on number of cards
  var boardWidth = (level+1)*2*(width+5)+'px';
  var boardHeigth = (level+1)*2*(height+5)+'px';
  $board.css({'width':boardWidth,'height':boardHeigth});
  // for loop to generate the cards
  for (var i=1; i<=numCards; i++){
    // create card div, add id and class
    var $card = $('<div>').attr('id','card'+i).addClass('card');
    // set click listener on each card
    $card.on('click',flipCard);
    // append to gameBoard div
    $board.append($card);
    // create an object in gameCards array
    var tempObj = {cardPosition:i, cardValue:''};
    gameCards.push(tempObj);

    //console.log('Temp Obj ' + tempObj);
    //console.log(gameCards.cardPosition);
  } // end of for loop

  //console.log('game cards ' + gameCards);

  createGameCards(numCards);

} // end of generateQuilt

var flipCard = function(){

  $('#feedback h4').text('Click another card');

  var tempP = $(this).attr('id').replace('card','');
  var value = gameCards.filter(function(element){
    return element.cardPosition == tempP;
  })[0].cardValue;

  if (gameCardsClicked.filter(function(element){
     return element == tempP
   }).length === 0 ) {

     var tempArr = [tempP,value];
     cardClicked.push(tempArr);
     $(this).text(value).css('background','lightgreen')
     //console.log('Card clicked '+cardClicked);
     if (cardClicked.length === 2){
       isMatch(cardClicked);
     }
  }

} // End of flipCard function

var isMatch = function(twoCards){
  // twoCards is an Array with two arrays
  if(twoCards[0][1] === twoCards[1][1]) {
    console.log('match');
    gameCardsClicked.push(twoCards[0][0]);
    gameCardsClicked.push(twoCards[1][0]);
    console.log('Stay flipped cards: ' +gameCardsClicked);

   $('#feedback h4').text('You found a match.');
   if (gameCardsClicked.length === numCards) {
     console.log('Level round over, move to next level');

     levelUp();

   }

  } else {
    console.log('no match');
    $('#feedback h4').text('Sorry, try again.');

    setTimeout(function() {flipBack();},800);
    var flipBack = function(){
      console.log('flip back');
      $('#card'+twoCards[0][0]).text('').css('background','yellow');
      $('#card'+twoCards[1][0]).text('').css('background','yellow');
    }
  }
  //clearTimeout(delayTime);
  cardClicked=[];
}




// evoke the function
generateBoard(level);
