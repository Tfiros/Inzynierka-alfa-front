class TokenRefreshScheduler {
  private refreshTimeoutId: ReturnType<typeof setTimeout> | null = null
  private refreshCallback: (() => Promise<void>) | null = null
  private failureCallback: (() => Promise<void>) | null = null

  scheduleRefresh(
    expiresInSeconds: number,
    onRefresh: () => Promise<void>,
    onFailure?: () => Promise<void>
  ) {
    this.cancel()

    this.refreshCallback = onRefresh
    this.failureCallback = onFailure ?? null

    const refreshBufferMs = 5 * 60 * 1000
    const refreshDelayMs = Math.max(
      expiresInSeconds * 1000 - refreshBufferMs,
      0
    )

    this.refreshTimeoutId = setTimeout(() => {
      this.executeRefresh()
    }, refreshDelayMs)
  }

  private async executeRefresh() {
    if (!this.refreshCallback) return

    try {
      await this.refreshCallback()
    } catch {
      this.cancel()

      if (this.failureCallback) {
        await this.failureCallback()
      }
    }
  }

  cancel() {
    if (this.refreshTimeoutId) {
      clearTimeout(this.refreshTimeoutId)
      this.refreshTimeoutId = null
    }

    this.refreshCallback = null
    this.failureCallback = null
  }
}

export const tokenRefreshScheduler = new TokenRefreshScheduler()
