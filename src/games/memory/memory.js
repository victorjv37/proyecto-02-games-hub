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
    const retroIcons = [
      'https://cdn.pixabay.com/photo/2021/02/11/15/40/mario-6005703_960_720.png',
      'https://easydrawingguides.com/wp-content/uploads/2021/09/Pacman-Pixel-Art-step-by-step-drawing-tutorial-step-10.png',
      'https://e7.pngegg.com/pngimages/417/667/png-clipart-donkey-kong-country-3-dixie-kong-s-double-trouble-donkey-kong-jr-donkey-kong-3-donkey-kong-text-super-mario-bros-thumbnail.png',
      'https://e7.pngegg.com/pngimages/203/982/png-clipart-space-invaders-extreme-2-arcade-game-alien-invaders-from-space-space-invaders-angle-white.png',
      'https://i.pinimg.com/736x/ed/f7/e3/edf7e33897ae1b149c21bdf8e51d6b2f.jpg',
      'https://w7.pngwing.com/pngs/358/619/png-transparent-legend-of-zelda-link-pixelated-illustration-the-legend-of-zelda-breath-of-the-wild-link-pixel-art-video-game-excited-person-gif-video-game-fictional-character-cartoon-thumbnail.png',
      'https://e7.pngegg.com/pngimages/49/910/png-clipart-mega-man-x8-mega-man-bass-mega-man-maverick-hunter-x-pixel-art-video-game-bead.png',
      'https://w7.pngwing.com/pngs/254/38/png-transparent-minecraft-kirby-star-allies-kirby-s-adventure-meta-knight-xbox-360-kirby-s-adventure-minecraft-allies-kirby-s-adventure-thumbnail.png'
    ];
    
    this.cards = [...retroIcons, ...retroIcons]
      .sort(() => Math.random() - 0.5)
      .map((iconPath, index) => ({
        id: index,
        iconPath,
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
    const isMatch = card1.iconPath === card2.iconPath;
    
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