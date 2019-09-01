import { Component, OnInit } from '@angular/core';
import { trigger, style, transition, animate, keyframes, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('cardAnimation', [
      transition('* => *', [
        query(':enter', style({ opacity: 0 }), { optional: true }),
        query(':enter', stagger('100ms', [
          animate('.75s cubic-bezier(0.215, 0.61, 0.355, 1)',
            keyframes([
              style({ opacity: 0, transform: 'scale3d(0.3, 0.3, 0.3)', offset: 0 }),
              style({ opacity: 0.2, transform: 'scale3d(1.1, 1.1, 1.1)', offset: 0.2 }),
              style({ opacity: 0.4, transform: 'scale3d(0.9, 0.9, 0.9)', offset: 0.4 }),
              style({ opacity: 0.6, transform: 'scale3d(1.03, 1.03, 1.03)', offset: 0.6 }),
              style({ opacity: 0.8, transform: 'scale3d(0.97, 0.97, 0.97)', offset: 0.8 }),
              style({ opacity: 1, transform: 'scale3d(1, 1, 1)', offset: 1.0 }),
            ]))]), { optional: true })
          ])
        ])

      ]
})

export class AppComponent implements OnInit {
  constructor() {}

  ngOnInit() {

    // Card variables
    const suits = ['Copas', 'Paus', 'Ouros', 'Espadas'];
    const values = [
      'Ás',
      'Rei',
      'Dama',
      'Valete',
      'Dez',
      'Nove',
      'Oito',
      'Sete',
      'Seis',
      'Cinco',
      'Quatro',
      'Três',
      'Dois'
    ];

    // DOM variables
    const textArea = document.getElementById('text-area');
    const dealerPlace = document.getElementById('dealer-place');
    const playerPlace = document.getElementById('player-place');
    const newBtn = document.getElementById('new-game-btn');
    const hitBtn = document.getElementById('hit-btn');
    const stayBtn = document.getElementById('stay-btn');

    // Game variables
    let gameStarted = false;
    let gameOver = false;
    let playerWon = false;
    let dealerCards = [];
    let playerCards = [];
    let dealerScore = 0;
    let playerScore = 0;
    let deck = [];

    hitBtn.style.display = 'none';
    stayBtn.style.display = 'none';
    showStatus();

    // Hit New Game Btn
    newBtn.addEventListener('click', function() {
      gameStarted = true;
      gameOver = false;
      playerWon = false;

      deck = createDeck();
      shuffleDeck(deck);
      dealerCards = [getNextCard(), getNextCard()];
      playerCards = [getNextCard(), getNextCard()];

      newBtn.style.display = 'none';
      textArea.innerText = 'Faça mais pontos e ganhe do Dealer!';
      hitBtn.style.display = 'inline';
      stayBtn.style.display = 'inline';
      showStatus();
    });

    hitBtn.addEventListener('click', function() {
      playerCards.push(getNextCard());
      checkForEndOfGame();
      showStatus();
    });

    stayBtn.addEventListener('click', function() {
      gameOver = true;
      checkForEndOfGame();
      showStatus();
    });


    ///////////////////////////////
    ////// TESTE CARTAS //////////
    ///////////////////////////////

    /*function getCards() {

      let url = './deck-cards.json';
      let xhttp = new XMLHttpRequest();

      xhttp.onreadystatechange = function() {

          if (this.readyState === 4 && this.status === 200) {

              const response = (JSON.parse(this.responseText));


              for (i = 0; i < 3; i++) {

                  const myCard = document.createElement('<div>');
                  const firstCard = response.allCards[i].image;
                  myCard.innerHTML = firstCard;
                  document.getElementById('dealer-place' + (i + 1)).appendChild(myCard);
              }
          }
      };

      xhttp.open('GET', 'url', true);

      xhttp.send();

    }*/

    ///////////////////////////////
    ////// FIM TESTE CARTAS //////////
    ///////////////////////////////



    function createDeck() {
      const deck = [];
      for (let suitIdx = 0; suitIdx < suits.length; suitIdx++) {
        for (let valueIdx = 0; valueIdx < values.length; valueIdx++) {
          const card = {
            suit: suits[suitIdx],
            value: values[valueIdx]
          };
          deck.push(card);
        }
      }
      return deck;
    }

    function shuffleDeck(deck) {
      for (let i = 0; i < deck.length; i++) {
        const swapIdx = Math.trunc(Math.random() * deck.length);
        const tmp = deck[swapIdx];
        deck[swapIdx] = deck[i];
        deck[i] = tmp;
      }
    }

    function getCardString(card) {
      return card.value + ' de ' + card.suit;
    }

    function getNextCard() {
      return deck.shift();
    }

    function getCardNumericValue(card) {
      switch (card.value) {
        case 'Ás':
          return 1;
        case 'Dois':
          return 2;
        case 'Três':
          return 3;
        case 'Quatro':
          return 4;
        case 'Cinco':
          return 5;
        case 'Seis':
          return 6;
        case 'Sete':
          return 7;
        case 'Oito':
          return 8;
        case 'Nove':
          return 9;
        default:
          return 10;
      }
    }

    function getScore(cardArray) {
      let score = 0;
      let hasAce = false;

      for (let i = 0; i < cardArray.length; i++) {
        const card = cardArray[i];
        score += getCardNumericValue(card);

        if (card.value === 'Ás') {
          hasAce = true;
        }
      }
      if (hasAce && score + 10 <= 21) {
        return (score += 10);
      }
      return score;
    }

    function updateScores() {
      dealerScore = getScore(dealerCards);
      playerScore = getScore(playerCards);
    }

    function checkForEndOfGame() {
      updateScores();

      if (gameOver) {
        // let dealer take cards
        while (
          dealerScore < playerScore &&
          playerScore <= 21 &&
          dealerScore <= 21
        ) {
          dealerCards.push(getNextCard());
          updateScores();
        }
      }

      if (playerScore > 21 || playerScore === dealerScore) {
        playerWon = false;
        gameOver = true;
      } else if (dealerScore > 21) {
        playerWon = true;
        gameOver = true;
      } else if (gameOver) {
        if (playerScore > dealerScore) {
          playerWon = true;
        } else {
          playerWon = false;
        }
      }
    }

    function showStatus() {
      if (!gameStarted) {
        textArea.innerText = 'Bem-vindo ao Blackjack!';
        return;
      }

      let dealerCardString = '';
      for (let i = 0; i < dealerCards.length; i++) {
        dealerCardString += getCardString(dealerCards[i]) + '\n';
      }

      let playerCardString = '';
      for (let i = 0; i < playerCards.length; i++) {
        playerCardString += getCardString(playerCards[i]) + '\n';
      }

      updateScores();

      dealerPlace.innerText =
        'Dealer tem: \n' +
        dealerCardString +
        '(score: ' +
        dealerScore +
        ') \n\n';

      playerPlace.innerText =
        'Player tem: \n' +
        playerCardString +
        '(score: ' +
        playerScore +
        ') \n\n';

      if (gameOver) {
        textArea.innerText = '';
        if (playerWon) {
          textArea.innerText += 'Você venceu!';
        } else {
          textArea.innerText += 'Dealer venceu!';
        }
        newBtn.style.display = 'inline';
        hitBtn.style.display = 'none';
        stayBtn.style.display = 'none';
      }
    }
  }
}
