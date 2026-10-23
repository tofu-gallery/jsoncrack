// Added by Tofu for the Tofu app gallery; TOFU.md at the repository root explains why.
// next.config.js resolves every import of "nextjs-google-analytics" to this file, so a copy of
// JSON Crack loads no Google Analytics script and sends no events: the component renders nothing
// and every function does nothing. The exports mirror nextjs-google-analytics 2.3.7.

export function GoogleAnalytics(_props?: Record<string, unknown>): null {
  return null;
}

export function usePageViews(_options?: Record<string, unknown>): void {}

export function usePagesViews(_options?: Record<string, unknown>): void {}

export function pageView(_options?: Record<string, unknown>, _measurementId?: string): void {}

export function event(_action: string, _options?: Record<string, unknown>): void {}

export function consent(_options?: Record<string, unknown>): void {}
