console.log('Project 1 js file is connected');
// window onloader
$(function(){
  console.log('Inside window onload');

}) /// End of Window onload

// Global Varibales
var level = 0;
var live = level+2;
var numCards = Math.pow((level+1)*2,2);
var $board = $('#gameBoard');
var width = 80;
var height = 80;
var playerScore = 0;
var gameCards = [];

// function to generate random whole numbner between max and min
// Math.floor(Math.random * (max-min+1)) + min
var generateNum = function(max,min){
   return Math.floor(Math.random()* (max-min+1)) + min;
} // end of generateNum

//function to create the cards in player
var createGameCards = function(){
  var tempCards = [];
  for(var i=1; i<=numCards/2; i++){
    var num = generateNum(99,0);
    if (tempCards.indexOf(num) < 0) {
      tempCards.push(num);
    } else {
      i--;
    }
  }
  tempCards = tempCards.concat(tempCards);
  console.log(tempCards);

  var tempCardsPosition = [];
  for(var i=1; i<=numCards; i++){
    var num = generateNum(numCards,1);
    if (tempCardsPosition.indexOf(num) < 0) {
      tempCardsPosition.push(num);
    } else {
      i--;
    }
  }
  console.log(tempCardsPosition);
  for (var i=0; i<tempCardsPosition.length; i++){
    var arr = gameCards.filter(function(element){
        return element.cardPosition == tempCardsPosition[i];
    })[0].cardValue=tempCards[i];
    //console.log(arr);
  }
  console.log(gameCards);
}





// generateBoard function
var generateBoard = function(num){
  // set board width and heigh based on number of cards
  var boardWidth = (level+1)*2*(width+5)+'px';
  var boardHeigth = (level+1)*2*(height+5)+'px';
  $board.css({'width':boardWidth,'height':boardHeigth});
  // for loop to generate the cards
  for (var i=1; i<=num; i++){
    // create card div, add id and class
    var $card = $('<div>').attr('id','card'+i).addClass('card').text(i);
    // set click listener on each card
    $card.on('click',flipCard);
    // append to gameBoard div
    $board.append($card);
    // create an object in gameCards array
    var tempObj = {cardPosition:i, cardValue:''};
    gameCards.push(tempObj);

  } // end of for loop
  console.log(gameCards);
  createGameCards();

} // end of generateQuilt

var flipCard = function(){
  console.log('card clicked');
  $(this).css('background','lightgreen')
}


// evoke the function
generateBoard(numCards);
