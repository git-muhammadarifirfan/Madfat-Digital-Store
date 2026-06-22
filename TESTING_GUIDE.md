# 🚀 Performance Testing & Deployment Guide

## Quick Start

### 1. Local Testing
```bash
# Build optimized production bundle
npm run build

# Preview the built site (requires install)
npm install -g serve
serve -s dist

# Or use Vite preview
npx vite preview
```

### 2. Lighthouse Desktop Audit
```bash
# Option 1: Chrome DevTools (Manual)
1. Open Chrome DevTools (F12)
2. Click on "Lighthouse" tab
3. Select "Desktop"
4. Click "Analyze page load"
5. Wait for report

# Option 2: CLI with Lighthouse
npm install -g @lhci/cli@latest
npm install @lhci/cli --save-dev
npx lhci autorun
```

### 3. Lighthouse Mobile Audit
```bash
# In Chrome DevTools
1. Open Chrome DevTools (F12)
2. Click on "Lighthouse" tab
3. Select "Mobile"
4. Click "Analyze page load"
```

### 4. Performance Profiling
```bash
# Method 1: Chrome DevTools Performance Tab
1. npm run build && npx vite preview
2. Open Chrome DevTools (F12)
3. Go to Performance tab
4. Click record (red circle)
5. Interact with page for ~10 seconds
6. Stop recording
7. Analyze the timeline

# Method 2: Web Vitals
1. Install Web Vitals extension in Chrome
2. Run the site locally
3. Check Core Web Vitals measurements
```

## 📊 Target Metrics

### Lighthouse Scores
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 95+

### Core Web Vitals (Real User Monitoring)
- **LCP** (Largest Contentful Paint): < 2.5s ✅
- **FID** (First Input Delay): < 100ms ✅
- **CLS** (Cumulative Layout Shift): < 0.1 ✅
- **TTFB** (Time to First Byte): < 600ms ✅
- **FCP** (First Contentful Paint): < 1.8s ✅

## 🔍 Performance Debugging

### Chrome DevTools Performance Tab Checklist

1. **Rendering Performance**
   - FPS gauge should stay green (60 FPS)
   - No long tasks (> 50ms)
   - Smooth animations on scroll

2. **Network Performance**
   - CSS: < 10KB (gzipped)
   - JS bundles: < 75KB (gzipped)
   - Images: < 100KB each
   - Total: < 500KB (gzipped)

3. **Layout & Paint**
   - No layout thrashing
   - Paint time < 10ms
   - Composite time < 5ms

### Common Performance Issues & Fixes

| Issue | Symptom | Fix |
|-------|---------|-----|
| Janky animations | Unsmooth scrolling | ✅ Already using GPU-accelerated transforms |
| Slow images | Delayed LCP | ✅ Lazy loading implemented |
| Large JS | Slow FCP | ✅ Code splitting enabled |
| Re-renders | High CPU | ✅ React.memo + useCallback added |
| Font loading | FOUT | ✅ Font preload added |
| Layout shift | High CLS | ✅ Image dimensions set |

## 🧪 Testing Scenarios

### Scenario 1: Desktop (Fast 4G)
```bash
# Simulate fast 4G network
Chrome DevTools → Network → Fast 4G
Expected: LCP < 2.5s, Performance > 90
```

### Scenario 2: Mobile (4G)
```bash
# Simulate 4G network on mobile
Chrome DevTools → Network → 4G
Expected: LCP < 3s, Performance > 85
```

### Scenario 3: Mobile (3G Slow)
```bash
# Simulate 3G network on mobile
Chrome DevTools → Network → Slow 3G
Expected: LCP < 4s, Performance > 75
```

### Scenario 4: CPU Throttling
```bash
# Simulate slower device
Chrome DevTools → Performance → 4x slowdown
Expected: All animations smooth
```

## 📱 Mobile Testing

### Device Testing
```bash
# Option 1: Android device via USB
adb reverse tcp:5173 tcp:5173
# Then visit http://localhost:5173 on phone

# Option 2: Chrome DevTools device emulation
Chrome DevTools → Toggle device toolbar (Ctrl+Shift+M)
Test different devices from dropdown

# Option 3: Ngrok for testing on real devices
npm install -g ngrok
npx vite preview
ngrok http 4173
# Share ngrok URL with others
```

### Testing Checklist
- [ ] Scroll is smooth (60 FPS)
- [ ] Buttons respond immediately
- [ ] Images load without jumping
- [ ] Text is readable
- [ ] No layout shifts
- [ ] Animations are fluid

## 🎯 Optimization Opportunities

### If Performance Score < 90:

1. **Check LCP Issues**
   ```bash
   # In DevTools Performance tab
   - Look for red "Largest Contentful Paint"
   - Check if images are causing delays
   - Verify preload links are working
   ```

2. **Reduce JavaScript**
   ```bash
   # Check bundle sizes
   npm install --save-dev vite-plugin-visualizer
   # Add to vite.config.ts and analyze
   ```

3. **Optimize Images**
   ```bash
   # Convert images to WebP
   npm install --save-dev vite-plugin-compression
   # Add gzip/brotli compression
   ```

4. **Add Service Worker**
   ```bash
   # For offline support
   npm install workbox-window
   # Implement in src/main.tsx
   ```

## 📈 Monitoring in Production

### Option 1: Google Analytics + Web Vitals
```javascript
// Add to main.tsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### Option 2: Sentry for Error Tracking
```bash
npm install @sentry/react
# Setup in main.tsx
```

### Option 3: Vercel Analytics
```bash
# Built-in with Vercel deployment
# No additional setup needed
```

## 🚀 Deployment Optimization

### For Vercel:
```bash
npm install -g vercel
vercel --prod
# Lighthouse audits automatically on each deploy
```

### For Netlify:
```bash
npm install -g netlify-cli
netlify deploy --prod
# Add netlify.toml:
[build]
  command = "npm run build"
  publish = "dist"

[edge]
  function = "netlify/edge-functions/**/*.ts"
```

### For Custom Server:
```bash
# Build
npm run build

# Use web server with compression
# Apache: Enable gzip in .htaccess
# Nginx: Enable gzip in nginx.conf
# Node: Use compression middleware

# Set proper cache headers
# JS/CSS: 1 year
# HTML: No cache
# Images: 1 month
```

## ✅ Final Checklist

- [ ] npm run build completes without errors
- [ ] All bundles are code-split correctly
- [ ] Lighthouse Desktop score > 90
- [ ] Lighthouse Mobile score > 85
- [ ] LCP < 2.5s
- [ ] FID < 100ms
- [ ] CLS < 0.1
- [ ] No console errors/warnings
- [ ] Animations are 60 FPS
- [ ] All images load without jumping
- [ ] Mobile responsive design works
- [ ] Accessibility score > 95
- [ ] SEO score > 95

## 📞 Support & Troubleshooting

If you encounter issues during optimization:

1. **Clear build cache**
   ```bash
   rm -rf dist node_modules/.vite
   npm run build
   ```

2. **Check Lighthouse failing audits**
   - Click "Learn More" in the report
   - Follow Google's recommendations

3. **Profile with DevTools**
   - Use Performance tab
   - Check what's causing slowness
   - Use Lighthouse for specific suggestions

4. **Check Console**
   - Look for errors/warnings
   - Third-party scripts slowing page
   - Memory leaks in animations

## 📚 Resources

- [Web Vitals Guide](https://web.dev/vitals/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [React Performance](https://react.dev/reference/react/memo)
- [Vite Optimization](https://vitejs.dev/guide/features.html#dynamic-import)
