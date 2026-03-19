import * as cloudflare from '@pulumi/cloudflare';
import { secrets } from '../config/secrets.ts';
import { dashboardDomain } from '../config/stage.ts';

// Zero Trust Access application for the personal dashboard
// Policy is defined inline — v6 Cloudflare provider pattern
export const dashboardAccessApp = new cloudflare.ZeroTrustAccessApplication(
	'dashboard-access',
	{
		zoneId: secrets.CloudflareZoneId,
		name: 'Personal Dashboard',
		domain: dashboardDomain,
		type: 'self_hosted',
		sessionDuration: '720h', // 30 days
		policies: [
			{
				name: 'Allow owner',
				decision: 'allow',
				precedence: 1,
				includes: [
					{
						email: {
							email: secrets.AllowedEmail,
						},
					},
				],
			},
		],
	},
);

export const zeroTrust = {
	dashboardAccessApp,
};
