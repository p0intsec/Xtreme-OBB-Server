/**
 * Xtreme Serverless OOB - Webhook Integration
 * Developed by p0intsec (06/2025)
 * MIT Licensed
 */

import axios from 'axios';

export async function sendToSlack(payload) {
  try {
    await axios.post(process.env.SLACK_WEBHOOK_URL, {
      text: `🚨 [OOB Alert] ${payload.attackType || 'Attack'} detected`,
      attachments: [{
        color: '#ff0000',
        fields: [
          { title: 'IP', value: payload.ip, short: true },
          { title: 'Method', value: payload.method, short: true },
          { title: 'Type', value: payload.attackType || 'Unknown', short: true },
          { title: 'Location', value: `${payload.geo.city}, ${payload.geo.country}`, short: true },
          { title: 'Timestamp', value: payload.timestamp, short: true },
          { title: 'Details', value: '```' + JSON.stringify(payload.details, null, 2) + '```' }
        ]
      }]
    });
  } catch (error) {
    console.error('Slack webhook error:', error);
  }
}

export async function sendToTelegram(payload) {
  try {
    const message = `🚨 *OOB Alert*: ${payload.attackType || 'Attack'}\n` +
                    `• *IP*: ${payload.ip}\n` +
                    `• *Method*: ${payload.method}\n` +
                    `• *Location*: ${payload.geo.city}, ${payload.geo.country}\n` +
                    `• *Time*: ${payload.timestamp}\n\n` +
                    '```json\n' +
                    JSON.stringify(payload.details, null, 2) +
                    '\n```';

    await axios.post(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      }
    );
  } catch (error) {
    console.error('Telegram webhook error:', error);
  }
}
