export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();
  private observers: Set<(metric: string, value: number) => void> = new Set();
  private fpsInterval: NodeJS.Timeout | null = null;
  private memoryInterval: NodeJS.Timeout | null = null;
  private warningInterval: NodeJS.Timeout | null = null;
  private frameCount = 0;
  private lastTime = 0;
  private isRunning = false;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  trackFPS(): void {
    if (this.isRunning) return;
    
    this.lastTime = performance.now();
    this.isRunning = true;
    
    const measureFPS = () => {
      if (!this.isRunning) return;
      
      this.frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - this.lastTime >= 1000) {
        const fps = Math.round((this.frameCount * 1000) / (currentTime - this.lastTime));
        this.recordMetric('fps', fps);
        this.frameCount = 0;
        this.lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
  }

  trackMemory(): void {
    if ('memory' in performance) {
      this.memoryInterval = setInterval(() => {
        if (!this.isRunning) return;
        
        const memory = (performance as any).memory;
        this.recordMetric('memory-used', memory.usedJSHeapSize / 1024 / 1024);
        this.recordMetric('memory-total', memory.totalJSHeapSize / 1024 / 1024);
        this.recordMetric('memory-limit', memory.jsHeapSizeLimit / 1024 / 1024);
      }, 5000);
    }
  }

  recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const values = this.metrics.get(name)!;
    values.push(value);
    
    if (values.length > 30) {
      values.shift();
    }
    
    this.observers.forEach(observer => observer(name, value));
  }

  getAverageMetric(name: string): number {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return 0;
    
    if (values.length > 10) {
      const sum = values.reduce((a, b) => a + b, 0);
      return sum / values.length;
    } else {
      return values.reduce((a, b) => a + b, 0) / values.length;
    }
  }

  getLatestMetric(name: string): number {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return 0;
    return values[values.length - 1];
  }

  subscribe(observer: (metric: string, value: number) => void): () => void {
    this.observers.add(observer);
    return () => this.observers.delete(observer);
  }

  start(): void {
    if (this.isRunning) return;
    
    this.trackFPS();
    this.trackMemory();
    
    this.warningInterval = setInterval(() => {
      if (!this.isRunning) return;
      
      const fps = this.getLatestMetric('fps');
      const memory = this.getLatestMetric('memory-used');
      
      if (fps < 30 && fps > 0) {
        console.warn('Low FPS detected:', fps);
      }
      
      if (memory > 100) {
        console.warn('High memory usage detected:', memory, 'MB');
      }
    }, 15000);
  }

  stop(): void {
    this.isRunning = false;
    
    if (this.fpsInterval) {
      clearInterval(this.fpsInterval);
      this.fpsInterval = null;
    }
    
    if (this.memoryInterval) {
      clearInterval(this.memoryInterval);
      this.memoryInterval = null;
    }
    
    if (this.warningInterval) {
      clearInterval(this.warningInterval);
      this.warningInterval = null;
    }
    
    this.metrics.clear();
    this.observers.clear();
    this.frameCount = 0;
    this.lastTime = 0;
  }

  getPerformanceSummary(): { fps: number; memory: number; warnings: string[] } {
    const fps = this.getAverageMetric('fps');
    const memory = this.getLatestMetric('memory-used');
    const warnings: string[] = [];
    
    if (fps < 30 && fps > 0) {
      warnings.push(`Low FPS: ${fps}`);
    }
    
    if (memory > 100) {
      warnings.push(`High memory usage: ${memory.toFixed(1)}MB`);
    }
    
    return { fps, memory, warnings };
  }

  isActive(): boolean {
    return this.isRunning;
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance(); 

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