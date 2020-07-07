const suits = ["hearts", "clubs", "diamonds", "spades"];
const values = [2, 3, 4, 5, 6, 7, 8, 9, 10, "J", "Q", "K", "A"];

// HTML
const dealerCardsEle = document.querySelector("#dealerCards");
const playerCardsEle = document.querySelector("#playerCards");
const dealerScoreEle = document.querySelector("#dealerScore");
const playerScoreEle = document.querySelector("#playerScore");
const startNewGameEle = document.querySelector("#startNewGame");

const currentBetEle = document.querySelector("#currentBet");
const chipsEle = document.querySelector("#chips");
class Game {
  constructor() {
    this.deck = this.createDeck(values, suits);
    this.shuffledDeck = this.createShuffledDeck(this.deck);
    this.dealerHands = [];
    this.playerHands = [];
    this.dealerScore = 0;
    this.playerScore = 0;
    this.chips = 2400;
    this.currentBet = 0;
  }

  // start the game
  init() {
    console.log(this.deck);
    console.log(this.shuffledDeck);
    this.startGame();
  }

  // covert J || Q || K || A to 10
  convertToValue(val) {
    if (val == "J" || val == "Q" || val == "K" || val == "A") {
      return 10;
    }
    return val;
  }

  // create a card object to fill the deck
  createCard(val, suit) {
    return {
      value: val,
      suit,
      trueValue: this.convertToValue(val),
    };
  }

  // create a deck and fill it with cards
  createDeck(values, suits) {
    let arr = [];
    values.forEach((val) => {
      suits.forEach((suit) => {
        arr.push(this.createCard(val, suit));
      });
    });
    return arr;
  }

  //   clone the deck and shuffle it
  createShuffledDeck(deck) {
    let newDeck = [...deck];
    for (let i = newDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      var temp = newDeck[i];
      newDeck[i] = newDeck[j];
      newDeck[j] = temp;
    }
    return newDeck;
  }

  // calculate the total value of the hand
  handTotalValue(hand) {
    let handTotal = 0;
    hand.forEach((hand) => (handTotal += hand.trueValue));
    return handTotal;
  }

  // checkIfBust return true if total value of the hand is greater than 21
  // !checkIfBust === canDraw
  checkIfBust(hand) {
    if (this.handTotalValue(hand) > 21) return true;
    return false;
  }

  checkIfBlackjack(hand) {
    if (this.handTotalValue(hand) === 21) return true;
    return false;
  }

  playerCanSplit() {
    if (this.playerHands[0].trueValue == this.playerHands[1].trueValue)
      return true;
  }

  shuffle() {
    this.shuffledDeck = this.createShuffledDeck(this.deck);
  }

  // gameStart
  startGame() {
    this.reset();
    // remove the alert
    if (document.querySelector(".alert"))
      document.querySelector(".alert").remove();
    startNewGameEle.style.display = "none";
    // show buttons
    document.querySelector(".buttons").style.display = "inline-block";

    this.dealerHands.push(this.drawHand());
    this.playerHands.push(this.drawHand());
    this.dealerHands.push(this.drawHand());
    this.playerHands.push(this.drawHand());

    this.dealerScore = this.handTotalValue(this.dealerHands);
    this.playerScore = this.handTotalValue(this.playerHands);
    this.updateHtml();
  }

  drawHand() {
    if (this.shuffledDeck.length <= 4) this.shuffle(); // shuffle if deck is empty
    return this.shuffledDeck.pop();
  }

  updateHtml() {
    dealerCardsEle.innerHTML = "";
    playerCardsEle.innerHTML = "";
    this.dealerHands.forEach((hand) => {
      dealerCardsEle.innerHTML += `
      <div class="card">
          <div class="card-image">
          <div class="card-image--${hand.suit}"></div>
        </div>
        <div class="card-value" data-card-value="${hand.value}"></div>
      </div>
    </div>`;
    });
    dealerScoreEle.innerHTML = this.handTotalValue(this.dealerHands);

    this.playerHands.forEach((hand) => {
      playerCardsEle.innerHTML += `
      <div class="card">
          <div class="card-image">
          <div class="card-image--${hand.suit}"></div>
          </div>
          <div class="card-value" data-card-value="${hand.value}"></div>
      </div>`;
    });
    playerScoreEle.innerHTML = this.handTotalValue(this.playerHands);
  }

  reset() {
    this.dealerHands = [];
    this.playerHands = [];
    this.currentBet = 0;

    document.querySelector(".buttons").style.display = "none";
    startNewGameEle.style.display = "inline-block";
  }

  showAlert(text, color = "red") {
    let template = `<div class="alert alert--${color}">${text}</div>`;
    document.querySelector("#alerts").innerHTML = template;
    // setTimeout(() => {
    //   document.querySelector(".alert").remove();
    // }, 1800);
  }
  // player action

  drawNewCard(player) {
    if (player == "player") {
      this.playerHands.push(this.drawHand());
      this.playerScore = this.handTotalValue(this.playerHands);
    } else if (player == "dealer") {
      this.dealerHands.push(this.drawHand());
      this.dealerScore = this.handTotalValue(this.dealerHands);
    }
    this.updateHtml();
    this.check(player);
  }

  stand() {
    if (this.handTotalValue(this.dealerHands) <= 17) {
      this.drawNewCard("dealer");
      console.log("eee");
    } else {
      this.check("dealer");
      console.log("> 17");
    }
  }

  check(player) {
    let hand;
    player == "player" ? (hand = this.playerHands) : (hand = this.dealerHands);
    if (this.checkIfBlackjack(hand)) {
      this.winner(player, `${player} wins || blackjack`);
    } else if (this.checkIfBust(hand)) {
      this.winner(player, `${player} lost || bust`);
    } else if (player == "dealer") {
      this.compareResults();
    }
    return false;
  }

  compareResults() {
    if (
      this.handTotalValue(this.dealerHands) ===
      this.handTotalValue(this.playerHands)
    ) {
      this.winner(null, "PUSH");
    } else if (
      this.handTotalValue(this.dealerHands) >
      this.handTotalValue(this.playerHands)
    ) {
      this.winner("dealer", "dealer wins");
    } else if (
      this.handTotalValue(this.dealerHands) <
      this.handTotalValue(this.playerHands)
    ) {
      this.winner("player", "player wins");
    }
  }

  winner(player, message) {
    if (message.toLowerCase() != "push") {
      let score = 0;
      player == "player"
        ? (score = this.playerScore)
        : (score = this.playerScore);
      score++;
    }
    this.showAlert(message);
    this.reset();
  }

  bet(price) {
    if (price <= this.chips) {
      this.currentBet += price;
      currentBetEle.textContent = this.currentBet;
      this.chips -= price;
      chipsEle.textContent = this.chips;
      console.log(price);
    } else {
      this.showAlert(`you don't have enough chips`);
      console.log(`you don't have enough chips`);
    }
  }
}

const game = new Game();
game.init();
