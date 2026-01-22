type RateLimiterOptions = {
  maxRequests: number
  perMilliseconds: number
  maxConcurrent?: number
}

type Cooldown = {
  until: number
  reason?: string
}

export class RateLimiter {
  private readonly maxRequests: number
  private readonly perMs: number
  private readonly maxConcurrent: number

  private readonly timestampsByKey = new Map<string, number[]>()

  private inFlight = 0
  private queue: Array<() => void> = []

  private readonly cooldownByKey = new Map<string, Cooldown>()

  constructor(opts: RateLimiterOptions) {
    this.maxRequests = opts.maxRequests
    this.perMs = opts.perMilliseconds
    this.maxConcurrent = opts.maxConcurrent ?? Infinity
  }

  public setCooldown(key: string, ms: number, reason?: string) {
    const until = Date.now() + Math.max(0, ms)
    this.cooldownByKey.set(key, { until, reason })
  }

  public async schedule(key: string): Promise<void> {
    await this.acquireSlot()

    try {
      await this.waitForCooldown(key)
      await this.waitForRate(key)
    } catch (e) {
      this.releaseSlot()
      throw e
    }
  }

  public release(key?: string) {
    this.releaseSlot()
  }

  private async acquireSlot(): Promise<void> {
    if (this.inFlight < this.maxConcurrent) {
      this.inFlight++
      return
    }

    await new Promise<void>((resolve) => {
      this.queue.push(() => {
        this.inFlight++
        resolve()
      })
    })
  }

  private releaseSlot() {
    this.inFlight = Math.max(0, this.inFlight - 1)
    const next = this.queue.shift()
    if (next) next()
  }

  private async waitForCooldown(key: string): Promise<void> {
    const cd = this.cooldownByKey.get(key)
    if (!cd) return

    const now = Date.now()
    if (cd.until <= now) {
      this.cooldownByKey.delete(key)
      return
    }

    await sleep(cd.until - now)
    this.cooldownByKey.delete(key)
  }

  private async waitForRate(key: string): Promise<void> {
    const now = Date.now()
    const windowStart = now - this.perMs

    const list = this.timestampsByKey.get(key) ?? []
    const fresh = list.filter((t) => t > windowStart)

    if (fresh.length < this.maxRequests) {
      fresh.push(now)
      this.timestampsByKey.set(key, fresh)
      return
    }

    const oldest = fresh[0]
    const waitMs = oldest + this.perMs - now

    await sleep(waitMs)
    return this.waitForRate(key)
  }
}

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

export function parseRetryAfterToMs(v: unknown): number | null {
  if (typeof v !== "string") return null
  const s = v.trim()
  if (!s) return null

  const asNum = Number(s)
  if (Number.isFinite(asNum) && asNum >= 0) {
    return Math.round(asNum * 1000)
  }

  const dt = Date.parse(s)
  if (!Number.isNaN(dt)) {
    const ms = dt - Date.now()
    return ms > 0 ? ms : 0
  }

  return null
}
