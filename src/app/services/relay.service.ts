import { Injectable, signal, effect } from '@angular/core';
import { SimplePool, Filter, Event, Relay } from 'nostr-tools';
import NDK, { NDKEvent } from '@nostr-dev-kit/ndk';

@Injectable({
  providedIn: 'root',
})
export class RelayService {
  private pool = new SimplePool();
  private relayUrls = [
    'wss://relay.primal.net',
    'wss://nos.lol',
    'wss://relay.angor.io',
    'wss://relay2.angor.io',
  ];

  private connectedRelays = signal<string[]>([]);
  public projects = signal<Event[]>([]);
  public loading = signal<boolean>(false);

  constructor() {
    this.initializeRelays();

    effect(() => {
      // Automatically fetch projects when relays are connected
      if (this.connectedRelays().length > 0) {
        this.subscribeToProjects();
      }
    });
  }

  private async initializeRelays() {
    this.loading.set(true);

    const ndk = new NDK({
      explicitRelayUrls: this.relayUrls,
    });

    await ndk.connect();

    const sub = ndk.subscribe({ kinds: [1], '#t': ['nostr'] });
    sub.on('event', async (event: NDKEvent) => {
      const author = event.author;
      const profile = await author.fetchProfile();
      console.log(`${profile?.name}: ${event.content}`);
    });

    for (const url of this.relayUrls) {
      try {
        // const relay = await Relay.connect(url);
        // const sub = relay.subscribe(
        //   [
        //     {
        //       ids: [
        //         'd7dd5eb3ab747e16f8d0212d53032ea2a7cadef53837e5a6c66d42849fcb9027',
        //       ],
        //     },
        //   ],
        //   {
        //     onevent(event) {
        //       console.log('we got the event we wanted:', event);
        //     },
        //     oneose() {
        //       sub.close();
        //     },
        //   }
        // );
        // relay.on('connect', () => {
        //   this.connectedRelays.update(relays => [...relays, url]);
        // });
        // relay.on('disconnect', () => {
        //   this.connectedRelays.update(relays =>
        //     relays.filter(r => r !== url)
        //   );
        // });
      } catch (error) {
        console.error(`Failed to connect to relay ${url}:`, error);
      }
    }

    this.loading.set(false);
  }

  async fetchProfile(pubkey: string): Promise<any> {
    const ndk = new NDK({
      explicitRelayUrls: this.relayUrls,
    });

    await ndk.connect();

    try {
      const filter = {
        kinds: [0],
        authors: [pubkey],
        limit: 1
      };

      const sub = ndk.subscribe(filter);
      
      return new Promise((resolve) => {
        const timeout = setTimeout(() => {
          // sub.close();
          resolve(null);
        }, 5000); // 5 second timeout

        sub.on('event', (event: NDKEvent) => {
          clearTimeout(timeout);
          // sub.close();
          try {
            resolve(JSON.parse(event.content));
          } catch {
            resolve(null);
          }
        });
      });
    } finally {
      // await ndk.close();
    }
  }

  private subscribeToProjects() {
    // this.loading.set(true);

    // const filter: Filter = {
    //   kinds: [1],
    //   tags: [['t', 'project']],
    //   limit: 100,
    // };

    // let sub = this.pool.sub(this.relayUrls, [filter]);

    // sub.on('event', (event: Event) => {
    //   this.projects.update((projects) => [...projects, event]);
    // });

    // sub.on('eose', () => {
    //   this.loading.set(false);
    //   sub.unsub();
    // });
  }

  public disconnect() {
    this.pool.close(this.relayUrls);
  }
}
