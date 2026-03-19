import { domain, blogDomain, dashboardDomain } from './config/stage.ts';
import { dnsRecords } from './components/dns.ts';
import { zeroTrust } from './components/zero-trust.ts';
import { vercelProjects } from './components/vercel.ts';

export const outputs = {
	domain,
	blogDomain,
	dashboardDomain,

	// DNS
	blogCnameId: dnsRecords.blogCname.id,
	wwwCnameId: dnsRecords.wwwCname.id,
	dashboardCnameId: dnsRecords.dashboardCname.id,

	// Zero Trust
	dashboardAccessAppId: zeroTrust.dashboardAccessApp.id,

	// Vercel
	blogProjectId: vercelProjects.blogProject.id,
	dashboardProjectId: vercelProjects.dashboardProject.id,
};
