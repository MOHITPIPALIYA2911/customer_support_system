# Deployment Guide

This guide will help you deploy the KRUX Finance Customer Support System to various hosting platforms.

## Prerequisites

- Git repository with your code
- Node.js 18+ installed locally
- Account on your chosen hosting platform

## Deploy to Vercel (Recommended)

Vercel is the recommended platform for Next.js applications.

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Run deployment command:
```bash
vercel
```

3. Follow the prompts to link your project

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Visit [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Configure settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`
6. Click "Deploy"

Your app will be live at: `https://your-project-name.vercel.app`

## Deploy to Netlify

1. Push your code to GitHub

2. Visit [netlify.com](https://netlify.com)

3. Click "Add new site" > "Import an existing project"

4. Select your repository

5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`

6. Add environment variables (if any)

7. Click "Deploy site"

## Deploy to AWS Amplify

1. Push your code to GitHub/GitLab/Bitbucket

2. Open [AWS Amplify Console](https://console.aws.amazon.com/amplify/)

3. Click "Connect app"

4. Select your repository and branch

5. Configure build settings:
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

6. Deploy

## Build for Production

To build the application locally:

```bash
npm run build
npm start
```

This will:
1. Create an optimized production build
2. Start the production server on port 3000

## Environment Variables

Currently, the app doesn't require any environment variables as it uses localStorage for data persistence.

For future backend integration, you may need:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://api.kruxfinance.com
NEXT_PUBLIC_WS_URL=wss://ws.kruxfinance.com

# Authentication
NEXT_PUBLIC_AUTH_DOMAIN=auth.kruxfinance.com
```

## Static Export (Optional)

If you want to deploy as a static site:

1. Update `next.config.mjs`:
```javascript
const nextConfig = {
  output: 'export',
};
```

2. Build:
```bash
npm run build
```

3. Deploy the `out/` directory to any static hosting:
   - GitHub Pages
   - Cloudflare Pages
   - AWS S3

**Note**: Static export has limitations with dynamic routes and API routes.

## Custom Domain

### Vercel
1. Go to Project Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed

### Netlify
1. Go to Domain Settings
2. Add custom domain
3. Configure DNS or use Netlify DNS

## Post-Deployment Checklist

- [ ] Test customer chat interface
- [ ] Test support dashboard
- [ ] Verify authentication works
- [ ] Check localStorage persistence
- [ ] Test on mobile devices
- [ ] Verify all bot flows work
- [ ] Test agent tools and quick replies
- [ ] Ensure real-time sync works
- [ ] Check responsive design
- [ ] Test with demo credentials

## Monitoring & Analytics

For production, consider adding:

1. **Error Tracking**: Sentry, Rollbar
2. **Analytics**: Google Analytics, Mixpanel
3. **Performance**: Vercel Analytics, Web Vitals
4. **Logging**: LogRocket, Datadog

## Security Considerations

For production deployment:

1. Replace mock authentication with real auth (Auth0, NextAuth.js)
2. Add rate limiting for API calls
3. Implement CSRF protection
4. Use HTTPS only
5. Add security headers
6. Sanitize user inputs
7. Replace localStorage with secure backend

## Scaling Considerations

When moving to production:

1. Replace localStorage with backend API
2. Add WebSocket for real-time updates
3. Implement proper database (PostgreSQL, MongoDB)
4. Add Redis for caching
5. Use CDN for static assets
6. Implement load balancing
7. Add monitoring and alerting

## Troubleshooting

### Build Fails
- Clear `.next` folder and `node_modules`
- Run `npm install` again
- Check for TypeScript errors

### 404 Errors on Routes
- Ensure using Next.js App Router correctly
- Check file structure matches routes

### Styles Not Loading
- Verify Tailwind CSS configuration
- Check `globals.css` imports

## Support

For deployment issues:
- Check [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- Visit [Vercel Documentation](https://vercel.com/docs)
- Review platform-specific guides

---

**Last Updated**: November 2024

