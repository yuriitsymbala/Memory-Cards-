import { Injectable } from '@angular/core';
import { Card } from '../models/Card';
import { Level } from '../models/Level';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  columnsCount: number = 3;
  cards: Card[] = [];
  firstFlippedIndex: number = -1;
  secondFlippedIndex: number = -1;

  cardsUpdate: (cards: Card[]) => void = () => {};
  gameOver: () => void = () => {};

  constructor() {}

  generateCards(level: Level): Card[] {
    this.columnsCount = level.col;
    const assetsArray = [
      'jellyfish',
      'sea-turtle',
      'chameleon',
      'crab',
      'chick',
      'crocodile',
      'starfish',
      'cow',
      'bee',
      'dolphin',
      'elephant',
      'fish',
      'hen',
      'octopus',
      'butterfly',
      'owl',
      'panda-bear',
      'parrot',
      'penguin',
      'pig',
      'rabbit',
      'shark',
      'squirrel',
      'sheep',
      'puffer-fish',
      'shell',
    ];

    const randomAssets = this.getRandomAssets(
      assetsArray,
      level.cardsAmount / 2
    );

    this.cards = randomAssets.map((asset) => new Card(asset));
    return this.cards;
  }

  onCardClick(index: number) {
    if (!this.cards[index] || !this.cards[index].isEnabled) {
      return;
    }

    if (this.firstFlippedIndex === -1) {
      this.firstFlippedIndex = index;
      this.cards[index].isEnabled = false;
      this.cardsUpdate(this.cards);
      return;
    }
    this.secondFlippedIndex = index;

    for (const card of this.cards) {
      card.isEnabled = false;
    }
    this.cardsUpdate(this.cards);

    setTimeout(this.checkMatch, 900);
  }

  checkMatch = () => {
    const firstFlippedCard = this.cards[this.firstFlippedIndex];
    const secondFlippedCard = this.cards[this.secondFlippedIndex];

    if (firstFlippedCard.imgName === secondFlippedCard.imgName) {
      this.firstFlippedIndex = -1;
      this.checkGameOver();
    } else {
      firstFlippedCard.isFlipped = false;
      secondFlippedCard.isFlipped = false;
      this.firstFlippedIndex = -1;
    }

    for (const card of this.cards) {
      card.isEnabled = !card.isFlipped;
    }
    this.secondFlippedIndex = -1;
    this.cardsUpdate(this.cards);
  };

  checkGameOver() {
    const unflippedCards = this.cards.filter((card) => !card.isFlipped);
    if (unflippedCards.length > 0) {
      return;
    } else {
      this.gameOver();
    }
  }

  getRandomAssets(assetsArray: string[], cardsAmount: number) {
    const shuffled = [...assetsArray]
      .sort(() => 0.5 - Math.random())
      .slice(0, cardsAmount);
    const merged = shuffled
      .concat(shuffled.reverse())
      .sort(() => 0.5 - Math.random());
    return merged;
  }
}
