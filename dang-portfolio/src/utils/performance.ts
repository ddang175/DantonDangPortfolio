 

export const getOptimalFrameRate = (): number => {
  if (typeof window === 'undefined') return 60;
  
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
  if (typeof window === 'undefined') return false;
  
  const refreshRate = (window.screen as any)?.refreshRate || 60;
  return refreshRate > 60;
};

export const getDevicePixelRatio = (): number => {
  if (typeof window === 'undefined') return 1;
  return Math.min(window.devicePixelRatio || 1, 2);
}; 