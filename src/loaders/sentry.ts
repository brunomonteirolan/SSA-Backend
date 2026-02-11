import { Express } from "express";

// Sentry is optional. To enable it:
// 1. npm install @sentry/node
// 2. Set SENTRY_DSN in your .env
// 3. Uncomment the code below

export const setupSentry = (_app: Express) => {
  // import * as Sentry from "@sentry/node";
  // Sentry.init({ dsn: process.env.SENTRY_DSN, tracesSampleRate: 0.5 });
};
