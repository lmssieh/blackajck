// HTML
const dealerCardsEle = document.querySelector("#dealerCards");
const playerCardsEle = document.querySelector("#playerCards");
const dealerScoreEle = document.querySelector("#dealerScore");
const playerScoreEle = document.querySelector("#playerScore");

let game = {
  dealerHands: [],
  playerHands: [],
  dealerScore: 0,
  playerScore: 0,
  chips: 2400,
  currentBet: 0,
};

let deck = createDeck(values, suits);

//   clone the deck and shuffle it
let createShuffledDeck = (deck) => {
  let newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    var temp = newDeck[i];
    newDeck[i] = newDeck[j];
    newDeck[j] = temp;
  }
  return newDeck;
};

let suffeledDeck = createShuffledDeck(deck);

// calculate the total value of the hand
let handTotalValue = (handArr) => {
  let handTotal = 0;
  handArr.forEach((hand) => (handTotal += hand.trueValue));
  return handTotal;
};

// checkIfBust return true if total value of the hand is greater than 21
// !checkIfBust === canDraw
let checkIfBust = (handArr) => {
  if (handTotalValue(handArr) > 21) return true;
  return false;
};

let checkIfBlackjack = (handArr) => {
  if (handTotalValue(handArr) === 21) return true;
  return false;
};

let compareResults = () => {
  if (handTotalValue(game.dealerHands) === handTotalValue(game.playerHands)) {
    showAlert("PUSH");
  } else if (
    handTotalValue(game.dealerHands) > handTotalValue(game.playerHands)
  ) {
    showAlert("dealer wins");
  } else if (
    handTotalValue(game.dealerHands) < handTotalValue(game.playerHands)
  ) {
    showAlert("player wins");
  }
  reset();
};

let playerCanSplit = (handArr) => {
  if (handArr[0].trueValue == handArr[1].trueValue) return true;
};

// interact
let shuffle = () => {
  createShuffledDeck(deck);
};

let drawHand = () => {
  // shuffle if deck is empty
  if (suffeledDeck.length <= 4) {
    shuffle();
    suffeledDeck = createShuffledDeck(deck);
  }
  return suffeledDeck.pop();
};

let showAlert = (text, color = "red") => {
  let template = `<div class="alert alert--${color}">${text}</div>`;
  document.querySelector("#alerts").innerHTML = template;
};

let dealHands = () => {
  document.querySelector("#resetBtn").style.display = "none";

  game.dealerHands.push(drawHand());
  game.playerHands.push(drawHand());
  game.dealerHands.push(drawHand());
  game.playerHands.push(drawHand());

  game.dealerScore = handTotalValue(game.dealerHands);
  game.playerScore = handTotalValue(game.playerHands);
  updateHtml();
};

let drawNewCard = (player) => {
  game[`${player}Hands`].push(drawHand());
  // update the score
  game[`${player}Score`] = handTotalValue(game[`${player}Hands`]);
  updateHtml();
  check(player);
};

let updateHtml = () => {
  dealerCardsEle.innerHTML = "";
  playerCardsEle.innerHTML = "";
  game.dealerHands.forEach((hand) => {
    dealerCardsEle.innerHTML += `
    <div class="card">
        <div class="card-image">
        <div class="card-image--${hand.suit}"></div>
      </div>
      <div class="card-value" data-card-value="${hand.value}"></div>
    </div>
  </div>`;
  });
  dealerScoreEle.innerHTML = handTotalValue(game.dealerHands);

  game.playerHands.forEach((hand) => {
    playerCardsEle.innerHTML += `
    <div class="card">
        <div class="card-image">
        <div class="card-image--${hand.suit}"></div>
        </div>
        <div class="card-value" data-card-value="${hand.value}"></div>
    </div>`;
  });
  playerScoreEle.innerHTML = handTotalValue(game.playerHands);

  // add animation class for cards
  if (playerCardsEle.lastChild)
    playerCardsEle.lastChild.classList.add("animate");
  // remove the class after .5s
  setTimeout(() => {
    document.querySelectorAll(".animate").forEach((el) => {
      el.classList.remove("animate");
    });
  }, 500);
};

function reset() {
  game.dealerHands = [];
  game.playerHands = [];
  game.currentBet = 0;

  document.querySelector("#resetBtn").style.display = "inline-block";
}

dealHands();
drawNewCard("player");

function check(player) {
  if (checkIfBlackjack(game[`${player}Hands`])) {
    showAlert(`${player} won || blackjack`);
    reset();
  } else if (checkIfBust(game[`${player}Hands`])) {
    showAlert(`${player} lost || bust`);
    reset();
  } else if (player == "dealer") {
    compareResults();
  }
  return false;
}

function stand() {
  if (this.handTotalValue(this.dealerHands) <= 17) {
    this.drawNewCard("dealer");
    this.stand();
  } else {
    check("dealer");
  }
}
