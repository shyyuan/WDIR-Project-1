console.log('Project 1 js file is connected');
// window onloader
$(function(){
  console.log('Inside window onload');

}) /// End of Window onload

var level = 1;
var live = 2;
var numCards = Math.pow(level*2,2);
var $board = $('#gameBoard');


var generateBoard = function(num){
  // set board width and heigh based on number of cards
  var boardWidth = level*2*85+'px';
  var boardHeigth = level*2*115+'px';

  $board.css({'width':boardWidth,'height':boardHeigth});


  for (var i=1; i<=num; i++){
    //console.log('inside loop ' + i);
    // create card div, add id and class
    var $card = $('<div>').attr('id','card'+i).addClass('card').text(i);
    console.log($card);
    // append to gameBoard div
    $board.append($card);

  } // end of for loop


} // end of generateQuilt

generateBoard(numCards);
