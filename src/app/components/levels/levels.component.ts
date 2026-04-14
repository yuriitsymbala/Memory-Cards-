import { Component } from '@angular/core';
import { Level } from 'src/app/models/Level';
import { LevelCellComponent } from '../level-cell/level-cell.component';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LevelService } from 'src/app/services/level.service';
import { getGridCellSize } from 'src/app/utils';

@Component({
  standalone: true,
  selector: 'levels',
  templateUrl: './levels.component.html',
  styleUrls: ['./levels.component.css'],
  imports: [LevelCellComponent, CommonModule, RouterLink],
})
export class LevelsComponent {
  columnsCount: number = 3;
  levelCells: Level[] = [];
  cellSize: string = getGridCellSize(3, 3);

  constructor(private levelService: LevelService) {
    this.levelCells = this.levelService.levelCells;

    window.addEventListener('resize', this.updateSize);
  }

  updateSize = () => {
    this.cellSize = getGridCellSize(3, 3);
  };

  ngOnDestroy() {
    window.removeEventListener('resize', this.updateSize);
  }
}
