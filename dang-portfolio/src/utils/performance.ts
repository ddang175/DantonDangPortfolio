// Performance monitoring utility
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();
  private observers: Set<(metric: string, value: number) => void> = new Set();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  // Track FPS
  trackFPS(): void {
    let frameCount = 0;
    let lastTime = performance.now();

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        this.recordMetric('fps', fps);
        frameCount = 0;
        lastTime = currentTime;
      }
      
      requestAnimationFrame(measureFPS);
    };

    requestAnimationFrame(measureFPS);
  }

  // Track memory usage
  trackMemory(): void {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      this.recordMetric('memory-used', memory.usedJSHeapSize / 1024 / 1024); // MB
      this.recordMetric('memory-total', memory.totalJSHeapSize / 1024 / 1024); // MB
    }
  }

  // Record a performance metric
  recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const values = this.metrics.get(name)!;
    values.push(value);
    
    // Keep only last 100 values
    if (values.length > 100) {
      values.shift();
    }
    
    // Notify observers
    this.observers.forEach(observer => observer(name, value));
  }

  // Get average metric value
  getAverageMetric(name: string): number {
    const values = this.metrics.get(name);
    if (!values || values.length === 0) return 0;
    
    const sum = values.reduce((a, b) => a + b, 0);
    return sum / values.length;
  }

  // Subscribe to metric changes
  subscribe(observer: (metric: string, value: number) => void): () => void {
    this.observers.add(observer);
    return () => this.observers.delete(observer);
  }

  // Start monitoring
  start(): void {
    this.trackFPS();
    this.trackMemory();
    
    // Monitor for performance issues
    setInterval(() => {
      const fps = this.getAverageMetric('fps');
      const memory = this.getAverageMetric('memory-used');
      
      if (fps < 30) {
        console.warn('Low FPS detected:', fps);
      }
      
      if (memory > 100) {
        console.warn('High memory usage detected:', memory, 'MB');
      }
    }, 5000);
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance(); 