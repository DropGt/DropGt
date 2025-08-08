import { Client, Peer, TextPacket } from 'growtopia.js';
import { logger } from '../utils/logger';

export type Plugin = {
  onReady?: (client: Client) => void;
  onConnect?: (client: Client, netID: number) => void;
  onDisconnect?: (client: Client, netID: number) => void;
  onRaw?: (client: Client, netID: number, channelID: number, data: Buffer) => void;
  onError?: (client: Client, error: unknown) => void;
};

const registry: Plugin[] = [];

export function use(plugin: Plugin) {
  registry.push(plugin);
}

export function getPlugins(): Plugin[] {
  return registry;
}

export function registerDefaultPlugins() {
  // Greeter plugin: sends a simple text packet on connect
  use({
    onConnect: (client, netID) => {
      try {
        const peer = new Peer(client, netID);
        peer.send(TextPacket.from(0x1));
      } catch (e) {
        logger.warn(`Greeter plugin failed for netID ${netID}: ${(e as Error).message}`);
      }
    },
  });
}