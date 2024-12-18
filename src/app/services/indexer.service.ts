import { Injectable, signal } from '@angular/core';

export interface IndexedProject {
  founderKey: string;
  nostrEventId: string;
  projectIdentifier: string;
  createdOnBlock: number;
  trxId: string;
}

export interface ProjectStats {
  investorCount: number;
  amountInvested: number;
  amountSpentSoFarByFounder: number;
  amountInPenalties: number;
  countInPenalties: number;
}

export interface Supply {
  circulating: number;
  total: number;
  max: number;
  rewards: number;
  height: number;
}

export interface ProjectInvestment {
  investorKey: string;
  amount: number;
  trxId: string;
  blockHeight: number;
}

export interface AddressBalance {
  address: string;
  balance: number;
  unconfirmedBalance?: number;
}

export interface Transaction {
  id: string;
  hex?: string;
  // Add more transaction properties as needed
}

export interface Block {
  hash: string;
  height: number;
  // Add more block properties as needed
}

export interface NetworkStats {
  connections: number;
  blockHeight: number;
  // Add more stats properties as needed
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

  constructor() {}

  private async fetchJson<T>(url: string): Promise<T> {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

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

      const response = await this.fetchJson<IndexedProject[]>(url);
      
      if (Array.isArray(response)) {
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

  getProject(id: string): IndexedProject | undefined {
    return this.projects().find(p => p.projectIdentifier === id);
  }

  async fetchProject(id: string): Promise<IndexedProject | null> {
    try {
      this.loading.set(true);
      const url = `${this.indexerUrl}api/query/Angor/projects/${id}`;
      console.log('Fetching project:', url);
      
      return await this.fetchJson<IndexedProject>(url);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : `Failed to fetch project ${id}`);
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  async fetchProjectStats(id: string): Promise<ProjectStats | null> {
    try {
      this.loading.set(true);
      const url = `${this.indexerUrl}api/query/Angor/projects/${id}/stats`;
      console.log('Fetching project stats:', url);
      
      return await this.fetchJson<ProjectStats>(url);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : `Failed to fetch stats for project ${id}`);
      return null;
    } finally {
      this.loading.set(false);
    }
  }

  async fetchProjectInvestments(projectId: string, offset = 0, limit = 10): Promise<ProjectInvestment[]> {
    try {
      const url = `${this.indexerUrl}api/query/Angor/projects/${projectId}/investments?offset=${offset}&limit=${limit}`;
      return await this.fetchJson<ProjectInvestment[]>(url);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : `Failed to fetch investments for project ${projectId}`);
      return [];
    }
  }

  async fetchInvestorDetails(projectId: string, investorKey: string): Promise<ProjectInvestment | null> {
    try {
      const url = `${this.indexerUrl}api/query/Angor/projects/${projectId}/investments/${investorKey}`;
      return await this.fetchJson<ProjectInvestment>(url);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to fetch investor details');
      return null;
    }
  }

  async getSupply(): Promise<Supply | null> {
    try {
      const url = `${this.indexerUrl}api/insight/supply`;
      return await this.fetchJson<Supply>(url);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to fetch supply');
      return null;
    }
  }

  async getCirculatingSupply(): Promise<number> {
    try {
      const url = `${this.indexerUrl}api/insight/supply/circulating`;
      return await this.fetchJson<number>(url);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to fetch circulating supply');
      return 0;
    }
  }

  async getAddressBalance(address: string): Promise<AddressBalance | null> {
    try {
      const url = `${this.indexerUrl}api/query/address/${address}`;
      return await this.fetchJson<AddressBalance>(url);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to fetch address balance');
      return null;
    }
  }

  async getAddressTransactions(address: string, offset = 0, limit = 10): Promise<Transaction[]> {
    try {
      const url = `${this.indexerUrl}api/query/address/${address}/transactions?offset=${offset}&limit=${limit}`;
      return await this.fetchJson<Transaction[]>(url);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to fetch address transactions');
      return [];
    }
  }

  async getTransaction(txId: string): Promise<Transaction | null> {
    try {
      const url = `${this.indexerUrl}api/query/transaction/${txId}`;
      return await this.fetchJson<Transaction>(url);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to fetch transaction');
      return null;
    }
  }

  async getTransactionHex(txId: string): Promise<string | null> {
    try {
      const url = `${this.indexerUrl}api/query/transaction/${txId}/hex`;
      const response = await this.fetchJson<string>(url);
      return response !== undefined ? response : null;
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to fetch transaction hex');
      return null;
    }
  }

  async getBlocks(offset?: number, limit = 10): Promise<Block[]> {
    try {
      const url = `${this.indexerUrl}api/query/block?${offset !== undefined ? `offset=${offset}&` : ''}limit=${limit}`;
      return await this.fetchJson<Block[]>(url);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to fetch blocks');
      return [];
    }
  }

  async getBlockByHash(hash: string): Promise<Block | null> {
    try {
      const url = `${this.indexerUrl}api/query/block/${hash}`;
      return await this.fetchJson<Block>(url);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to fetch block');
      return null;
    }
  }

  async getBlockByHeight(height: number): Promise<Block | null> {
    try {
      const url = `${this.indexerUrl}api/query/block/index/${height}`;
      return await this.fetchJson<Block>(url);
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to fetch block by height');
      return null;
    }
  }

  async getNetworkStats(): Promise<NetworkStats | null> {
    try {
      const url = `${this.indexerUrl}api/stats`;
      const response = await this.fetchJson<NetworkStats>(url);
      return response !== undefined ? response : null;
    } catch (err) {
      this.error.set(err instanceof Error ? err.message : 'Failed to fetch network stats');
      return null;
    }
  }

  async getHeartbeat(): Promise<boolean> {
    try {
      const url = `${this.indexerUrl}api/stats/heartbeat`;
      await fetch(url);
      return true;
    } catch {
      return false;
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
