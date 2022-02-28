import Deck from "./deck.js"

const computerCardSlot = document.querySelector('.computer-card-slot')
const playerCardSlot = document.querySelector('.player-card-slot')
const computerDeckElement = document.querySelector('.computer-deck')
const playerDeckElement = document.querySelector('.player-deck')
const text = document.querySelector('.text')

let playerDeck, computerDeck, inRound

document.addEventListener('click', () => {
  if (inRound){
    cleanBeforeRound()
  }
  else{
    flipCards()
  }
})

startGame()
function startGame() {

  const deck = new Deck()
  deck.shuffle()

  const deckMidpoint = Math.ceil(deck.numberOfCards / 2)
  playerDeck = new Deck(deck.cards.slice(0, deckMidpoint))
  computerDeck = new Deck(deck.cards.slice(deckMidpoint, deck.numberOfCards))
  inRound = false



  cleanBeforeRound()
}

function cleanBeforeRound(){
  inRound = false
  computerCardSlot.innerHTML= ''
  playerCardSlot.innerHTML= ''
  text.innerText= ''

  updateDeckCount()
}

function flipCards(){
  inRound = true

  const playerCard = playerDeck.pop()
  const computerCard = computerDeck.pop()
}

function updateDeckCount(){
  computerDeckElement.innerText = computerDeck.numberOfCards
  playerDeckElement.innerText = computerDeck.numberOfCards
}



