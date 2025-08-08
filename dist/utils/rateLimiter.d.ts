export declare class RateLimiter {
    private readonly windowMs;
    private readonly maxEvents;
    private readonly keyToTimestamps;
    constructor(options: {
        windowMs: number;
        maxEvents: number;
    });
    allow(key: string): boolean;
    getUsage(key: string): {
        used: number;
        limit: number;
    };
}
//# sourceMappingURL=rateLimiter.d.ts.map