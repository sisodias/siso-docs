import { describe, expect, test } from 'vitest';

import { getSisoDocsServerOrigin, getSisoEmbedConfig } from './siso-bridge';

describe('SISO host bridge', () => {
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
});
