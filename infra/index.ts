import { domain, blogDomain, dashboardDomain } from './config/stage.ts';
import { dnsRecords } from './components/dns.ts';
import { zeroTrust } from './components/zero-trust.ts';
import { vercelProjects } from './components/vercel.ts';
import { dashboardRouter } from './components/dashboard-router.ts';

export const outputs = {
	domain,
	blogDomain,
	dashboardDomain,

	// DNS
	blogCnameId: dnsRecords.blogCname.id,
	wwwCnameId: dnsRecords.wwwCname.id,

	// Zero Trust
	dashboardAccessAppId: zeroTrust.dashboardAccessApp.id,

	// Vercel
	blogProjectId: vercelProjects.blogProject.id,
	dashboardProjectId: vercelProjects.dashboardProject.id,

	// Dashboard proxy (Worker → Vercel)
	dashboardWorkerId: dashboardRouter.workerId,
	dashboardCustomDomainId: dashboardRouter.customDomainId,
};
