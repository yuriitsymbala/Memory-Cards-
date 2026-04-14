import { Injectable } from '@angular/core';
import { Level } from '../models/Level';

@Injectable({
  providedIn: 'root',
})
export class LevelService {
  private readonly storageKey = 'levels';
  levelCells: Level[] = [];

  constructor() {
    this.fetchLevels();
  }

  getLevel(cardsAmount: number): Level {
    const lastLevel = this.levelCells[this.levelCells.length - 1];
    return (
      this.levelCells.find((level) => level.cardsAmount === cardsAmount) ??
      lastLevel
    );
  }

  getNextLevel(currentlevel: Level) {
    let currentLevelId = this.levelCells.findIndex(
      (level) => level === currentlevel
    );

    if (currentLevelId < 0) {
      currentLevelId = this.levelCells.length - 1;
    }

    const nextLevelId = currentLevelId + 1;
    const nextLevel = this.levelCells[nextLevelId];

    if (nextLevel) {
      nextLevel.isOpened = true;
    }

    this.saveLevels();
    return nextLevel ?? this.levelCells[this.levelCells.length - 1];
  }

  saveLevels() {
    let savedLevels = JSON.stringify(this.levelCells);
    localStorage.setItem(this.storageKey, savedLevels);
  }

  fetchLevels() {
    const savedLevels = window.localStorage.getItem(this.storageKey);
    if (!savedLevels) {
      this.createLevels();
      this.saveLevels();
      return;
    }

    try {
      const levelsData: unknown = JSON.parse(savedLevels);
      if (!Array.isArray(levelsData)) {
        throw new Error('Invalid levels payload');
      }

      const parsedLevels = levelsData
        .filter(
          (data): data is { row: number; col: number; isOpened?: boolean } =>
            typeof data === 'object' &&
            data !== null &&
            typeof (data as { row?: unknown }).row === 'number' &&
            typeof (data as { col?: unknown }).col === 'number'
        )
        .map((data) => new Level(data.row, data.col, Boolean(data.isOpened)));

      if (parsedLevels.length === 0) {
        throw new Error('No valid levels');
      }

      this.levelCells = parsedLevels;
    } catch {
      this.createLevels();
      this.saveLevels();
    }
  }

  createLevels() {
    this.levelCells = [
      new Level(2, 2, true),
      new Level(2, 3),
      new Level(3, 4),
      new Level(4, 4),
      new Level(4, 5),
      new Level(5, 6),
      new Level(6, 6),
      new Level(6, 7),
      new Level(6, 8),
    ];
  }
}
