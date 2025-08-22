# Story 1.7: Performance Monitoring Setup - Optimization Foundation

## User Story

**As a** developer,  
**I want** performance monitoring and measurement tools integrated into our React/Vite application,  
**So that** I can validate optimizations, catch performance regressions, and maintain 60fps interactions.

## Story Context

**Performance Foundation Integration:**

- **Purpose:** Establish performance measurement baseline for Canvas image export and React component rendering
- **Technology:** Performance.now() APIs, React Profiler, Canvas benchmarking, Lighthouse CI
- **Follows pattern:** Client-side monitoring with minimal overhead (see `docs/architecture.md#performance-optimization`)
- **Touch points:** Canvas export system (`src/utils/export.ts`), message rendering performance, Vite build optimization

## Technical Implementation Details

**Files to Create/Modify:**

```typescript
// NEW FILES
src/utils/performance.ts         // Performance measurement utilities
src/hooks/usePerformanceMonitor.ts // React hook for component performance
src/components/debug/PerformancePanel.tsx // Dev-only performance dashboard

// MODIFY EXISTING
src/utils/export.ts             // Add Canvas performance monitoring
src/components/chat/MessageBubble.tsx // Add render performance tracking
package.json                    // Add Lighthouse CI and performance scripts
vite.config.ts                  // Add bundle analyzer and performance plugins
```

**Core Data Structures:**

```typescript
interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: Date;
  category: 'render' | 'export' | 'interaction' | 'bundle';
  threshold?: number;
}

interface PerformanceBudget {
  renderTime: number; // Max 16ms for 60fps
  exportTime: number; // Max 2s for image export
  bundleSize: number; // Max 200KB gzipped
  interactionDelay: number; // Max 100ms for interactions
}
```

## Acceptance Criteria

### Performance Measurement Infrastructure

1. **Performance timing utilities** using Performance.now() for Canvas export operations
2. **React Profiler integration** measuring component render time for MessageBubble and MessageList
3. **Memory usage monitoring** during image processing via PerformanceObserver
4. **Baseline metrics collection** for current Canvas export implementation

### Development Monitoring Tools

5. **Performance dashboard component** showing real-time metrics (dev mode only)
6. **Console performance logging** with categorized metrics and thresholds
7. **Performance regression detection** comparing against baseline metrics
8. **Bundle size monitoring** via Vite bundle analyzer integration

### CI/CD Performance Gates

9. **Lighthouse CI integration** in GitHub Actions pipeline
10. **Performance budget enforcement** failing builds that exceed thresholds
11. **Bundle size regression detection** in pull request checks
12. **Canvas export performance tests** in automated test suite

## Reference Documentation

- **Architecture Foundation:** `docs/architecture.md#performance-optimization` (Canvas optimization strategy)
- **Tech Stack:** `docs/architecture.md#simplified-tech-stack` (Vite configuration approach)
- **Export System:** `docs/architecture.md#export-system-architecture` (Canvas implementation patterns)
- **Dependencies on:** Story 1.1 (project setup), Story 1.4 (message data structure)

## Implementation Approach

**Environment Configuration:**

```bash
# .env.development
VITE_PERFORMANCE_MONITORING=true
VITE_PERFORMANCE_DASHBOARD=true
VITE_BUNDLE_ANALYZER=true
```

**Integration Pattern:**

- Conditional monitoring (development only) to prevent production overhead
- React Profiler wrapper components for critical paths
- Canvas export monitoring using Performance marks/measures
- Lighthouse CI integration following existing GitHub Actions pattern

## Testing Strategy

**Performance Test Scenarios:**

1. Canvas export with 50+ messages (target: <2s)
2. MessageBubble render with 100+ messages (target: <100ms)
3. Bundle size verification (target: <200KB gzipped)
4. First Contentful Paint measurement (target: <1.5s)

**Regression Detection:**

- Automated performance tests in Jest comparing against baseline
- Lighthouse CI thresholds: Performance >90, FCP <1.5s, TTI <3s
- Bundle size alerts for increases >10%

## Definition of Done

- ✅ **Performance utilities** implemented in `src/utils/performance.ts` with full TypeScript interfaces
- ✅ **Canvas export monitoring** integrated into existing export system
- ✅ **Development dashboard** accessible via debug mode (desktop only)
- ✅ **Lighthouse CI** running in GitHub Actions with performance budgets
- ✅ **Regression tests** preventing performance degradation >20%
- ✅ **Bundle monitoring** integrated into Vite build process
- ✅ **Documentation** updated with performance monitoring usage

## Risk and Compatibility Assessment

**Technical Risks:**

- **Primary Risk:** Performance monitoring overhead affecting 60fps target
- **Mitigation:** Development-only monitoring, lazy-loaded dashboard component
- **Rollback:** Feature flags to disable monitoring, removable with zero impact

**Compatibility Verification:**

- ✅ **No breaking changes:** Optional monitoring layer with feature flags
- ✅ **Browser support:** Performance API available in all target browsers (Chrome 90+, Safari 14+)
- ✅ **Bundle impact:** Monitoring code tree-shaken in production builds
- ✅ **CI/CD integration:** Lighthouse CI fits existing GitHub Actions workflow

---

_Epic 1: Foundation & Core Chat Interface_  
_Story 1.7 created by John (PM) - 22/08/2025_
