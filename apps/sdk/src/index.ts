/**
 * @forge/sdk
 * Client & Backend Bridge SDK for Forge Micro-Apps.
 */

import type { UserContext, PostMessageEvent } from '@forge/types';

export interface ForgeClientOptions {
  onThemeChange?: (theme: 'light' | 'dark') => void;
  targetOrigin?: string;
}

export class ForgeClient {
  public user!: UserContext;
  public token!: string;
  public theme: 'light' | 'dark' = 'dark';

  private constructor() {}

  public static async init(options: ForgeClientOptions = {}): Promise<ForgeClient> {
    const client = new ForgeClient();

    return new Promise((resolve) => {
      const handleMessage = (event: MessageEvent<PostMessageEvent>) => {
        if (event.data?.type === 'FORGE_APP_CONTEXT') {
          const { user, token, theme } = event.data.payload;
          client.user = user;
          client.token = token;
          client.theme = theme;

          if (options.onThemeChange) {
            options.onThemeChange(theme);
          }

          window.removeEventListener('message', handleMessage);
          resolve(client);
        }
      };

      window.addEventListener('message', handleMessage);

      // Signal ready to parent portal
      if (window.parent && window.parent !== window) {
        window.parent.postMessage({ type: 'FORGE_APP_INIT', payload: { appId: window.location.pathname } }, '*');
      } else {
        // Fallback for local standalone testing
        client.user = {
          id: 'dev_user',
          name: 'Developer Local',
          email: 'dev@local.forge',
          role: 'admin',
        };
        client.token = 'mock_local_dev_token';
        resolve(client);
      }
    });
  }

  public async fetch(url: string, init: RequestInit = {}): Promise<Response> {
    const headers = new Headers(init.headers || {});
    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }
    return window.fetch(url, { ...init, headers });
  }
}
