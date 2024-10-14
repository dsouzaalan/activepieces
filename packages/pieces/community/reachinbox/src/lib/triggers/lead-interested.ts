import {
  createTrigger,
  Property,
  TriggerStrategy,
} from '@activepieces/pieces-framework';

const leadInterestedMessage = `
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
  5. Select the event type as "Lead Interested".
  6. Click on the "Test Trigger" button to simulate a test and capture the webhook response here.
  `;

export const leadInterested = createTrigger({
  name: 'leadInterested',
  displayName: 'Lead Interested',
  description: 'Triggers when a lead is set to interested.',
  props: {
    markdown: Property.MarkDown({
      value: leadInterestedMessage,
    }),
  },
  sampleData: {
    lead_id: 1,
    lead_email: 'recipient@example.com',
    event: 'LEAD_INTERESTED',
    timestamp: '2024-03-18T08:15:51.000Z',
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
