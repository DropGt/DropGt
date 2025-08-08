type TimestampMs = number;

export class RateLimiter {
  private readonly windowMs: number;
  private readonly maxEvents: number;
  private readonly keyToTimestamps: Map<string, TimestampMs[]> = new Map();

  constructor(options: { windowMs: number; maxEvents: number }) {
    this.windowMs = options.windowMs;
    this.maxEvents = options.maxEvents;
  }

  allow(key: string): boolean {
    const now = Date.now();
    const cutoff = now - this.windowMs;
    const arr = this.keyToTimestamps.get(key) || [];
    // drop old
    while (arr.length > 0 && (arr[0] as number) < cutoff) arr.shift();
    if (arr.length >= this.maxEvents) {
      this.keyToTimestamps.set(key, arr);
      return false;
    }
    arr.push(now);
    this.keyToTimestamps.set(key, arr);
    return true;
  }

  getUsage(key: string): { used: number; limit: number } {
    const now = Date.now();
    const cutoff = now - this.windowMs;
    const arr = (this.keyToTimestamps.get(key) || []).filter((t) => t >= cutoff);
    return { used: arr.length, limit: this.maxEvents };
  }
}