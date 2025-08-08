"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const growtopia_js_1 = require("growtopia.js");
const logger_1 = require("./utils/logger");
const rateLimiter_1 = require("./utils/rateLimiter");
const plugins_1 = require("./core/plugins");
const enetIp = process.env.ENET_IP || '0.0.0.0';
const enetPort = Number(process.env.ENET_PORT || 17091);
const client = new growtopia_js_1.Client({
    enet: { ip: enetIp, port: enetPort },
});
(0, plugins_1.registerDefaultPlugins)();
const rawLimiter = new rateLimiter_1.RateLimiter({ windowMs: 1000, maxEvents: 30 });
client.on('ready', () => {
    logger_1.logger.info(`ENet server listening on ${enetIp}:${enetPort}`);
    for (const p of (0, plugins_1.getPlugins)())
        p.onReady?.(client);
});
client.on('error', (err) => {
    logger_1.logger.error(`Client error: ${err?.message || String(err)}`);
    for (const p of (0, plugins_1.getPlugins)())
        p.onError?.(client, err);
});
client.on('connect', (netID) => {
    logger_1.logger.info(`Peer connected: netID=${netID}`);
    for (const p of (0, plugins_1.getPlugins)())
        p.onConnect?.(client, netID);
});
client.on('disconnect', (netID) => {
    logger_1.logger.info(`Peer disconnected: netID=${netID}`);
    for (const p of (0, plugins_1.getPlugins)())
        p.onDisconnect?.(client, netID);
});
client.on('raw', (netID, channelID, data) => {
    const key = String(netID);
    if (!rawLimiter.allow(key)) {
        const { used, limit } = rawLimiter.getUsage(key);
        logger_1.logger.warn(`Rate limited netID=${netID} used=${used}/${limit}`);
        return;
    }
    logger_1.logger.debug(`raw packet from netID=${netID} channel=${channelID} size=${data?.length ?? 0}`);
    for (const p of (0, plugins_1.getPlugins)())
        p.onRaw?.(client, netID, channelID, data);
});
process.on('uncaughtException', (err) => {
    logger_1.logger.error(`uncaughtException: ${err.stack || err.message}`);
});
process.on('unhandledRejection', (reason) => {
    logger_1.logger.error(`unhandledRejection: ${reason}`);
});
client.listen();
//# sourceMappingURL=index.js.map