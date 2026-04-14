import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, HostBinding, HostListener } from '@angular/core';
import { Card } from 'src/app/models/Card';

@Component({
  standalone: true,
  selector: 'card-cell',
  templateUrl: './card-cell.component.html',
  styleUrls: ['./card-cell.component.css'],
  imports: [CommonModule],
})
export class CardCellComponent {
  @Input() card!: Card;
  @Input() cardIndex!: number;
  @Output() flippedCardIndex = new EventEmitter<number>();

  @HostBinding('class.input-disabled')
  get inputDisabled(): boolean {
    return !this.card.isEnabled;
  }

  @HostBinding('attr.role') role = 'button';
  @HostBinding('attr.tabindex') get tabIndex(): number {
    return this.card?.isEnabled ? 0 : -1;
  }
  @HostBinding('attr.aria-disabled') get ariaDisabled(): string {
    return String(!this.card?.isEnabled);
  }

  @HostListener('click')
  toggleFlip() {
    if (!this.card.isEnabled) {
      return;
    }
    this.card.isFlipped = !this.card.isFlipped;
    this.flippedCardIndex.emit(this.cardIndex);
  }

  @HostListener('keydown.enter')
  @HostListener('keydown.space', ['$event'])
  onKeyboardFlip(event?: Event) {
    event?.preventDefault();
    this.toggleFlip();
  }
}
