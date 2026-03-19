import * as cloudflare from '@pulumi/cloudflare';
import { secrets } from '../config/secrets.ts';
import { dashboardDomain } from '../config/stage.ts';
import * as fs from 'node:fs';
import * as path from 'node:path';

const workerScript = fs.readFileSync(
	path.resolve(import.meta.dirname, '../../apps/dashboard-proxy/worker.ts'),
	'utf-8',
);

export const dashboardWorker = new cloudflare.WorkersScript(
	'dashboard-proxy',
	{
		accountId: secrets.CloudflareAccountId,
		scriptName: 'dashboard-proxy',
		content: workerScript,
		mainModule: 'worker.ts',
	},
);

export const dashboardCustomDomain = new cloudflare.WorkersCustomDomain(
	'dashboard-custom-domain',
	{
		accountId: secrets.CloudflareAccountId,
		hostname: dashboardDomain,
		service: dashboardWorker.scriptName,
		zoneId: secrets.CloudflareZoneId,
	},
);

export const dashboardRouter = {
	workerId: dashboardWorker.id,
	customDomainId: dashboardCustomDomain.id,
};
