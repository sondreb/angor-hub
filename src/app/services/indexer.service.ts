import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface IndexedProject {
  founderKey: string;
  nostrEventId: string;
  projectIdentifier: string;
  createdOnBlock: number;
  trxId: string;
}

@Injectable({
  providedIn: 'root'
})
export class IndexerService {
  private readonly LIMIT = 6;
  private readonly indexerUrl = 'https://tbtc.indexer.angor.io/';
  private offset = 0;
  private totalProjectsFetched = false;

  public loading = signal<boolean>(false);
  public projects = signal<IndexedProject[]>([]);
  public error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

  async fetchProjects(reset = false): Promise<void> {
    if (reset) {
      this.offset = 0;
      this.totalProjectsFetched = false;
      this.projects.set([]);
    }

    if (this.loading() || this.totalProjectsFetched) {
      return;
    }

    try {
      this.loading.set(true);
      this.error.set(null);

      const url = `${this.indexerUrl}api/query/Angor/projects?offset=${this.offset}&limit=${this.LIMIT}`;

      console.log('Fetching:', url);

      const response = await this.http.get<IndexedProject[]>(url).toPromise();
      
      if (response && Array.isArray(response)) {
        if (response.length < this.LIMIT) {
          this.totalProjectsFetched = true;
        }

        this.projects.update(existing => [...existing, ...response]);
        this.offset += response.length;
      }
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to fetch projects');
    } finally {
      this.loading.set(false);
    }
  }

  async loadMore(): Promise<void> {
    if (!this.totalProjectsFetched) {
      await this.fetchProjects();
    }
  }

  resetProjects(): void {
    this.fetchProjects(true);
  }

  isComplete(): boolean {
    return this.totalProjectsFetched;
  }
}
