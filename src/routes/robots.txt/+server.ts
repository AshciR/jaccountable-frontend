import { env } from '$env/dynamic/public';

export function GET() {
	const body =
		env.PUBLIC_APP_ENV === 'staging' ? 'User-agent: *\nDisallow: /' : 'User-agent: *\nDisallow:';

	return new Response(body, { headers: { 'Content-Type': 'text/plain' } });
}
