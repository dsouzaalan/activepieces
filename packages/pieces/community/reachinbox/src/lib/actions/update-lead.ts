import { createAction, Property } from '@activepieces/pieces-framework';
import { fetchCampaigns, reachinboxCommon } from '../common/index';
import { ReachinboxAuth } from '../..';
import { HttpMethod, httpClient } from '@activepieces/pieces-common';

export const updateLead = createAction({
  auth: ReachinboxAuth,
  name: 'updateLead',
  displayName: 'Update Lead',
  description: 'Updates a Lead.',
  props: {
    campaignId: Property.Dropdown({
      displayName: 'Select Campaign',
      description:
        'Choose a campaign from the list or enter the campaign ID manually.',
      required: true,
      refreshers: ['auth'],
      options: async ({ auth }) => {
        const campaigns = await fetchCampaigns(auth as string);

        return {
          options: campaigns.map((campaign) => ({
            label: campaign.name,
            value: campaign.id,
          })),
          disabled: campaigns.length === 0,
        };
      },
    }),
    leadId: Property.Dropdown({
      displayName: 'Select Lead',
      description: 'Choose a lead from the selected campaign.',
      required: true,
      refreshers: ['campaignId'],
      options: async ({ auth, campaignId }) => {
        if (!campaignId) {
          return { options: [], disabled: true };
        }

        const response = await httpClient.sendRequest({
          method: HttpMethod.GET,
          url: `${reachinboxCommon.baseUrl}leads?campaignId=${campaignId}&lastLead=false`,
          headers: {
            Authorization: `Bearer ${auth as string}`,
          },
        });

        if (response.status !== 200) {
          throw new Error('Failed to fetch leads.');
        }

        const leads = Array.isArray(response.body.data.leads)
          ? response.body.data.leads
          : [];
        return {
          options: leads.map((lead: { email: any; id: any }) => ({
            label: lead.email,
            value: lead.id,
          })),
          disabled: leads.length === 0,
        };
      },
    }),
    email: Property.ShortText({
      displayName: 'Email',
      description: 'Enter the new email address for the lead.',
      required: true,
    }),
    firstName: Property.ShortText({
      displayName: 'First Name',
      description: 'Enter the new first name for the lead.',
      required: false,
    }),
    lastName: Property.ShortText({
      displayName: 'Last Name',
      description: 'Enter the new last name for the lead.',
      required: false,
    }),
  },
  async run(context) {
    const { campaignId, leadId, email, firstName, lastName } =
      context.propsValue;

    if (!campaignId || !leadId) {
      throw new Error('Campaign ID and Lead ID are required.');
    }

    const url = `${reachinboxCommon.baseUrl}leads/update`;

    try {
      const response = await httpClient.sendRequest({
        method: HttpMethod.PUT,
        url: url,
        headers: {
          Authorization: `Bearer ${context.auth as string}`,
          'Content-Type': 'application/json',
        },
        body: {
          campaignId: campaignId,
          leadId: leadId,
          email: email,
          attributes: {
            firstName: firstName || '',
            lastName: lastName || '',
          },
        },
      });

      if (response.status === 200) {
        return {
          success: true,
          message: response.body.message || 'Lead updated successfully.',
        };
      } else {
        throw new Error(`Failed to update lead: ${response.body.message}`);
      }
    } catch (error: any) {
      throw new Error(`Failed to update lead: ${error.message}`);
    }
  },
});
