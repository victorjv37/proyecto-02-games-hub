export class MemoryGame {
  constructor() {
    this.cards = [];
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.moves = 0;
    this.gameActive = true;
    this.scores = JSON.parse(localStorage.getItem('memoryScores')) || { bestMoves: Infinity };
    this.initializeCards();
  }

  initializeCards() {
    const emojis = ['🎮', '🎲', '🎯', '🎨', '🎭', '🎪', '🎟️', '🎠'];
    this.cards = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false
      }));
  }

  flipCard(cardId) {
    if (!this.gameActive || this.flippedCards.length >= 2) return false;
    
    const card = this.cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return false;
    
    card.isFlipped = true;
    this.flippedCards.push(card);
    
    if (this.flippedCards.length === 2) {
      this.moves++;
      return this.checkMatch();
    }
    
    return { status: 'flipped' };
  }

  checkMatch() {
    const [card1, card2] = this.flippedCards;
    const isMatch = card1.emoji === card2.emoji;
    
    if (isMatch) {
      card1.isMatched = true;
      card2.isMatched = true;
      this.matchedPairs++;
      
      if (this.matchedPairs === this.cards.length / 2) {
        this.gameActive = false;
        this.updateScores();
        return { status: 'win', moves: this.moves };
      }
      
      this.flippedCards = [];
      return { status: 'match' };
    }
    
    setTimeout(() => {
      card1.isFlipped = false;
      card2.isFlipped = false;
      this.flippedCards = [];
    }, 1000);
    
    return { status: 'no-match' };
  }

  updateScores() {
    if (this.moves < this.scores.bestMoves) {
      this.scores.bestMoves = this.moves;
      localStorage.setItem('memoryScores', JSON.stringify(this.scores));
    }
  }

  resetGame() {
    this.initializeCards();
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.moves = 0;
    this.gameActive = true;
  }

  getScores() {
    return this.scores;
  }
} 