console.log('Project 1 js file is connected');
// Window onloader ***********************************
$(function(){
  // Event Listener
  $('#go').on('click', UI.setPlayer);
  $('#cardTypeSelect').on('change', APP.setType);
  $('#resetLevel').on('click', UI.resetLevel);
  $('#resetGame').on('click', UI.resetGame);

}) /// End of Window onload **************************

//====================================================
// App data and Global Varibales
var APP = {
  level: 1,
  live: 0, //this.level+2,
  liveLeft: 0,
  numCards: 0, //Math.pow((this.level+1)*2,2);,
  $board: $('#gameBoard'),
  $type: 'number', // default
  width: 80,
  height: 80,
  playerScore: 0,
  questionMarkImg: '<img src="images/question_mark.png" class="questionMark">',
  smileImg: '<img src="images/smile.png" class="smile">',
  maintain: '<img src="images/maintain.jpg" class="maintain">',
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
    APP.$type = $('#cardTypeSelect option:selected').val(),
    console.log('Selected Type ' + APP.$type);
    UI.resetLevelVariables();
    UI.clearCardDiv();
    UI.generateBoard();
  }
} // End of
// =======================================================

// *******************************************************
// UI object, put all functions that affect the DOM
var UI = {
  // 0 0 0 0 0 0
  startGame: function() {
    // hide some elements
    $('#cardTypeText').hide();
    $('#cardTypeSelect').hide();
    $('#buttons').children().hide();
    $('#info').css('display','inline-block');
    $('#feedback').children().hide();
  },
  // 1 1 1 1 1 1
  setPlayer: function(){
    $player = $('input[name=player]:checked').val();
    console.log('How many player? ' + $player);
    $('#welcome').remove();
    $('#players').text('');
    $('#players').children('input').remove();
    $('#go').remove();

    $('#cardTypeText').show();
    $('#cardTypeSelect').show();
    $('#buttons').children().show();
    $('#info').css('display','flex');
    $('#info').css('padding','0 80px');
    $('#feedback').children().show();
    if ($player == 1) {
      console.log('one players ' + $player);

      UI.generateBoard();
    } else if ($player == 2) {
      console.log('two players ' +$player);
      $('#cardTypeText').hide();
      $('#cardTypeSelect').hide();
      $('#buttons').children('#resetLevel').hide();
      UI.underConstruction();
    } else if ($player == 'C') {
      console.log('again computer ' +$player);
      $('#cardTypeText').hide();
      $('#cardTypeSelect').hide();
      $('#buttons').children('#resetLevel').hide();
      UI.underConstruction();
    }
  },

  // 2 2 2 2 2 2
  clearCardDiv: function() {
    APP.$board.children('').remove();
  },
  // 3 3 3 3 3 3
  // generateBoard funrction
  generateBoard: function(){
    UI.clearCardDiv();
    console.log('Level = ' + APP.level );
    APP.live = (APP.level)*2 + APP.liveLeft;
    APP.numCards = Math.pow((APP.level)*2,2);
    //console.log(numCards);
    // set board width and heigh based on number of cards
    var boardWidth = (APP.level)*2*(APP.width+5)+'px';
    var boardHeigth = (APP.level)*2*(APP.height+5)+'px';
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
    $('#level').text('Level: ' + APP.level);
    $('#chance').text('Lives: ');
    // for (var i=1; i<=APP.live; i++) {
    //   $('#chance').append(APP.smileImg);
    // }
    UI.updateSmileFace();
    $('#feedback h4').text('Click a card to start').css('color','black');
    UI.createGameCards();
  }, // end of generateQuilt
  // 4 4 4 4 4 4
  //function to create the cards in player
  createGameCards: function(){
    // generate random, no repeat numbers (0-99) and put into a temp array.  The number of the number set is half the cards.
    // if 4 Cards on the board, generate 2 numbers
    // if 100 cards on the board, generate 50 numbers
    var tempCards = [];
    // loop go generate cards
    for (var i=1; i<=APP.numCards/2; i++){
      if (APP.$type === 'number') {
        var num = APP.generateNum(99,0);
      } else {
        var num = APP.generateNum(50,1);
      }
      // if this number has not show up yet, put into tempCards array
      if (tempCards.indexOf(num) < 0) {
        tempCards.push(num);
      } else {
        // if this number is in tempCards array, go back and run again.
        i--;
      }
    } // end of loop
    // duplicate the number set and put together
    tempCards = tempCards.concat(tempCards);
    console.log('card dealed: ' + tempCards)
    // generate random distribute position set
    var tempCardsPosition = [];
    for (var i=1; i<=APP.numCards; i++){
      var num = APP.generateNum(APP.numCards,1);
      if (tempCardsPosition.indexOf(num) < 0) {
        tempCardsPosition.push(num);
      } else {
        i--;
      }
    }
    console.log('Postions ' + tempCardsPosition);
    // distribute the into gameCards
    for (var i=0; i<APP.gameCards.length; i++){
      var ind = tempCardsPosition.indexOf(APP.gameCards[i].cardPosition);

      if (APP.$type === 'number') {
        APP.gameCards[i].cardValue = tempCards[ind];
      } else {
        var seq = tempCards[ind];
        if (APP.$type === 'card') {
          APP.gameCards[i].cardValue = DATA.cards.filter(function(element){
            return element.seq === seq;
          })[0].img;
        } else if (APP.$type === 'fruit') {
          APP.gameCards[i].cardValue = DATA.fruit.filter(function(element){
            return element.seq === seq;
          })[0].img;
        }
      }
    } // end of for loop
      console.log(APP.gameCards);
  }, // end of createGameCards
  // 5 5 5 5 5 5
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
        if (APP.$type === 'number') {
          $(this).text(value).css('background','lightgreen')
          //console.log('Card clicked '+cardClicked);
        } else if (APP.$type === 'card') {
          $(this).children('.questionMark').remove();
          $(this).css('background','green');
          $(this).append('<img src="images/cards/'+value+'" class="cards">');
        } else if (APP.$type === 'fruit') {
          $(this).children('.questionMark').remove();
          $(this).css('background','green');
          $(this).append('<img src="images/fruit_veg_img/'+value+'" class="fruits">');
        }

        if (APP.cardClicked.length === 2){
          UI.isMatch(APP.cardClicked);
        }
      }
    }
  }, // End of flipCard function
  // 6 6 6 6 6 6 6
  isMatch: function(twoCards){
    // twoCards is an Array with two arrays
    if(twoCards[0][1] === twoCards[1][1]) {
      //console.log('match');
      APP.gameCardsClicked.push(twoCards[0][0]);
      APP.gameCardsClicked.push(twoCards[1][0]);
      //console.log('Stay flipped cards: ' + APP.gameCardsClicked );
      //console.log(APP.live);
      APP.live++;
      //console.log(APP.live);
      UI.updateSmileFace();
      $('#feedback h4').text('You found a match.').css('color','green');
      if (APP.gameCardsClicked.length === APP.numCards) {
        //console.log('Level completed, move to next level');
        APP.liveLeft = APP.live;
        setTimeout(function() {UI.levelUp();},1000);
      } else {
        setTimeout(function() {updateFeedback();}, 700);
        var updateFeedback = function() {
          $('#feedback h4').text('Click a card').css('color','black');
        }
      }
    } else {
      //console.log('no match');
      $('#feedback h4').text('Sorry, try again.').css('color','red');

      setTimeout(function() {flipBack();},700);
      var flipBack = function(){
        //console.log('flip back');
        //console.log(APP.live);
        APP.live--;
        //console.log(APP.live);
        UI.updateSmileFace();

        $('#card'+twoCards[0][0]).text('').css('background','yellow');
        $('#card'+twoCards[0][0]).remove('img');
        $('#card'+twoCards[0][0]).append(APP.questionMarkImg);
        $('#card'+twoCards[1][0]).text('').css('background','yellow');
        $('#card'+twoCards[1][0]).remove('img');
        $('#card'+twoCards[1][0]).append(APP.questionMarkImg);
        if (APP.live !== 0){
          $('#feedback h4').text('Click a card').css('color','black');
        } else {
          UI.clearCardDiv();
          $('#feedback h4').text('Game over. Thank you for playing.').css('color','red');
        }
      }
    }
    //clearTimeout(delayTime);
    APP.cardClicked=[];
  }, // end of isMatch checking
  // 7 7 7 7 7 7
  // reset level round
  resetLevelVariables: function(){
    APP.gameCards = [];
    APP.gameCardsClicked = [];
    APP.cardClicked = [];
    //$('#gameBoard div').text('').css('background','yellow');
    //$('#gameBoard div').append(APP.img);
  },
  // 8 8 8 8 8 8 8
  // move one level up
  levelUp: function(){
    if (APP.level === 5) {
      $('#feedback h4').text('Congratulations, you have reach the highest level of the game. Than you for playing').css('color','black');
    } else {
      $('#feedback h4').text('Level completed. Move to next level.').css('color','black');
      setTimeout(function() {toNextLevel();},1000);
      var toNextLevel = function(){
        UI.resetLevelVariables();
        //UI.clearCardDiv();
        APP.level++;
        UI.generateBoard();
      }
    }
  },
  // 9 9 9 9 9 9 9
  updateSmileFace: function(){
    console.log('Live = ' +APP.live);
    $('#chance').children('img').remove();
    for (var i=1; i<=APP.live; i++) {
      $('#chance').append(APP.smileImg);
    }
  },
  // 10 10 10 10 10 10
  resetLevel: function(){
    console.log('In resetLevel, level = ' + APP.level);
    UI.resetLevelVariables();
    //UI.clearCardDiv();
    //APP.live = 0;
    UI.generateBoard();
  },
  // 11 11 11 11 11 11
  resetGame: function(){
    APP.level = 1;
    UI.resetLevelVariables();
    location.reload();
  },
  underConstruction: function(){
    UI.clearCardDiv();
    APP.$board.append(APP.maintain);
  }


} // end of UI Object
// ********************************************************

// ========================================================
var DATA = {
  fruit: [
    {seq:1, img:'apple.jpg'}, {seq:2, img:'apricot.jpg'},
    {seq:3, img:'asparagus.jpg'}, {seq:4, img:'avocado.jpg'},
    {seq:5, img:'banana.jpg'}, {seq:6, img:'beetroot.jpg'},
    {seq:7, img:'bellpepper.jpg'}, {seq:8, img:'blackberry.jpg'},
    {seq:9, img:'blackcurrant.jpg'}, {seq:10, img:'blueberry.jpg'},
    {seq:11, img:'broccoli.jpg'}, {seq:12, img:'brusselssprout.jpg'},
    {seq:13, img:'cabbage.jpg'}, {seq:14, img:'carrot.jpg'},
    {seq:15, img:'cauliflower.jpg'}, {seq:16, img:'celery.jpg'},
    {seq:17, img:'cherry.jpg'}, {seq:18, img:'coconut.jpg'},
    {seq:19, img:'corn.jpg'}, {seq:20, img:'cucumber.jpg'},
    {seq:21, img:'eggplant.jpg'}, {seq:22, img:'fig.jpg'},
    {seq:23, img:'grape.jpg'}, {seq:24, img:'greenbean.jpg'},
    {seq:25, img:'kiwi.jpg'}, {seq:26, img:'lemon.jpg'},
    {seq:27, img:'lettuce.jpg'}, {seq:28, img:'lime.jpg'},
    {seq:29, img:'lychee.jpg'}, {seq:30, img:'mongo.jpg'},
    {seq:31, img:'mushroom.jpg'}, {seq:32, img:'nectarine.jpg'},
    {seq:33, img:'onion.jpg'}, {seq:34, img:'orange.jpg'},
    {seq:35, img:'papaya.jpg'}, {seq:36, img:'passionfruit.jpg'},
    {seq:37, img:'pea.jpg'}, {seq:38, img:'peach.jpg'},
    {seq:39, img:'pear.jpg'}, {seq:40, img:'pineapple.jpg'},
    {seq:41, img:'plum.jpg'}, {seq:42, img:'potato.jpg'},
    {seq:43, img:'quince.jpg'}, {seq:44, img:'radish.jpg'},
    {seq:45, img:'raspberry.jpg'}, {seq:46, img:'strawberry.jpg'},
    {seq:47, img:'sweetpotato.jpg'}, {seq:48, img:'tomato.jpg'},
    {seq:49, img:'watermelon.jpg'}, {seq:50, img:'zucchini.jpg'}
  ],
  cards: [
    {seq:1, img:'clubs-1.jpg'}, {seq:2, img:'clubs-3.jpg'},
    {seq:3, img:'clubs-4.jpg'}, {seq:4, img:'clubs-5.jpg'},
    {seq:5, img:'clubs-6.jpg'}, {seq:6, img:'clubs-7.jpg'},
    {seq:7, img:'clubs-8.jpg'}, {seq:8, img:'clubs-9.jpg'},
    {seq:9, img:'clubs-10.jpg'}, {seq:10, img:'clubs-11.jpg'}, {seq:11, img:'clubs-12.jpg'}, {seq:12, img:'clubs-13.jpg'},
    {seq:13, img:'diamond-1.jpg'}, {seq:14, img:'diamond-2.jpg'},
    {seq:15, img:'diamond-3.jpg'}, {seq:16, img:'diamond-4.jpg'},
    {seq:17, img:'diamond-5.jpg'}, {seq:18, img:'diamond-6.jpg'},
    {seq:19, img:'diamond-7.jpg'}, {seq:20, img:'diamond-8.jpg'},
    {seq:21, img:'diamond-9.jpg'}, {seq:22, img:'diamond-10.jpg'},
    {seq:23, img:'diamond-11.jpg'}, {seq:24, img:'diamond-12.jpg'},
    {seq:25, img:'diamond-13.jpg'}, {seq:26, img:'heart-1.jpg'},
    {seq:27, img:'heart-2.jpg'}, {seq:28, img:'heart-3.jpg'},
    {seq:29, img:'heart-4.jpg'}, {seq:30, img:'heart-5.jpg'},
    {seq:31, img:'heart-6.jpg'}, {seq:32, img:'heart-7.jpg'},
    {seq:33, img:'heart-8.jpg'}, {seq:34, img:'heart-9.jpg'},
    {seq:35, img:'heart-10.jpg'}, {seq:36, img:'heart-11.jpg'},
    {seq:37, img:'heart-12.jpg'}, {seq:38, img:'heart-13.jpg'},
    {seq:39, img:'spade-1.jpg'}, {seq:40, img:'spade-3.jpg'},
    {seq:41, img:'spade-4.jpg'}, {seq:42, img:'spade-5.jpg'},
    {seq:43, img:'spade-6.jpg'}, {seq:44, img:'spade-7.jpg'},
    {seq:45, img:'spade-8.jpg'}, {seq:46, img:'spade-9.jpg'},
    {seq:47, img:'spade-10.jpg'}, {seq:48, img:'spade-11.jpg'}, {seq:49, img:'spade-12.jpg'}, {seq:50, img:'sapde-13.jpg'},
  ]
}
// ========================================================



// evoke the function
UI.startGame();
