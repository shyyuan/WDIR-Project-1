console.log('Project 1 js file is connected');
// Window onloader ***********************************
$(function(){
  // Event Listener
  $('#go').on('click', UI.setPlayer);
  $('#play').on('click', UI.twoPlayersGame);
  $('#cardTypeSelect').on('change', UI.setType);
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
  $player1Name: '',
  $player2Name: '',
  player1Score: 0,
  player2Score: 0,
  questionMarkImg: '<img src="images/question_mark.png" class="questionMark">',
  smileImg: '<img src="images/smile.png" class="smile">',
  champion: '<img src="images/won.jpeg" class="champion">',
  // per round variables
  gameCards: [], // An array to store object {cardPosition, cardValue}
  gameCardsClicked:[], // An array to store cardPostion number
  cardClicked:[], // Array to store the array [position,value] of the two picked card value
  // function to generate random whole numbner between max and min
  // Math.floor(Math.random * (max-min+1)) + min
  generateNum: function(max,min){
    return Math.floor(Math.random()* (max-min+1)) + min;
  } // end of generateNum
} // End of APP Object
// =======================================================

// *******************************************************
// UI object, put all functions that affect the DOM
var UI = {
  // 1 1 1 1 1 1 1
  startGame: function() {
    //UI.hideGameBoardElements();
    // hide some elements
    $('#s2EnterNameScreen').children().hide();
    $('#cardTypeText').hide();
    $('#cardTypeSelect').hide();
    $('#buttons').children().hide();
    $('#info').css('display','inline-block');
    $('#feedback').children().hide();
  },
  // 2 2 2 2 2 2 2
  setPlayer: function(){
    $player = $('input[name=player]:checked').val();
    console.log('How many player? ' + $player);

    if ($player == 1) {
      console.log('one players ' + $player);
      $('#s1SelectPlayerScreen').remove();
      $('#s2EnterNameScreen').remove();
      // $('#welcome').remove();
      // $('#players').text('');
      // $('#players').children('input').remove();
      // $('#go').remove();

      $('#cardTypeText').show();
      $('#cardTypeSelect').show();
      $('#buttons').children().show();
      $('#info').css('display','flex');
      $('#info').css('padding','0 80px');
      $('#feedback').children().show();
      UI.generateBoard();
    } else if ($player == 2) {
      console.log('two players ' +$player);
      $('#s1SelectPlayerScreen').remove();
      //$('#s2EnterNameScreen').show();
      $('#s2EnterNameScreen').children().show();
      // $('#welcome').text('Enter Names');
      // $('#players').text('');
      // $('#players').children('input').remove();
      // $('#go').attr('id','play');
      // $('#players').html("Player 1: <input type='text' id='name1' placeholder='enter name'>&nbsp;&nbsp; Player 2: <input type='text' id='name2' placeholder='enter name'>");
      // $('#play').on('click', UI.twoPlayersGame);

    } else if ($player == 'C') {
      console.log('again computer ' +$player);
      $('#s1SelectPlayerScreen').remove();
      $('#s2EnterNameScreen').remove();
      $('form').children().remove();
      //$('#players').text('');
      //$('#players').children('input').remove();
      $('#go').remove();
      $('#play').remove();
      //$('#info').css('display','flex');
      $('#buttons').children().show();
      //$('#cardTypeText').hide();
    //  $('#cardTypeSelect').hide();
      $('#buttons').children('#resetLevel').hide();
      UI.underConstruction();
    }
  },
  // 3 3 3 3 3 3 3 3
  // Card Type: number, card, fruit-and-vegi
  setType: function(){
    APP.$type = $('#cardTypeSelect option:selected').val(),
    console.log('Selected Type ' + APP.$type);
    UI.resetLevelVariables();
    UI.clearCardDiv();
    UI.generateBoard();
  },
  // 4 4 4 4 4 4 4
  clearCardDiv: function() {
    APP.$board.children('').remove();
  },
  // 5 5 5 5 5 5 5
  // generateBoard funrction
  generateBoard: function(){
    $('#feedback').children('img').remove();
    UI.clearCardDiv();
    console.log('Level = ' + APP.level );
    APP.live = (APP.level)*2 + APP.liveLeft;
    if (APP.live > 25) {
      APP.live =  25;
    }
    APP.numCards = Math.pow((APP.level)*2,2);
    //console.log(numCards);
    // set board width and heigh based on number of cards
    var boardWidth = (APP.level)*2*(APP.width+5)+'px';
    var boardHeigth = ((APP.level)*2*(APP.height+5)+60)+'px';
    if (APP.level >=4) {
      $('footer').css('position','relative')
    }

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
    //$('#chance').text('Lives: ');
    // for (var i=1; i<=APP.live; i++) {
    //   $('#chance').append(APP.smileImg);
    // }
    UI.updateSmileFace();
    $('#feedback h4').text('Click a card to start').css('color','black');
    UI.createGameCards();
  }, // end of generateQuilt
  // 6 6 6 6 6 6 6
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
  // 7 7 7 7 7 7 7
  // flip the card that clicked
  flipCard: function(){
    var clickable = false;
    var tempP = $(this).attr('id').replace('card','');
    var value = APP.gameCards.filter(function(element){
      return element.cardPosition == tempP;
    })[0].cardValue;

    if (// cannot click the already flipped cards
        APP.gameCardsClicked.filter(function(element){
          return element == tempP
        }).length === 0
        && // cannot click on the same card
        APP.cardClicked.filter(function(element){
          return element[0] === tempP;
        }).length === 0
       ) {
         clickable = true;
    }

    console.log('clickable = ' +clickable);
    if (APP.live !== 0 && clickable){
      $('#feedback h4').text('Click another card').css('color','black');

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
        $(this).css('background','green');            $(this).append('<img src="images/fruit_veg_img/'+value+'" class="fruits">');
      }

      if (APP.cardClicked.length === 2){
        UI.isMatch(APP.cardClicked);
      }
    }
  }, // End of flipCard function
  // 8 8 8 8 8 8 8
  // check if two flipped cards are match
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
          // no live, no smile face
          APP.leve = 1;
          APP.liveLeft = 0;
          UI.clearCardDiv();
          $('#feedback h4').text('Game over. Thank you for playing.').css('color','red');
          $('#feedback').append('<img src="images/crying.png">');
        }
      }
    }
    //clearTimeout(delayTime);
    APP.cardClicked=[];
  }, // end of isMatch checking
  // 9 9 9 9 9 9 9
  // reset level round
  resetLevelVariables: function(){
    APP.gameCards = [];
    APP.gameCardsClicked = [];
    APP.cardClicked = [];
    //$('#gameBoard div').text('').css('background','yellow');
    //$('#gameBoard div').append(APP.img);
  },
  // 10 10 10 10 10 10 10
  // move one level up
  levelUp: function(){
    if (APP.level === 5) {
      UI.clearCardDiv();
      APP.live = 0;
      APP.liveLeft = 0;
      $('#feedback h4').text('Congratulations, you have reached the highest level of the game. Thank you for playing').css('color','blue');
      $('#feedback').append(APP.champion);
    } else {
      $('#feedback h4').text('Level completed. Move to next level.').css('color','blue');
      setTimeout(function() {toNextLevel();},1000);
      var toNextLevel = function(){
        UI.resetLevelVariables();
        //UI.clearCardDiv();
        APP.level++;
        UI.generateBoard();
      }
    }
  },
  // 11 11 11 11 11 11 11
  updateSmileFace: function(){
    console.log('Live = ' +APP.live);
    $('#chance').children().remove();
    $('#chance').text('Lives: ');
    var noShow = 0;
    var numSmile = APP.live;
    if (APP.live > 10) {
      noShow = APP.live -10;
      numSmile = 10;
    }
    for (var i=1; i<=numSmile; i++) {
      $('#chance').append(APP.smileImg);
    }
    if (noShow !== 0) {
      var tempHtml = '';
      tempHtml = '</h3><h3>+'+ noShow;
      $('#chance').append(tempHtml);
    }
  },
  // 12 12 12 12 12 12 12
  resetLevel: function(){
    console.log('In resetLevel, level = ' + APP.level);
    $('#feedback').children('img').remove();
    APP.liveLeft = APP.live;
    UI.resetLevelVariables();
    //UI.clearCardDiv();
    //APP.live = 0;
    UI.generateBoard();
  },
  // 13 13 13 13 13 13 13
  resetGame: function(){
    APP.level = 1;
    UI.resetLevelVariables();
    location.reload();
  },
  // 14 14 14 14 14 14 14
  underConstruction: function(){
    // UI.clearCardDiv();
    APP.$board.html('<br/>').append('<img src="images/maintain.JPG" class="maintain">');
  },
  // 15 15 15 15 15 15 15
  twoPlayersGame: function() {
    $('#play').remove();
    $('#buttons').children().show();
    $('#buttons').children('#resetLevel').hide();
    APP.$player1Name = $('#name1').val();
    APP.$player2Name = $('#name2').val();
    console.log('Player 1 name: ' + APP.$player1Name + '\nPlayer 2 name: ' + APP.$player2Name);
    APP.$board.html('<br/>').append('<img src="images/maintain.jpg" class="maintain">');
  }
} // end of UI Object
// ********************************************************

// ========================================================
var DATA = {
  fruit: [
    {seq:1, img:'apple.JPG'}, {seq:2, img:'apricot.JPG'},
    {seq:3, img:'asparagus.JPG'}, {seq:4, img:'avocado.JPG'},
    {seq:5, img:'banana.JPG'}, {seq:6, img:'beetroot.JPG'},
    {seq:7, img:'bellpepper.JPG'}, {seq:8, img:'blackberry.JPG'},
    {seq:9, img:'blackcurrant.JPG'}, {seq:10, img:'blueberry.JPG'},
    {seq:11, img:'broccoli.JPG'}, {seq:12, img:'brusselssprout.JPG'},
    {seq:13, img:'cabbage.JPG'}, {seq:14, img:'carrot.JPG'},
    {seq:15, img:'cauliflower.JPG'}, {seq:16, img:'celery.JPG'},
    {seq:17, img:'cherry.JPG'}, {seq:18, img:'coconut.JPG'},
    {seq:19, img:'corn.JPG'}, {seq:20, img:'cucumber.JPG'},
    {seq:21, img:'eggplant.JPG'}, {seq:22, img:'fig.JPG'},
    {seq:23, img:'grape.JPG'}, {seq:24, img:'greenbean.JPG'},
    {seq:25, img:'kiwi.JPG'}, {seq:26, img:'lemon.JPG'},
    {seq:27, img:'lettuce.JPG'}, {seq:28, img:'lime.JPG'},
    {seq:29, img:'lychee.JPG'}, {seq:30, img:'mango.JPG'},
    {seq:31, img:'mushroom.JPG'}, {seq:32, img:'nectarine.JPG'},
    {seq:33, img:'onion.JPG'}, {seq:34, img:'orange.JPG'},
    {seq:35, img:'papaya.JPG'}, {seq:36, img:'passionfruit.JPG'},
    {seq:37, img:'pea.JPG'}, {seq:38, img:'peach.JPG'},
    {seq:39, img:'pear.JPG'}, {seq:40, img:'pineapple.JPG'},
    {seq:41, img:'plum.JPG'}, {seq:42, img:'potato.JPG'},
    {seq:43, img:'quince.JPG'}, {seq:44, img:'radish.JPG'},
    {seq:45, img:'raspberry.JPG'}, {seq:46, img:'strawberry.JPG'},
    {seq:47, img:'sweetpotato.JPG'}, {seq:48, img:'tomato.JPG'},
    {seq:49, img:'watermelon.JPG'}, {seq:50, img:'zucchini.JPG'}
  ],
  cards: [
    {seq:1, img:'clubs-1.JPG'}, {seq:2, img:'clubs-3.JPG'},
    {seq:3, img:'clubs-4.JPG'}, {seq:4, img:'clubs-5.JPG'},
    {seq:5, img:'clubs-6.JPG'}, {seq:6, img:'clubs-7.JPG'},
    {seq:7, img:'clubs-8.JPG'}, {seq:8, img:'clubs-9.JPG'},
    {seq:9, img:'clubs-10.JPG'}, {seq:10, img:'clubs-11.JPG'}, {seq:11, img:'clubs-12.JPG'}, {seq:12, img:'clubs-13.JPG'},
    {seq:13, img:'diamond-1.JPG'}, {seq:14, img:'diamond-2.JPG'},
    {seq:15, img:'diamond-3.JPG'}, {seq:16, img:'diamond-4.JPG'},
    {seq:17, img:'diamond-5.JPG'}, {seq:18, img:'diamond-6.JPG'},
    {seq:19, img:'diamond-7.JPG'}, {seq:20, img:'diamond-8.JPG'},
    {seq:21, img:'diamond-9.JPG'}, {seq:22, img:'diamond-10.JPG'},
    {seq:23, img:'diamond-11.JPG'}, {seq:24, img:'diamond-12.JPG'},
    {seq:25, img:'diamond-13.JPG'}, {seq:26, img:'heart-1.JPG'},
    {seq:27, img:'heart-2.JPG'}, {seq:28, img:'heart-3.JPG'},
    {seq:29, img:'heart-4.JPG'}, {seq:30, img:'heart-5.JPG'},
    {seq:31, img:'heart-6.JPG'}, {seq:32, img:'heart-7.JPG'},
    {seq:33, img:'heart-8.JPG'}, {seq:34, img:'heart-9.JPG'},
    {seq:35, img:'heart-10.JPG'}, {seq:36, img:'heart-11.JPG'},
    {seq:37, img:'heart-12.JPG'}, {seq:38, img:'heart-13.JPG'},
    {seq:39, img:'spade-1.JPG'}, {seq:40, img:'spade-3.JPG'},
    {seq:41, img:'spade-4.JPG'}, {seq:42, img:'spade-5.JPG'},
    {seq:43, img:'spade-6.JPG'}, {seq:44, img:'spade-7.JPG'},
    {seq:45, img:'spade-8.JPG'}, {seq:46, img:'spade-9.JPG'},
    {seq:47, img:'spade-10.JPG'}, {seq:48, img:'spade-11.JPG'}, {seq:49, img:'spade-12.JPG'}, {seq:50, img:'spade-13.JPG'},
  ]
}
// ========================================================



// evoke the function
UI.startGame();
