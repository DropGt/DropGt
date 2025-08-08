import 'dotenv/config';
import { Client } from 'growtopia.js';
import { logger } from './utils/logger';
import { RateLimiter } from './utils/rateLimiter';
import { getPlugins, registerDefaultPlugins } from './core/plugins';

const enetIp = process.env.ENET_IP || '0.0.0.0';
const enetPort = Number(process.env.ENET_PORT || 17091);

const client = new Client({
  enet: { ip: enetIp, port: enetPort },
});

registerDefaultPlugins();

const rawLimiter = new RateLimiter({ windowMs: 1000, maxEvents: 30 });

client.on('ready', () => {
  logger.info(`ENet server listening on ${enetIp}:${enetPort}`);
  for (const p of getPlugins()) p.onReady?.(client);
});

client.on('error', (err: unknown) => {
  logger.error(`Client error: ${(err as Error)?.message || String(err)}`);
  for (const p of getPlugins()) p.onError?.(client, err);
});

client.on('connect', (netID: number) => {
  logger.info(`Peer connected: netID=${netID}`);
  for (const p of getPlugins()) p.onConnect?.(client, netID);
});

client.on('disconnect', (netID: number) => {
  logger.info(`Peer disconnected: netID=${netID}`);
  for (const p of getPlugins()) p.onDisconnect?.(client, netID);
});

client.on('raw', (netID: number, channelID: number, data: Buffer) => {
  const key = String(netID);
  if (!rawLimiter.allow(key)) {
    const { used, limit } = rawLimiter.getUsage(key);
    logger.warn(`Rate limited netID=${netID} used=${used}/${limit}`);
    return;
  }
  logger.debug(`raw packet from netID=${netID} channel=${channelID} size=${data?.length ?? 0}`);
  for (const p of getPlugins()) p.onRaw?.(client, netID, channelID, data);
});

process.on('uncaughtException', (err) => {
  logger.error(`uncaughtException: ${err.stack || err.message}`);
});
process.on('unhandledRejection', (reason) => {
  logger.error(`unhandledRejection: ${reason}`);
});

client.listen();