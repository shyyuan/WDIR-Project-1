console.log('Project 1 2nd js file is connected');
// Window onloader ***********************************
$(function(){
  // Event Listener
  $('#reset2').on('click', TWOP_UI.resetBoard);
}) /// End of Window onload **************************

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Two Players UI
var TWOP_UI = {
  // 1 1 1 1 1 1 1
  initiateBoardInfo: function() {
    APP.$type = $('#cardTypeSelectForTwo option:selected').val(),
    console.log('Selected Type ' + APP.$type);

    APP.$playSize = $('#playSize option:selected').val();
    if ($('#name1').val() !== '') {
      APP.$player1Name = $('#name1').val();
    }
    if ($('#name2').val() !== '') {
      APP.$player2Name = $('#name2').val();
    }

    console.log('Player 1 name: ' + APP.$player1Name + '\nPlayer 2 name: ' + APP.$player2Name + ', play card size: ' + APP.$playSize);
    $('#s2EnterNameScreen').remove();
    $('#cardTypeText').remove();
    $('#cardTypeForTwo').show();
    $('#cardTypeSelectForTwo').show();
    $('#playSizeText').show();
    $('#playSize').show();
    $('#info').css('display','flex');
    $('#info').css('padding','0 80px');
    $('#round').text('Round: ' + APP.round + '/3');
    $('#level').text(APP.$player1Name+"'s Score: " + APP.player1Score);
    $('#chance').text(APP.$player2Name+"'s Score: " + APP.player2Score);
    $('#buttons').children().show();
    $('#buttons').children('#resetLevel').remove();
    $('#feedback').children().show();
    TWOP_UI.updateFeedbackInfo();
    TWOP_UI.createBoard();
    console.log('In Two Players Mode');
  }, // End of createBoardInfo
  // 2 2 2 2 2 2 2 2
  updateFeedbackInfo: function(){
    $('#level').text(APP.$player1Name+"'s Score: " + APP.player1Score);
    $('#chance').text(APP.$player2Name+"'s Score: " + APP.player2Score);
    if (APP.p1Turn) {
      $('#feedback h4').text(APP.$player1Name+"'s turn. Click a card.").css('color','#004466');
    } else {
      $('#feedback h4').text(APP.$player2Name+"'s turn. Click a card.").css('color','#cc7a00');
    }
  }, // end of updateFeedbackInfo
  // 3 3 3 3 3 3 3 3
  createBoard: function() {
    UI.clearCardDiv();
    APP.level = APP.$playSize/2;
    APP.numCards = Math.pow((APP.level)*2,2);
    var boardWidth = (APP.level)*2*(APP.width+5)+'px';
    var boardHeigth = (APP.level)*2*(APP.height+5)+'px';
    if (APP.level >=4) {
      $('footer').css('position','relative');
    } else {
      $('footer').css('position','absolute');
    }
    APP.$board.css({'width':boardWidth,'height':boardHeigth});
    // for loop to generate the cards
    for (var i=1; i<=APP.numCards; i++){
      // create card div, add id and class
      var $card = $('<div>').attr('id','card'+i).addClass('card');
      $card.append(APP.questionMarkImg);
      // set click listener on each card
      $card.on('click',TWOP_UI.showCard);
      // append to gameBoard div
      APP.$board.append($card);
      // create an object in gameCards array
      var tempObj = {cardPosition:i, cardValue:''};
      APP.gameCards.push(tempObj);
      //console.log('Temp Obj ' + tempObj);
      //console.log(gameCards.cardPosition);
    } // end of for loop
    TWOP_UI.assignGameCardsValue();
  }, // End of createBoard
  // 4 4 4 4 4 4 4 4
  assignGameCardsValue: function(){
    UI.createGameCards();
  }, // end of assignGameCardsValue
  // 5 5 5 5 5 5 5
  showCard: function(){
    // flip card
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
    if (clickable){
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
        $(this).css('background','green');
        $(this).append('<img src="images/fruit_veg_img/'+value+'" class="fruits">');
      }

      if (APP.cardClicked.length === 2){
        console.log('tow players, check match');
        TWOP_UI.checkMatch(APP.cardClicked);
      }
    }
  }, // End of showCard
  // 6 6 6 6 6 6 6 6
  checkMatch: function(twoCards){
    // like UI.isMatch
    // twoCards is an Array with two arrays
    console.log('In two players checkMatch block');
    if(twoCards[0][1] === twoCards[1][1]) {
      //console.log('match');
      APP.gameCardsClicked.push(twoCards[0][0]);
      APP.gameCardsClicked.push(twoCards[1][0]);

      if (APP.p1Turn) {
        APP.player1Score += 2;
      } else {
        APP.player2Score += 2;
      }
      // all cards are flipped
      if (APP.gameCardsClicked.length === APP.numCards) {
          TWOP_UI.roundUp();
      } else {
        $('#feedback h4').text('You found a match. Keep going.').css('color','green');
        setTimeout(function() {TWOP_UI.updateFeedbackInfo();},1000);
      }

    } else { // no match
      $('#feedback h4').text('Sorry, no match. Your turn is over').css('color','#b32d00');
      if (APP.p1Turn) {
        APP.p1Turn = false;
      } else {
        APP.p1Turn = true;
      }

      setTimeout(function() {flipBack();},700);
      var flipBack = function(){
        $('#card'+twoCards[0][0]).text('').css('background','yellow');
        $('#card'+twoCards[0][0]).remove('img');
        $('#card'+twoCards[0][0]).append(APP.questionMarkImg);
        $('#card'+twoCards[1][0]).text('').css('background','yellow');
        $('#card'+twoCards[1][0]).remove('img');
        $('#card'+twoCards[1][0]).append(APP.questionMarkImg);
        TWOP_UI.updateFeedbackInfo();
      }
    }
    APP.cardClicked=[];
  }, // End of checkMatch
  // 7 7 7 7 7 7 7
  resetBoard: function(){
    // set score back to origin
    // re-create board based on type and number selected
    APP.$type = $('#cardTypeSelectForTwo option:selected').val(),
    APP.$playSize = $('#playSize option:selected').val();
    APP.player1Score = APP.p1RoundStartScore;
    APP.player2Score = APP.p2RoundStartScore;

    TWOP_UI.setWhosTurn();
    UI.resetLevelVariables();
    TWOP_UI.updateFeedbackInfo();
    TWOP_UI.createBoard();

  }, // End of resetBoard
  // 8 8 8 8 8 8
  roundUp: function(){
    if (APP.round === 3) {
      TWOP_UI.checkWinner();
    } else {
      $('#feedback h4').text('Round over. Move to next round.').css('color','blue');
      APP.round++;
      APP.p1RoundStartScore = APP.player1Score;
      APP.p2RoundStartScore = APP.player2Score;
      TWOP_UI.setWhosTurn();
      $('#round').text('Round: ' + APP.round + '/3');
      UI.resetLevelVariables();

      setTimeout(function() {
        TWOP_UI.updateFeedbackInfo();
        TWOP_UI.createBoard();
      },1000);
    }
  }, // End of roundUp
  // 9 9 9 9 9 9 9
  setWhosTurn: function(){
    // set who's turn
    if (APP.round === 1){
      APP.p1Turn = true;
    } else if (APP.round === 2){
      APP.p1Turn = false;
    } else {
      if (APP.p1RoundStartScore > APP.p2RoundStartScore){
        APP.p1Turn = true;
      } else {
        APP.p1Turn = false;
      }
    }
  }, // End of setWhosTurn
  // 10 10 10 10 10 10
  checkWinner: function() {
    UI.clearCardDiv();
    if (APP.player1Score === APP.player2Score) {
      $('#feedback h4').text('It is a tied game. Thank you for playing').css('color','blue');
      APP.$board.append(APP.handshake);
    } else {
      if (APP.player1Score > APP.player2Score) {
        $('#feedback h4').text(APP.player1Name + 'won the game!').css('color','blue');
      } else {
        $('#feedback h4').text(APP.player2Name + 'won the game!').css('color','blue');
      }
      APP.$board.append(APP.champion);
    }
    $('footer').css('position', 'absolute');
    $('footer').css('bottom','0');
  } // End of checkWinner

} // End of Two Players UI
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
