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
    `,
    styles: [`
        .breadcrumb {
            display: flex;
            flex-wrap: wrap;
            padding: 0.75rem 0;
            margin-bottom: 1rem;
            list-style: none;
            border-radius: 0.25rem;
            color: var(--text);
            opacity: 0.8;
        }

        .breadcrumb-item + .breadcrumb-item::before {
            content: "/";
            padding: 0 0.5rem;
            color: var(--text);
            opacity: 0.5;
        }

        .breadcrumb-item a {
            text-decoration: none;
            color: var(--accent);
        }

        .breadcrumb-item a:hover {
            color: var(--accent-light);
            text-decoration: none;
        }

        .breadcrumb-item:last-child {
            color: var(--text);
            opacity: 0.6;
        }
    `]
})
export class BreadcrumbComponent {
    @Input() items: BreadcrumbItem[] = [];
}