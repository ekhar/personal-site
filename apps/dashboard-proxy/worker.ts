const ORIGIN = 'https://erickhar-dashboard.vercel.app';

export default {
	async fetch(request: Request): Promise<Response> {
		const url = new URL(request.url);
		const origin = new URL(ORIGIN);
		url.hostname = origin.hostname;
		url.protocol = origin.protocol;

		return fetch(
			new Request(url.toString(), {
				method: request.method,
				headers: request.headers,
				body: request.body,
				redirect: 'manual',
			}),
		);
	},
};
