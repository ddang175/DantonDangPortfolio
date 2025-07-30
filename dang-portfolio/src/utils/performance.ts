export const getOptimalFrameRate = (): number => {
  if (typeof window === "undefined") return 60;

  const refreshRate = (window.screen as any)?.refreshRate || 60;

  if (refreshRate >= 120) {
    return 60;
  } else if (refreshRate >= 90) {
    return 60;
  } else {
    return 60;
  }
};

export const isHighRefreshRateMonitor = (): boolean => {
  if (typeof window === "undefined") return false;

  const refreshRate = (window.screen as any)?.refreshRate || 60;
  return refreshRate > 60;
};

export const getDevicePixelRatio = (): number => {
  if (typeof window === "undefined") return 1;
  return Math.min(window.devicePixelRatio || 1, 2);
};

export const throttleRAF = <T extends (...args: any[]) => any>(
  func: T,
  limit: number = 16
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const isLowEndDevice = (): boolean => {
  if (typeof window === "undefined") return false;

  const memory = (navigator as any).deviceMemory;
  if (memory && memory < 4) return true;

  const cores = (navigator as any).hardwareConcurrency;
  if (cores && cores < 4) return true;

  const userAgent = navigator.userAgent.toLowerCase();
  if (/mobile|android|iphone|ipad/.test(userAgent)) return true;

  return false;
};
