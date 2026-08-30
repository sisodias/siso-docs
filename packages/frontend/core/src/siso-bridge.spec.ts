import { beforeEach, describe, expect, test, vi } from 'vitest';

import { getSisoDocsServerOrigin, getSisoEmbedConfig } from './siso-bridge';

describe('SISO host bridge', () => {
  const storage = new Map<string, string>();

  beforeEach(() => {
    storage.clear();
    vi.stubGlobal('sessionStorage', {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => storage.set(key, value),
      removeItem: (key: string) => storage.delete(key),
    });
  });

  test('recognizes the explicit embedded host contract', () => {
    expect(
      getSisoEmbedConfig(
        'http://127.0.0.1:3020/?siso_embedded=1&siso_host_origin=http%3A%2F%2F127.0.0.1%3A4320&siso_mode=settings&siso_server_origin=http%3A%2F%2F127.0.0.1%3A3010'
      )
    ).toEqual({
      embedded: true,
      hostOrigin: 'http://127.0.0.1:4320',
      mode: 'settings',
      serverOrigin: 'http://127.0.0.1:3010',
    });
  });

  test('selects the owned backend only for an explicit embedded contract', () => {
    expect(
      getSisoDocsServerOrigin(
        'http://127.0.0.1:3020/?siso_embedded=1&siso_host_origin=http%3A%2F%2F127.0.0.1%3A4320&siso_server_origin=http%3A%2F%2F127.0.0.1%3A3010'
      )
    ).toBe('http://127.0.0.1:3010');
  });

  test('does not trust a host origin without the embedded flag', () => {
    expect(
      getSisoEmbedConfig(
        'http://127.0.0.1:3020/?siso_host_origin=http%3A%2F%2F127.0.0.1%3A4320'
      ).embedded
    ).toBe(false);
  });

  test('persists a trusted embedded contract across queryless navigation', () => {
    const initial = getSisoEmbedConfig(
      'http://127.0.0.1:3020/?siso_embedded=1&siso_host_origin=http%3A%2F%2F127.0.0.1%3A4320&siso_mode=docs&siso_server_origin=http%3A%2F%2F127.0.0.1%3A3010'
    );

    expect(initial.embedded).toBe(true);
    expect(
      getSisoEmbedConfig('http://127.0.0.1:3020/workspace/ws/all')
    ).toEqual(initial);
  });

  test('does not reuse the embedded contract after explicit non-embedded navigation', () => {
    getSisoEmbedConfig(
      'http://127.0.0.1:3020/?siso_embedded=1&siso_host_origin=http%3A%2F%2F127.0.0.1%3A4320'
    );

    expect(
      getSisoEmbedConfig('http://127.0.0.1:3020/?siso_embedded=0').embedded
    ).toBe(false);
    expect(
      getSisoEmbedConfig('http://127.0.0.1:3020/workspace/ws/all').embedded
    ).toBe(false);
  });
});
