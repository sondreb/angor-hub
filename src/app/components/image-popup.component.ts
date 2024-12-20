import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-popup',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="popup-overlay" (click)="close.emit()">
      <div class="popup-content">
        <img [src]="imageUrl" [alt]="altText" />
      </div>
    </div>
  `,
  styles: [`
    .popup-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      cursor: pointer;
    }

    .popup-content {
      max-width: 90vw;
      max-height: 90vh;
    }

    img {
      max-width: 100%;
      max-height: 90vh;
      object-fit: contain;
      border-radius: 8px;
    }
  `]
})
export class ImagePopupComponent {
  @Input() imageUrl: string = '';
  @Input() altText: string = '';
  @Output() close = new EventEmitter<void>();
}
