"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiter = void 0;
class RateLimiter {
    constructor(options) {
        this.keyToTimestamps = new Map();
        this.windowMs = options.windowMs;
        this.maxEvents = options.maxEvents;
    }
    allow(key) {
        const now = Date.now();
        const cutoff = now - this.windowMs;
        const arr = this.keyToTimestamps.get(key) || [];
        // drop old
        while (arr.length > 0 && arr[0] < cutoff)
            arr.shift();
        if (arr.length >= this.maxEvents) {
            this.keyToTimestamps.set(key, arr);
            return false;
        }
        arr.push(now);
        this.keyToTimestamps.set(key, arr);
        return true;
    }
    getUsage(key) {
        const now = Date.now();
        const cutoff = now - this.windowMs;
        const arr = (this.keyToTimestamps.get(key) || []).filter((t) => t >= cutoff);
        return { used: arr.length, limit: this.maxEvents };
    }
}
exports.RateLimiter = RateLimiter;
//# sourceMappingURL=rateLimiter.js.map