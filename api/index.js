/**
 * Xtreme Serverless OOB - API Handler
 * Developed by p0intsec (06/2025)
 * MIT Licensed
 */

import { VercelResponse, VercelRequest } from '@vercel/node';
import secrets from '@vercel/secrets';
import { handleXSS, handleSSRF, handleSQLi, handleRedirect } from './handlers';
import { captureScreenshot } from '../src/utils/imgbb';
import { sendToSlack, sendToTelegram } from '../src/utils/webhooks';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const requestData = {
    method: req.method,
    headers: req.headers,
    cookies: req.cookies,
    query: req.query,
    body: req.body,
    ip: req.headers['x-real-ip'] || req.socket.remoteAddress,
    geo: {
      country: req.headers['x-vercel-ip-country'],
      region: req.headers['x-vercel-ip-country-region'],
      city: req.headers['x-vercel-ip-city'],
    },
    timestamp: new Date().toISOString(),
  };

  // Process based on attack type
  if (req.query.type === 'xss') await handleXSS(requestData);
  else if (req.query.type === 'ssrf') await handleSSRF(requestData);
  else if (req.query.type === 'sqli') await handleSQLi(requestData);
  else if (req.query.type === 'redirect') await handleRedirect(requestData);

  // Screenshot capture if requested
  if (req.query.capture && secrets.IMGBB_API_KEY) {
    const screenshotUrl = await captureScreenshot(req.query.url, secrets.IMGBB_API_KEY);
    requestData.screenshot = screenshotUrl;
  }

  // Send notifications
  if (secrets.SLACK_WEBHOOK_URL) await sendToSlack(requestData);
  if (secrets.TELEGRAM_BOT_TOKEN && secrets.TELEGRAM_CHAT_ID) {
    await sendToTelegram(requestData);
  }

  // Log the request
  logRequest(requestData);

  res.status(200).json({ status: 'logged', data: requestData });
}

function logRequest(data) {
  // In a real implementation, this would send to database and WebSocket
  console.log('New OOB request:', JSON.stringify(data, null, 2));
}
