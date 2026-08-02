import { useEffect, useState } from 'react';

export interface SisoHostUser {
  id: string;
  email: string;
  name: string;
  workspaceId: string;
}

type SisoHostMessage =
  | { type: 'siso:session'; user: SisoHostUser }
  | { type: 'siso:open-settings' };

export function getSisoEmbedConfig(url = window.location.href) {
  const parsed = new URL(url);
  const hostOrigin = parsed.searchParams.get('siso_host_origin');
  return {
    embedded: parsed.searchParams.get('siso_embedded') === '1' && !!hostOrigin,
    hostOrigin,
    mode: parsed.searchParams.get('siso_mode'),
    serverOrigin: parsed.searchParams.get('siso_server_origin'),
  };
}

export function getSisoDocsServerOrigin(url = window.location.href) {
  const { embedded, serverOrigin } = getSisoEmbedConfig(url);
  if (!embedded || !serverOrigin || !URL.canParse(serverOrigin)) return null;
  const parsed = new URL(serverOrigin);
  return ['http:', 'https:'].includes(parsed.protocol) ? parsed.origin : null;
}

export function isSisoHostMessage(
  event: MessageEvent,
  hostOrigin: string | null
): event is MessageEvent<SisoHostMessage> {
  return (
    !!hostOrigin &&
    event.source === window.parent &&
    event.origin === hostOrigin &&
    typeof event.data === 'object' &&
    event.data !== null &&
    typeof event.data.type === 'string' &&
    event.data.type.startsWith('siso:')
  );
}

export function postSisoHostMessage(message: object) {
  const { embedded, hostOrigin } = getSisoEmbedConfig();
  if (!embedded || !hostOrigin) return false;
  window.parent.postMessage(message, hostOrigin);
  return true;
}

export function navigateSisoHost(path: string) {
  return postSisoHostMessage({ type: 'siso:navigate', path });
}

export function useSisoHostUser() {
  const [user, setUser] = useState<SisoHostUser | null>(null);

  useEffect(() => {
    const { embedded, hostOrigin } = getSisoEmbedConfig();
    if (!embedded || !hostOrigin) return;

    const onMessage = (event: MessageEvent) => {
      if (!isSisoHostMessage(event, hostOrigin)) return;
      if (event.data.type === 'siso:session') setUser(event.data.user);
    };

    window.addEventListener('message', onMessage);
    postSisoHostMessage({ type: 'siso:ready' });
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return user;
}
