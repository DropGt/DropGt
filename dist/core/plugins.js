"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.use = use;
exports.getPlugins = getPlugins;
exports.registerDefaultPlugins = registerDefaultPlugins;
const growtopia_js_1 = require("growtopia.js");
const logger_1 = require("../utils/logger");
const registry = [];
function use(plugin) {
    registry.push(plugin);
}
function getPlugins() {
    return registry;
}
function registerDefaultPlugins() {
    // Greeter plugin: sends a simple text packet on connect
    use({
        onConnect: (client, netID) => {
            try {
                const peer = new growtopia_js_1.Peer(client, netID);
                peer.send(growtopia_js_1.TextPacket.from(0x1));
            }
            catch (e) {
                logger_1.logger.warn(`Greeter plugin failed for netID ${netID}: ${e.message}`);
            }
        },
    });
}
//# sourceMappingURL=plugins.js.map