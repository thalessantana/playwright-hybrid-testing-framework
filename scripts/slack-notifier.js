import fs from 'fs';

const WEBHOOK_URL = process.env.SLACK_WEBHOOK_URL;
const REPORT_URL = process.env.ALLURE_REPORT_URL || 'https://github.com';

if (!WEBHOOK_URL) {
  console.error('❌ Error: SLACK_WEBHOOK_URL environment variable is not defined.');
  process.exit(1);
}

const summaryPath = './allure-report/widgets/summary.json';
if (!fs.existsSync(summaryPath)) {
  console.error('❌ Error: allure-report/widgets/summary.json not found. Run "allure generate" first.');
  process.exit(1);
}

const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
const { passed, failed, broken, skipped, total } = summary.statistic;

const hasFailed = failed > 0 || broken > 0;
const statusText = hasFailed ? 'FAILED' : 'PASSED';
const statusEmoji = hasFailed ? '🚨' : '✅';
const cardColor = hasFailed ? '#E01E5A' : '#2EB886';

const payload = {
  attachments: [
    {
      color: cardColor,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `${statusEmoji} E2E Test Execution: ${statusText}`,
            emoji: true,
          },
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Total Scenarios:* ${total}` },
            { type: 'mrkdwn', text: `*Passed:* :white_check_mark: ${passed}` },
            { type: 'mrkdwn', text: `*Failed:* :x: ${failed}` },
            { type: 'mrkdwn', text: `*Skipped/Broken:* :warning: ${skipped + broken}` },
          ],
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: { type: 'plain_text', text: '📊 View Allure Report' },
              url: REPORT_URL,
              style: hasFailed ? 'danger' : 'primary',
            },
          ],
        },
      ],
    },
  ],
};

/**
 * Sends the test execution notification to the configured Slack webhook.
 */
async function sendNotification() {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      console.log('✅ Slack notification sent successfully!');
    } else {
      console.error('❌ Failed to send Slack notification:', await response.text());
    }
  } catch (error) {
    console.error('❌ Network error:', error);
  }
}

sendNotification();