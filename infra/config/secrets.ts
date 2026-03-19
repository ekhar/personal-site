import * as pulumi from '@pulumi/pulumi';

const config = new pulumi.Config();
const getSecret = (name: string): pulumi.Output<string> => config.requireSecret(name);

export const secrets = {
	// Cloudflare
	CloudflareAccountId: getSecret('CloudflareAccountId'),
	CloudflareZoneId: getSecret('CloudflareZoneId'),

	// Vercel
	VercelTeamId: getSecret('VercelTeamId'),
	VercelApiToken: getSecret('VercelApiToken'),

	// Supabase
	SupabaseUrl: getSecret('SupabaseUrl'),
	SupabasePublishableKey: getSecret('SupabasePublishableKey'),

	// Zero Trust: email to allow through access gate
	AllowedEmail: getSecret('AllowedEmail'),
};
