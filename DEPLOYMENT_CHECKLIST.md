# 🚀 Production Deployment Checklist

## Pre-Deployment (Day Before)

### Code Review
- [ ] All changes reviewed and approved
- [ ] No console errors/warnings
- [ ] TypeScript builds without errors
- [ ] All tests passing (if any)

### Performance Validation
- [ ] Lighthouse Desktop: 90+
- [ ] Lighthouse Mobile: 85+
- [ ] LCP: < 2.5 seconds
- [ ] FID: < 100ms
- [ ] CLS: < 0.1
- [ ] Animations: 60 FPS on scroll

### Browser Testing
- [ ] Chrome (Latest)
- [ ] Firefox (Latest)
- [ ] Safari (Latest)
- [ ] Edge (Latest)

### Mobile Testing
- [ ] iPhone 12/13/14
- [ ] Android (Samsung/Pixel)
- [ ] 4G network simulation
- [ ] 3G network simulation

### Accessibility Check
- [ ] WCAG 2.1 Level AA compliance
- [ ] Tab navigation works
- [ ] Screen reader compatible
- [ ] Color contrast > 4.5:1
- [ ] Keyboard only navigation

---

## Deployment Day

### 1. Final Build
```bash
# Clear cache
rm -rf dist node_modules/.vite

# Install dependencies
npm ci  # Use ci instead of install for clean install

# Build
npm run build

# Verify build size
# Expected: ~170KB gzipped, no errors
```

### 2. Pre-deployment Lighthouse Audit
```bash
# Build and audit
npx vite preview

# Run Lighthouse on local build
# Screenshot the report
# Save as proof of performance
```

### 3. Version Bump (if using git)
```bash
# Update version in package.json
npm version patch  # or minor/major

# Tag in git
git tag -a v1.0.1 -m "Performance optimization release"
```

### 4. Deploy to Production

#### Option A: Vercel
```bash
npm install -g vercel
vercel --prod
# Vercel runs Lighthouse automatically
# Check https://vercel.com/dashboard
```

#### Option B: Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
# Check https://app.netlify.com/teams/[team]/builds
```

#### Option C: GitHub Pages
```bash
# Add to package.json
"homepage": "https://yourdomain.com"

# Deploy
npm run build
npx gh-pages -d dist
```

#### Option D: Self-Hosted (Nginx)
```bash
# Build
npm run build

# Upload dist folder to server
scp -r dist/* user@server:/var/www/html/

# On server, set cache headers
# See nginx.conf below
```

### 5. Post-Deployment Verification

```bash
# 1. Check site is live
curl https://yourdomain.com

# 2. Run Lighthouse on production
# Chrome DevTools on live URL
# Should still be 90+

# 3. Check Core Web Vitals
# Wait 24-48 hours
# Google PageSpeed Insights
# Search Console

# 4. Monitor errors
# Sentry, LogRocket, or similar
# Check for JavaScript errors
```

---

## Server Configuration Examples

### Nginx (nginx.conf)
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com;
    
    # SSL certificates
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    # Enable gzip
    gzip on;
    gzip_types text/css text/javascript 
               application/javascript 
               application/json image/svg+xml;
    gzip_min_length 1000;
    gzip_comp_level 6;
    
    # Root directory
    root /var/www/html;
    
    # Default file
    index index.html;
    
    # Cache headers for different file types
    location / {
        # HTML - no cache
        if ($request_filename ~* ^.*?\.(html)$) {
            add_header Cache-Control "no-cache, no-store, must-revalidate";
        }
        
        # JS/CSS - 1 year
        if ($request_filename ~* ^.*?\.(js|css)$) {
            add_header Cache-Control "public, max-age=31536000";
        }
        
        # Images - 1 month
        if ($request_filename ~* ^.*?\.(png|jpg|jpeg|gif|svg|ico)$) {
            add_header Cache-Control "public, max-age=2592000";
        }
        
        # Security headers
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        
        # SPA routing
        try_files $uri $uri/ /index.html;
    }
    
    # Deny access to hidden files
    location ~ /\. {
        deny all;
    }
}
```

### Apache (.htaccess)
```apache
# Enable mod_rewrite
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /
    
    # SPA routing
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^ index.html [QSA,L]
</IfModule>

# Enable gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE text/javascript
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
    AddOutputFilterByType DEFLATE image/svg+xml
</IfModule>

# Cache headers
<FilesMatch "\.(html|htm)$">
    Header set Cache-Control "no-cache, no-store, must-revalidate"
    Header set Pragma "no-cache"
    Header set Expires "0"
</FilesMatch>

<FilesMatch "\.(js|css)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>

<FilesMatch "\.(jpg|jpeg|png|gif|ico|svg)$">
    Header set Cache-Control "public, max-age=2592000"
</FilesMatch>

# Security headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
    Header set Referrer-Policy "no-referrer-when-downgrade"
</IfModule>
```

### Node.js Express
```javascript
const express = require('express');
const compression = require('compression');
const path = require('path');

const app = express();

// Enable compression
app.use(compression());

// Serve static files with cache headers
app.use(express.static(path.join(__dirname, 'dist'), {
    maxAge: '31d',
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
            res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
        } else if (filePath.match(/\.(js|css)$/)) {
            res.set('Cache-Control', 'public, max-age=31536000, immutable');
        }
    }
}));

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'no-referrer-when-downgrade');
    next();
});

// SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
```

---

## Monitoring Post-Deployment

### Google PageSpeed Insights
1. Visit https://pagespeed.web.dev/
2. Enter your domain
3. Check performance score (should be 90+)
4. Check Core Web Vitals

### Google Search Console
1. Add property at https://search.google.com/u/1/search-console
2. Verify ownership
3. Check Core Web Vitals report
4. Monitor for errors
5. Submit sitemap

### Sentry (Error Tracking)
```bash
npm install @sentry/react

# Add to main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_DSN_HERE",
  environment: "production",
  tracesSampleRate: 0.1,
});
```

### Google Analytics
```typescript
// Add to main.tsx
import { useEffect } from 'react';

useEffect(() => {
  // Google Analytics script
  window.dataLayer = window.dataLayer || [];
  function gtag(){
    dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', 'GA_ID');
}, []);
```

---

## Rollback Plan (If Issues)

### If Deployment Goes Wrong:

1. **Check error logs immediately**
   ```bash
   tail -f /var/log/nginx/error.log  # Nginx
   tail -f /var/www/html/error.log   # PHP
   ```

2. **Rollback to previous version**
   ```bash
   # If using git
   git revert HEAD
   git push
   
   # If using Vercel
   # Dashboard → Deployments → Click previous → Promote to Production
   
   # If manual server
   # Copy previous dist folder back
   scp -r backup/dist/* user@server:/var/www/html/
   ```

3. **Monitor after rollback**
   - Check logs for errors
   - Run Lighthouse
   - Verify all pages load

---

## Git Commit Messages

```bash
# Recommended commit structure

git commit -m "perf: Optimize bundle with code splitting and lazy loading

- Add code splitting for vendor libraries (animation, UI, scroll)
- Implement React.lazy() for all major components
- Add React.memo() to frequently re-rendered components
- Optimize image loading with lazy attribute
- Preload critical fonts in index.html
- Remove StrictMode from production build
- Add useCallback and useMemo hooks
- Optimize CSS animations and remove expensive patterns

Performance Impact:
- Bundle size: ~580KB → ~170KB (gzip)
- LCP: < 2.5s
- 60 FPS on scroll
- Expected Lighthouse: 90+"
```

---

## Post-Deployment Checklist

### Week 1
- [ ] No error spikes in monitoring
- [ ] Core Web Vitals stable
- [ ] User reports checked
- [ ] Analytics data normal

### Week 2
- [ ] Google Search Console shows improvement
- [ ] PageSpeed Insights shows 90+
- [ ] Mobile performance verified
- [ ] No regressions reported

### Week 4
- [ ] Real User Monitoring (RUM) data collected
- [ ] Performance improved vs baseline
- [ ] Core Web Vitals excellent
- [ ] Ready for further optimization

---

## Success Criteria

✅ **Deployment Successful When:**
- [ ] Site loads without errors
- [ ] Lighthouse Desktop: 90+
- [ ] Lighthouse Mobile: 85+
- [ ] LCP < 2.5s
- [ ] No console errors
- [ ] All features working
- [ ] Mobile responsive
- [ ] Animations smooth

❌ **Rollback If:**
- [ ] Site shows 404s
- [ ] Lighthouse drops below 80
- [ ] Core Web Vitals degrade
- [ ] JavaScript errors in console
- [ ] Features broken
- [ ] Performance worse than before

---

## Contact & Support

If deployment issues:
1. Check error logs
2. Review IMPLEMENTATION_COMPLETE.md
3. Review TESTING_GUIDE.md
4. Run local build to verify
5. Check browser console for errors
6. Use DevTools Performance tab to debug

---

**Good luck! 🚀**
