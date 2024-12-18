import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface BreadcrumbItem {
    label: string;
    url: string;
}

@Component({
    selector: 'app-breadcrumb',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item" *ngFor="let item of items; let last = last">
                    <a *ngIf="!last" [routerLink]="item.url">{{item.label}}</a>
                    <span *ngIf="last">{{item.label}}</span>
                </li>
            </ol>
        </nav>
    `
})
export class BreadcrumbComponent {
    @Input() items: BreadcrumbItem[] = [];
}