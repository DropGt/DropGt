import { Client } from 'growtopia.js';
export type Plugin = {
    onReady?: (client: Client) => void;
    onConnect?: (client: Client, netID: number) => void;
    onDisconnect?: (client: Client, netID: number) => void;
    onRaw?: (client: Client, netID: number, channelID: number, data: Buffer) => void;
    onError?: (client: Client, error: unknown) => void;
};
export declare function use(plugin: Plugin): void;
export declare function getPlugins(): Plugin[];
export declare function registerDefaultPlugins(): void;
//# sourceMappingURL=plugins.d.ts.map