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
            padding: 0.75rem 1rem;
            margin-bottom: 1rem;
            list-style: none;
            background-color: #f8f9fa;
            border-radius: 0.25rem;
        }
        .breadcrumb-item + .breadcrumb-item::before {
            content: "/";
            padding: 0 0.5rem;
        }
        .breadcrumb-item a {
            text-decoration: none;
            color: #007bff;
        }
        .breadcrumb-item a:hover {
            text-decoration: underline;
        }
    `]
})
export class BreadcrumbComponent {
    @Input() items: BreadcrumbItem[] = [];
}