import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface BlogPost {
  title: string;
  link: string;
  pubDate: Date;
  description: string;
  thumbnail?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private rssUrl = 'https://blog.angor.io/rss';
  private proxyUrl = 'https://api.allorigins.win/raw?url=';

  constructor(private http: HttpClient) {}

  getLatestPosts(): Observable<BlogPost[]> {
    return this.http.get(`${this.proxyUrl}${encodeURIComponent(this.rssUrl)}`, { responseType: 'text' })
      .pipe(
        map(xml => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(xml, 'text/xml');
          const items = doc.querySelectorAll('item');
          
          return Array.from(items).slice(0, 4).map(item => {
            const description = item.querySelector('description')?.textContent || '';
            const thumbnail = description.match(/<img[^>]+src="([^">]+)"/)?.[1];
            
            return {
              title: item.querySelector('title')?.textContent || '',
              link: item.querySelector('link')?.textContent || '',
              pubDate: new Date(item.querySelector('pubDate')?.textContent || ''),
              description: description.replace(/<[^>]*>/g, '').slice(0, 150) + '...',
              thumbnail
            };
          });
        })
      );
  }
}
