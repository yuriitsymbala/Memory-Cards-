import { Component, ViewChild, inject } from '@angular/core';
import { Card } from '../../models/Card';
import { CardCellComponent } from '../card-cell/card-cell.component';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PopupComponent } from '../popup/popup.component';
import { Level } from 'src/app/models/Level';
import { LevelService } from 'src/app/services/level.service';
import { CardService } from 'src/app/services/card.service';
import { getGridCellSize } from 'src/app/utils';

@Component({
  standalone: true,
  selector: 'game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
  imports: [CommonModule, CardCellComponent, PopupComponent, RouterModule],
})
export class GameComponent {
  currentLevel!: Level;
  columnsCount: number = 3;
  cardSize: string = '10rem';
  cardCells: Card[] = [];

  @ViewChild('popup', { static: false }) popup!: PopupComponent;

  constructor(
    private levelService: LevelService,
    private cardService: CardService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.currentLevel = this.resolveInitialLevel();
    this.columnsCount = this.currentLevel.col;

    this.cardCells = this.cardService.generateCards(this.currentLevel);
    cardService.cardsUpdate = (cards) => {
      this.cardCells = cards;
    };
    cardService.gameOver = () => {
      const nextLevel = this.levelService.getNextLevel(this.currentLevel);
      this.currentLevel = nextLevel;
      this.popup.open();
    };

    window.addEventListener('resize', this.updateCardSize);
    this.updateCardSize();
  }

  private resolveInitialLevel(): Level {
    const requestedCardsAmount = Number(this.route.snapshot.params['id']);
    const hasValidParam =
      Number.isFinite(requestedCardsAmount) && requestedCardsAmount > 0;

    if (hasValidParam) {
      const matchedLevel = this.levelService.levelCells.find(
        (level) => level.cardsAmount === requestedCardsAmount
      );
      if (matchedLevel) {
        return matchedLevel;
      }
    }

    this.router.navigateByUrl('/');
    return (
      this.levelService.levelCells.find((level) => level.isOpened) ??
      this.levelService.levelCells[0]
    );
  }

  updateCardSize = () => {
    this.cardSize = getGridCellSize(
      this.currentLevel.col,
      this.currentLevel.row
    );
  };

  nextLevel() {
    this.updateCardSize();
    this.columnsCount = this.currentLevel.col;
    this.cardCells = this.cardService.generateCards(this.currentLevel);
  }

  onCardClick(index: number) {
    this.cardService.onCardClick(index);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.updateCardSize);
  }
}
