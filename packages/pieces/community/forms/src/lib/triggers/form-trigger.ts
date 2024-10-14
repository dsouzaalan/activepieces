import {
  Property,
  TriggerStrategy,
  createTrigger,
} from '@activepieces/pieces-framework';
import { USE_DRAFT_QUERY_PARAM_NAME } from '@activepieces/shared';

const markdown = `**Published Form URL:**
\`\`\`text
{{formUrl}}
\`\`\`
Use this for production, views the published version of the form.
<br>
<br>
**Draft Form URL:**
\`\`\`text
{{formUrl}}?${USE_DRAFT_QUERY_PARAM_NAME}=true
\`\`\`
Use this to generate sample data, views the draft version of the from.
`;

const responseMarkdown = `
If **Wait for Response** is enabled, ensure the last step in the flow is either **Respond on UI (Markdown)** or **Respond on UI (File)**.
`;

export const onFormSubmission = createTrigger({
  name: 'form_submission',
  displayName: 'Web Form',
  description: 'Trigger the flow by submitting a form.',
  props: {
    about: Property.MarkDown({
      value: markdown,
    }),
    waitForResponse: Property.Checkbox({
      displayName: 'Wait for Response',
      defaultValue: false,
      required: true,
    }),
    response: Property.MarkDown({
      value: responseMarkdown,
    }),
    inputs: Property.Array({
      displayName: 'Inputs',
      required: true,
      properties: {
        displayName: Property.ShortText({
          displayName: 'Field Name',
          required: true,
        }),
        type: Property.StaticDropdown({
          displayName: 'Field Type',
          required: true,
          options: {
            options: [
              { value: 'text', label: 'Text' },
              { value: 'text_area', label: 'Text Area' },
              { value: 'file', label: 'File' },
              { value: 'toggle', label: 'Toggle' },
            ],
          },
        }),
        description: Property.ShortText({
          displayName: 'Field Description',
          required: false,
        }),
        required: Property.Checkbox({
          displayName: 'Required',
          required: true,
        }),
      },
    }),
  },
  sampleData: {},
  type: TriggerStrategy.WEBHOOK,
  async onEnable() {
    return;
  },
  async onDisable() {
    return;
  },
  async run(context) {
    return [context.payload.body];
  },
});
