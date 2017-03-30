console.log('Project 1 2nd js file is connected');
// Window onloader ***********************************
$(function(){
  // Event Listener
  $('#reset2').on('click', TWOP_UI.resetBoard);
}) /// End of Window onload **************************

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// Two Players UI
var TWOP_UI = {
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
  updateFeedbackInfo: function(){
    $('#level').text(APP.$player1Name+"'s Score: " + APP.player1Score);
    $('#chance').text(APP.$player2Name+"'s Score: " + APP.player2Score);
    if (APP.p1Turn) {
      $('#feedback h4').text(APP.$player1Name+"'s turn. Click a card.").css('color','black');
    } else {
      $('#feedback h4').text(APP.$player2Name+"'s turn. Click a card.").css('color','black');
    }
  }, // end of updateFeedbackInfo
  createBoard: function() {
    UI.clearCardDiv();
    APP.level = APP.$playSize/2;
    APP.numCards = Math.pow((APP.level)*2,2);
    var boardWidth = (APP.level)*2*(APP.width+5)+'px';
    var boardHeigth = (APP.level)*2*(APP.height+5)+'px';
    if (APP.level >=4) {
      $('footer').css('position','relative');
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
  assignGameCardsValue: function(){
    UI.createGameCards();
  }, // end of assignGameCardsValue
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
      $('#feedback h4').text('You found a match. Keep going.').css('color','green');
      setTimeout(function() {TWOP_UI.updateFeedbackInfo();},1000);

    } else { // no match
      $('#feedback h4').text('Sorry, no match.  Your turn is over').css('color','red');
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
  resetBoard: function(){
    // set score back to origin
    // re-create board based on type and number selected
    APP.$type = $('#cardTypeSelectForTwo option:selected').val(),
    APP.$playSize = $('#playSize option:selected').val();

    TWOP_UI.createBoard();

  } // End of resetBoard


} // End of Two Players UI
// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
