import { createAction, Property } from '@activepieces/pieces-framework';
import { fetchCampaigns, addLeadsToCampaign } from '../common/index';
import { ReachinboxAuth } from '../..';

export const addLeads = createAction({
  auth: ReachinboxAuth,
  name: 'addLeads',
  displayName: 'Add Leads',
  description:
    'Add leads to campaigns dynamically by selecting a campaign and entering lead details.',
  props: {
    campaignId: Property.Dropdown({
      displayName: 'Select Campaign',
      description: 'Choose a campaign from the list.',
      required: true,
      refreshers: ['auth'],
      options: async ({ auth }) => {
        const campaigns = await fetchCampaigns(auth as string);

        return {
          options: campaigns.map((campaign) => ({
            label: campaign.name,
            value: campaign.id.toString(),
          })),
          disabled: campaigns.length === 0,
        };
      },
    }),
    email: Property.ShortText({
      displayName: 'Email Address',
      description: 'Enter the email address for the lead',
      required: true,
    }),
    firstName: Property.ShortText({
      displayName: 'First Name',
      description: 'Enter the first name for the lead',
      required: true,
    }),
    lastName: Property.ShortText({
      displayName: 'Last Name',
      description: 'Enter the last name for the lead',
      required: false,
    }),
  },
  async run(context) {
    const { campaignId, email, firstName, lastName } = context.propsValue;
    const body = {
      campaignId,
      leads: [{ email, firstName, lastName }],
      newCoreVariables: ['firstName'],
      duplicates: [],
    };

    const response = await addLeadsToCampaign(context.auth, body);

    if (response.success) {
      return {
        success: true,
        message: response.message,
        leadCount: response.leadCount,
      };
    } else {
      throw new Error(`Failed to add leads: ${response.message}`);
    }
  },
});
