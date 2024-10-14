import { createAction, Property } from '@activepieces/pieces-framework';
import { ReachinboxAuth } from '../..';
import { HttpMethod, httpClient } from '@activepieces/pieces-common';
import { reachinboxCommon } from '../common/index';

// Define the structure of the summary response
interface SummaryAnalyticsResponse {
  status: number;
  message: string;
  data: {
    totalSent: number;
    open: number;
    openRate: string;
    click: number;
    clickRate: string;
    reply: number;
    replyRate: string;
    result: Array<{
      date: string;
      sent: number;
      totalOpens: string;
      uniqueOpens: string;
      linksClicked: string;
      totalReplies: string;
    }>;
  };
}

export const getSummary = createAction({
  auth: ReachinboxAuth,
  name: 'getSummary',
  displayName: 'Get Summary',
  description: 'Get a summary of campaign analytics within a date range.',
  props: {
    startDate: Property.ShortText({
      displayName: 'Start Date',
      description: 'Enter the start date (YYYY-MM-DD). E.g. 2023-10-11',
      required: true,
    }),
    endDate: Property.ShortText({
      displayName: 'End Date',
<<<<<<< HEAD
      description: 'Enter the end date (YYYY-MM-DD). E.g. 2023-12-20',
=======
      description: 'Enter the end date (YYYY-MM-DD). E.g. 2023-10-20',
>>>>>>> 061f7bf26 (feat: integrate with ReachInbox service)
      required: true,
    }),
  },
  async run(context) {
    const { startDate, endDate } = context.propsValue;

<<<<<<< HEAD
    // Build the URL with the startDate and endDate query parameters
    const url = `https://api.reachinbox.ai/api/v1/analytics/summary?startDate=${startDate}&endDate=${endDate}`;
=======
    // Build the URL with the required start and end dates
    const url = `${reachinboxCommon.baseUrl}campaign/total-analytics?startDate=${startDate}&endDate=${endDate}`;
>>>>>>> 061f7bf26 (feat: integrate with ReachInbox service)

    try {
      const response = await httpClient.sendRequest<SummaryAnalyticsResponse>({
        method: HttpMethod.GET,
        url: url,
        headers: {
          Authorization: `Bearer ${context.auth as string}`,
        },
      });

      if (response.body.status === 200) {
        return {
          success: true,
          message: response.body.message,
          data: response.body.data,
        };
      } else {
        throw new Error(`Failed to fetch summary: ${response.body.message}`);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        return {
          success: false,
          message: 'Summary data not found for the provided date range.',
        };
      } else {
        throw new Error(`Failed to fetch summary: ${error.message}`);
      }
    }
  },
});
