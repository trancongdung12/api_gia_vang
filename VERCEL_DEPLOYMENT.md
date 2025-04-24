# Deploying to Vercel



1. A [Vercel account](https://vercel.com/signup)
2. [Vercel CLI](https://vercel.com/download) installed
3. Your Telegram bot token and chat ID

## Steps to Deploy

### 1. Install Vercel CLI (if not already installed)

```bash
npm i -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Deploy to Vercel

```bash
# From the project root
vercel
```

During the deployment process, Vercel will ask you some questions:
- Set up and deploy: Yes
- Which scope: Select your account
- Link to existing project: No
- Project name: gold-price-tracker (or your preferred name)
- Framework preset: Other

### 4. Set Environment Variables

After deployment, you need to set your environment variables:

1. Go to the [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to Settings > Environment Variables
4. Add the following variables:
   - `TELEGRAM_BOT_TOKEN`: Your Telegram bot token
   - `TELEGRAM_CHAT_ID`: Your Telegram chat ID

### 5. Redeploy (if needed)

If you've set environment variables after the first deployment, redeploy to apply them:

```bash
vercel --prod
```

## Vercel Cron Jobs

The application is configured to run a cron job every hour to check for gold price updates. This is defined in the `vercel.json` file:

```json
"crons": [
  {
    "path": "/trigger-update",
    "schedule": "0 * * * *"
  }
]
```

This configuration calls the `/trigger-update` endpoint every hour (at minute 0 of each hour).

## Checking Logs

To view logs of your deployed application:

1. Go to the Vercel Dashboard
2. Select your project
3. Navigate to "Deployments" tab
4. Select the latest deployment
5. Click on "Functions" to see function logs

## Troubleshooting

### Cron Jobs Not Running

Vercel cron jobs are only available on paid plans. If you're on a free plan, the cron job won't run automatically. In this case, you can:

1. Upgrade to a paid plan
2. Use an external service like [Cron-job.org](https://cron-job.org/) to periodically call your `/trigger-update` endpoint

### Application Errors

Check the function logs in the Vercel dashboard to identify any issues with your application.

### Cold Starts

Vercel deployments may experience "cold starts" where the first request takes longer to process. This is normal behavior for serverless functions. 