import { createAction, Property } from '@activepieces/pieces-framework';
import { fetchCampaigns, addLeadsToCampaign } from '../common/index';
import { ReachinboxAuth } from '../..';
import { HttpMethod, httpClient } from '@activepieces/pieces-common';

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

    try {
      const response = await httpClient.sendRequest({
        method: HttpMethod.POST,
        url: 'https://api.reachinbox.ai/api/v1/leads/add',
        headers: {
          Authorization: `Bearer ${context.auth}`,
          'Content-Type': 'application/json',
        },
        body,
      });

      if (response.status === 200) {
        return {
          success: true,
          message: response.body.message || 'Leads added successfully.',
          leadCount: response.body.leadCount,
        };
      } else {
        throw new Error(`Failed to add leads: ${response.body.message}`);
      }
    } catch (error) {
      console.error('Error adding leads:', error);
      throw new Error('Failed to add leads to the campaign.');
    }
  },
});
