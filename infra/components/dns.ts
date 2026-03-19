import * as cloudflare from '@pulumi/cloudflare';
import { secrets } from '../config/secrets.ts';
import { blogDomain, dashboardDomain } from '../config/stage.ts';

// Blog (erickhar.com) → Vercel (A record, existing)
export const blogCname = new cloudflare.DnsRecord('blog-cname', {
	zoneId: secrets.CloudflareZoneId,
	name: 'erickhar.com',
	type: 'A',
	content: '76.76.21.21',
	comment: 'vercel',
	proxied: true,
	ttl: 1,
});

// www → redirect to apex
export const wwwCname = new cloudflare.DnsRecord('www-cname', {
	zoneId: secrets.CloudflareZoneId,
	name: 'www.erickhar.com',
	type: 'CNAME',
	content: 'cname.vercel-dns.com',
	comment: 'vercel',
	proxied: true,
	ttl: 1,
});

// Dashboard (personal.erickhar.com) → Vercel
export const dashboardCname = new cloudflare.DnsRecord('dashboard-cname', {
	zoneId: secrets.CloudflareZoneId,
	name: 'personal',
	type: 'CNAME',
	content: 'cname.vercel-dns.com',
	proxied: true,
	ttl: 1,
});

export const dnsRecords = {
	blogCname,
	wwwCname,
	dashboardCname,
};
