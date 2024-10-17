import {
  createTrigger,
  Property,
  TriggerStrategy,
} from '@activepieces/pieces-framework';

const leadNotInterestedMessage = `
  **Webhook URL:**
  \`\`\`text
  {{webhookUrl}}
  \`\`\`
  <br>
  <br>
  
  Follow the below steps:
  
  1. Login to the ReachInbox dashboard.
  2. Go to the "Profile" section and navigate to the "Settings" tab.
  3. Click on the "Integrations" and go to the "Webhooks". Click on the "Add Webhook" button.
  4. Copy the above webhook URL and paste it into the "Webhook URL" field.
  5. Select the event type as "Lead Not Interested".
  6. Click on the "Test Trigger" button to simulate a test and capture the webhook response here.
  `;

export const leadNotInterested = createTrigger({
  name: 'leadNotInterested',
  displayName: 'Lead Not Interested',
  description: 'Triggers when a lead is set to not interested.',
  props: {
    markdown: Property.MarkDown({
      value: leadNotInterestedMessage,
    }),
  },
  sampleData: {
<<<<<<< HEAD
<<<<<<< HEAD
    email_id: 1,
    lead_id: 1,
    lead_email: 'recipient@example.com',
    email_account: 'sender@example.com',
    step_number: 1,
    message_id: '<test-message-id>',
    timestamp: '2024-03-18T08:15:51.000Z',
    campaign_id: 1,
    campaign_name: 'Test Name',
    event: 'LEAD_NOT_INTERESTED',
    user_webhook_id: '1',
    lead_first_name: 'Lead First Name',
    lead_last_name: 'Lead Last Name',
    email_sent_body: 'Sent Email body',
    email_replied_body: 'Sent Replied body',
=======
=======
    email_id: 1,
>>>>>>> c8ced107b (fix: tested and resolved associated issues)
    lead_id: 1,
    lead_email: 'recipient@example.com',
    email_account: 'sender@example.com',
    step_number: 1,
    message_id: '<test-message-id>',
    timestamp: '2024-03-18T08:15:51.000Z',
<<<<<<< HEAD
>>>>>>> 061f7bf26 (feat: integrate with ReachInbox service)
=======
    campaign_id: 1,
    campaign_name: 'Test Name',
    event: 'LEAD_NOT_INTERESTED',
    user_webhook_id: '1',
    lead_first_name: 'Lead First Name',
    lead_last_name: 'Lead Last Name',
    email_sent_body: 'Sent Email body',
    email_replied_body: 'Sent Replied body',
>>>>>>> c8ced107b (fix: tested and resolved associated issues)
  },
  type: TriggerStrategy.WEBHOOK,
  async onEnable(context) {
    // Implement webhook subscription logic here
  },
  async onDisable(context) {
    // Implement webhook unsubscription logic here
  },
  async run(context) {
    return [context.payload.body];
  },
});
